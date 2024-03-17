'use client'

import { CreateDay } from '@api/day'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createDate } from '@/helpers/createDate'

type FormDayProps = {
	onSubmit: (params: CreateDay) => void
}

const dayDreamSchema = z.object({
	from: z.string(),
	to: z.string(),
})

const nightDreamAwakeningSchema = z.object({
	time: z.string(),
})

const formSchema = z.object({
	dayDate: z.string(),
	wakeUpTime: z.string(),
	dayDreams: z.array(dayDreamSchema).optional(),
	nightDreamRating: z.string().optional(),
	nightDreamFrom: z.string().optional(),
	nightDreamTo: z.string().optional(),
	nightDreamAwakenings: z.array(nightDreamAwakeningSchema).optional(),
})

const mapFormDayToCreateDayParams = (
	values: z.infer<typeof formSchema>
): CreateDay => {
	const {
		dayDate,
		wakeUpTime,
		dayDreams = [],
		nightDreamFrom,
		nightDreamTo,
		nightDreamRating,
		nightDreamAwakenings = [],
	} = values

	const mappedDayDreams = dayDreams.map((item) => ({
		from: createDate({ day: dayDate, hoursWithMinutes: item.from }),
		to: createDate({ day: dayDate, hoursWithMinutes: item.to }),
	}))

	const mappedNightDreamAwakenings = nightDreamAwakenings.map((item) => ({
		time: createDate({ day: dayDate, hoursWithMinutes: item.time }),
	}))

	return {
		wakeUpTime: createDate({
			day: dayDate,
			hoursWithMinutes: wakeUpTime,
		}),
		date: new Date(dayDate),
		shortDateId: dayDate,
		dayDreams: mappedDayDreams,
		nightDream: {
			from: nightDreamFrom
				? createDate({ day: dayDate, hoursWithMinutes: nightDreamFrom })
				: null,
			to: nightDreamTo
				? createDate({ day: dayDate, hoursWithMinutes: nightDreamTo })
				: null,
			rating: nightDreamRating === undefined ? null : Number(nightDreamRating),
		},
		nightDreamAwakenings: mappedNightDreamAwakenings,
	}
}

export const FormDay = ({ onSubmit }: FormDayProps) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			dayDate: new Date().toISOString().substring(0, 10),
			wakeUpTime: '08:30',
			dayDreams: [{ from: '12:00', to: '14:30' }],
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

	const submitHandler = async (values: z.infer<typeof formSchema>) => {
		const mappedData = mapFormDayToCreateDayParams(values)
		await onSubmit(mappedData)
	}

	const addDayDreamHandler = () => {
		dayDreamsFieldsForm.append({ from: '', to: '' })
	}

	const deleteDayDreamHandler = (dayDreamIndex: number) => {
		dayDreamsFieldsForm.remove(dayDreamIndex)
	}

	const addNightDreamAwakeningHandler = () => {
		nightDreamAwakeningsFieldsForm.append({ time: '' })
	}

	const deleteNightDreamAwakeningHandler = (dayDreamIndex: number) => {
		nightDreamAwakeningsFieldsForm.remove(dayDreamIndex)
	}

	return (
		<div className="max-w-96 ml-auto mx-auto py-6 px-4">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(submitHandler)} className="space-y-4">
					<FormField
						control={form.control}
						name="dayDate"
						render={({ field }) => (
							<FormItem>
								<FormLabel>День</FormLabel>
								<FormControl>
									<Input placeholder="Введите день" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="wakeUpTime"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Время пробуждения</FormLabel>
								<FormControl>
									<Input placeholder="Введите время пробуждения" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="text-sm font-medium color-input">Дневные сны</div>

					{dayDreamsFieldsForm.fields.map((_item, index) => (
						<div key={index} className="flex gap-x-4">
							<FormField
								control={form.control}
								name={`dayDreams.${index}.from`}
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="Введите время от" {...field} />
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
											<Input placeholder="Введите время до" {...field} />
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

					<div className="text-sm font-medium color-input">
						Ночное засыпание
					</div>

					<div className="flex gap-x-4">
						<FormField
							control={form.control}
							name="nightDreamFrom"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input placeholder="Введите время от" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="nightDreamTo"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input placeholder="Введите время до" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="nightDreamRating"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Рейтинг ночи</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="Введите рейтинг"
										min={1}
										max={5}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="text-sm font-medium color-input">
						Ночные просыпания
					</div>

					{nightDreamAwakeningsFieldsForm.fields.map((_item, index) => (
						<div key={index} className="flex gap-x-4">
							<FormField
								control={form.control}
								name={`nightDreamAwakenings.${index}.time`}
								render={({ field }) => (
									<FormItem className="w-full">
										<FormControl>
											<Input placeholder="Введите время" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button
								type="button"
								variant="outline"
								onClick={() => deleteNightDreamAwakeningHandler(index)}
								aria-label="Удалить ночное просыпание"
							>
								<TrashIcon className="h-4 w-4" />
							</Button>
						</div>
					))}

					<Button
						type="button"
						variant="outline"
						onClick={addNightDreamAwakeningHandler}
					>
						Добавить <PlusIcon className="h-4 w-4" />
					</Button>

					<Button className="w-full" type="submit">
						Создать
					</Button>
				</form>
			</Form>
		</div>
	)
}
