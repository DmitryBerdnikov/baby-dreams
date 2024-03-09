import { Day } from '@entities/day'
import { fetchDay } from '@api/day'

type DayPageProps = {
	params: {
		date: Day['date']
	}
}

export default async function DayPage({ params }: DayPageProps) {
	const day = await fetchDay({ date: params.date })

	console.log({ day })
	
	if (!day) {
		return `Дня с датой ${params.date} не существует`
	}

	return (
		<main>
			<p>
				<b>День</b>: {new Date(day.date).toLocaleDateString()}
			</p>
			<p>
				<b>Время пробуждения</b>:{' '}
				{new Date(day?.wakeUpTime).toLocaleTimeString()}
			</p>
			<p>
				<b>Кол-во дневных снов</b>: {day.dayDreams.length}
			</p>
			<p>
				<b>Дневные сны</b>:{' '}
				{day.dayDreams.map((item, index) => (
					<span className="ml-3" key={index}>
						{new Date(item.from).toLocaleTimeString()}-
						{new Date(item.to).toLocaleTimeString()}
					</span>
				))}
			</p>
			<p>
				<b>Ночное засыпание</b>:{' '}
				{day.nightDream?.from &&
					new Date(day.nightDream?.from).toLocaleTimeString()}
			</p>
			<p>
				<b>Рейтинг ночи</b>: {day.nightDream?.rating}
			</p>
			<p>
				<b>Ночные просыпания</b>:{' '}
				{day.nightDream?.awakenings.map((item, index) => (
					<span className="ml-3" key={index}>
						{new Date(item.time).toLocaleTimeString()}
					</span>
				))}
			</p>
		</main>
	)
}
