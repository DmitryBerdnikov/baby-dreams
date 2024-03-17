import { fetchDay } from '@api/day'
import { Day } from './components/Day'
import Link from 'next/link'

type DayPageProps = {
	params: {
		shortDateId: string
	}
}

export default async function DayPage({ params }: DayPageProps) {
	const day = await fetchDay({ shortDateId: params.shortDateId })

	if (!day) {
		return <div>Дня с датой ${params.shortDateId} не существует <Link href="/days/create">Создать</Link></div>
	}

	return <Day day={day} />
}
