'use client'

import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Day as DayEntity } from '@entities/day'

import { PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import { Container } from '@components/ui/Container'
import { Button } from '@components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { updateDay } from '@/api/day'

const dayDreamSchema = z.object({
	from: z.string(),
	to: z.string(),
})

const nightDreamAwakeningSchema = z.object({
	time: z.string(),
})

const formSchema = z.object({
	dayDreams: z.array(dayDreamSchema),
	nightDreamRating: z.string().optional(),
	nightDreamFrom: z.string().optional(),
	nightDreamAwakenings: z.array(nightDreamAwakeningSchema),
})

type DayProps = {
	day: DayEntity
}

export const Day = ({ day }: DayProps) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			dayDreams: [],
			nightDreamAwakenings: []
		},
	})

	const dayDreamsFieldsForm = useFieldArray({
		name: 'dayDreams',
		control: form.control,
	})

	const nightDreamAwakeningsFieldsForm = useFieldArray({
		name: 'nightDreamAwakenings',
		control: form.control,
	})

	const deleteDayDreamHandler = (dayDreamIndex: number) => {
		dayDreamsFieldsForm.remove(dayDreamIndex)
	}

	const addDayDreamHandler = () => {
		dayDreamsFieldsForm.append({ from: '', to: '' })
	}

	const deleteNightDreamAwakeningHandler = (
		nightDreamAwakeningIndex: number
	) => {
		nightDreamAwakeningsFieldsForm.remove(nightDreamAwakeningIndex)
	}

	const addNightDreamAwakeningHandler = () => {
		nightDreamAwakeningsFieldsForm.append({ time: '' })
	}

	const submitHandler = async (values: z.infer<typeof formSchema>) => {
		const mappedDayDreams = values.dayDreams.map((item) => ({
			from: new Date(`${item.from} ${day.date}`),
			to: new Date(`${item.to} ${day.date}`),
		}))

		const mappedNightDreamAwakenings = values.nightDreamAwakenings.map((item) => ({
			time: new Date(`${item.time} ${day.date}`),
		}))

		await updateDay({
			dayId: day.id,
			dayDreams: mappedDayDreams,
			nightDream: day.nightDream ? day.nightDream : undefined,
			nightDreamFrom: values.nightDreamFrom
				? new Date(`${values.nightDreamFrom} ${day.date}`)
				: undefined,
			nightDreamRating: values.nightDreamRating
				? Number(values.nightDreamRating)
				: undefined,
			nightDreamAwakenings: mappedNightDreamAwakenings
		})

		window.location.reload()
	}

	return (
		<Container>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(submitHandler)} className="space-y-4">
					<p>{new Date(day.date).toLocaleDateString()}</p>
					<p>
						<b>Время пробуждения</b>:{' '}
						{new Date(day?.wakeUpTime).toLocaleTimeString().slice(0, -3)}
					</p>
					<p>
						<b>Дневные сны</b>:{' '}
						{day.dayDreams.map((item, index) => (
							<span className="mr-3" key={index}>
								{new Date(item.from).toLocaleTimeString().slice(0, -3)}-
								{new Date(item.to).toLocaleTimeString().slice(0, -3)}
							</span>
						))}
					</p>

					{dayDreamsFieldsForm.fields.map((_item, index) => (
						<div key={index} className="flex gap-x-4">
							<FormField
								control={form.control}
								name={`dayDreams.${index}.from`}
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="От" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name={`dayDreams.${index}.to`}
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="До" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button
								type="button"
								variant="outline"
								onClick={() => deleteDayDreamHandler(index)}
								aria-label="Удалить дневной сон"
							>
								<TrashIcon className="h-4 w-4" />
							</Button>
						</div>
					))}

					<Button type="button" variant="outline" onClick={addDayDreamHandler}>
						Добавить <PlusIcon className="h-4 w-4" />
					</Button>

					<div>
						<b>Ночное засыпание</b>:{' '}
						{day.nightDream?.from ? (
							new Date(day.nightDream?.from).toLocaleTimeString().slice(0, -3)
						) : (
							<FormField
								control={form.control}
								name="nightDreamFrom"
								render={({ field }) => (
									<FormItem className="mt-2">
										<FormControl>
											<Input placeholder="Время" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
					</div>
					<div>
						<b>Рейтинг ночи</b>:{' '}
						{day.nightDream?.rating ? (
							day.nightDream?.rating
						) : (
							<FormField
								control={form.control}
								name="nightDreamRating"
								render={({ field }) => (
									<FormItem className="mt-2">
										<FormControl>
											<Input placeholder="Рейтинг" type="number" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
					</div>
					<div>
						<b>Ночные просыпания</b>:{' '}
						{day.nightDream?.awakenings.map((item, index) => (
							<span className="ml-3" key={index}>
								{new Date(item.time).toLocaleTimeString().slice(0, -3)}
							</span>
						))}
					</div>

					{nightDreamAwakeningsFieldsForm.fields.map((_item, index) => (
						<div key={index} className="flex gap-x-4">
							<FormField
								control={form.control}
								name={`nightDreamAwakenings.${index}.time`}
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="От" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button
								type="button"
								variant="outline"
								onClick={() => deleteNightDreamAwakeningHandler(index)}
								aria-label="Удалить дневной сон"
							>
								<TrashIcon className="h-4 w-4" />
							</Button>
						</div>
					))}

					<div>
						<Button
							type="button"
							variant="outline"
							onClick={addNightDreamAwakeningHandler}
						>
							Добавить <PlusIcon className="h-4 w-4" />
						</Button>
					</div>

					<div>
						<Button type="submit">Сохранить</Button>
					</div>
				</form>
			</Form>
		</Container>
	)
}
