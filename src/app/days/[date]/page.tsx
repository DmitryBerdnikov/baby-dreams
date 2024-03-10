import { fetchDay } from '@api/day'
import { Day } from './components/Day'

type DayPageProps = {
	params: {
		date: string
	}
}

export default async function DayPage({ params }: DayPageProps) {
	const day = await fetchDay({ date: params.date })

	if (!day) {
		return `Дня с датой ${params.date} не существует`
	}

	return <Day day={day} />
}
