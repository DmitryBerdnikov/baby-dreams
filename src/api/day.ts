'use server'

import { Day, NightDream, NightDreamAwakening } from '@entities/day'
import prisma from '../app/lib/prisma'

export type CreateDay = {
	date: string
	wakeUpTime: Date
	dayDreams?: {
		from: Date
		to: Date
	}[]
	nightDream?: Omit<
		NightDream,
		'id' | 'dayId' | 'totalAwakeningsCount' | 'awakenings'
	>
	nightDreamAwakenings?: Omit<NightDreamAwakening, 'id' | 'nightDreamId'>[]
}

export const createDay = async ({
	date,
	wakeUpTime,
	dayDreams,
	nightDream,
	nightDreamAwakenings,
}: CreateDay): Promise<Day> => {
	const result = await prisma.day.create({
		data: {
			date,
			wakeUpTime,
			dayDreams: dayDreams
				? {
						createMany: {
							data: dayDreams,
						},
				  }
				: undefined,
			nightDream: nightDream
				? {
						create: {
							from: nightDream.from,
							to: nightDream.to,
							rating: nightDream.rating,
							awakenings: nightDreamAwakenings
								? {
										createMany: {
											data: nightDreamAwakenings,
										},
								  }
								: undefined,
						},
				  }
				: undefined,
		},
		include: {
			nightDream: {
				include: {
					awakenings: true,
				},
			},
			dayDreams: true,
		},
	})

	return result
}

type FetchDayParams = {
	date: Day['date']
}

export const fetchDay = async ({
	date,
}: FetchDayParams): Promise<Day | null> => {
	const day = await prisma.day.findUnique({
		where: {
			date,
		},
		include: {
			nightDream: {
				include: {
					awakenings: true,
				},
			},
			dayDreams: true,
		},
	})

	return day
}

export const fetchDays = async (): Promise<Day[]> => {
	const days = await prisma.day.findMany({
		include: {
			nightDream: {
				include: {
					awakenings: true,
				},
			},
			dayDreams: true,
		},
	})

	return days
}
