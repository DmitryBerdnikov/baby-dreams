'use server'

import { Day, NightDream, NightDreamAwakening } from '@entities/day'
import prisma from '../app/lib/prisma'
import { DayDream } from '@prisma/client'

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

export type CreateDayDreams = {
	dayId: number
	dayDreams: {
		from: Date
		to: Date
	}[]
}

export const createDayDreams = async ({
	dayId,
	dayDreams,
}: CreateDayDreams) => {
	const mappedDayDreams = dayDreams.map((item) => ({ ...item, dayId }))

	const result = await prisma.dayDream.createMany({
		data: mappedDayDreams,
	})

	return result
}

export type CreateNightDream = Omit<NightDream, 'id'>

export const createNightDream = async ({
	dayId,
	from,
	to,
	awakenings,
	rating,
}: CreateNightDream) => {
	const result = await prisma.nightDream.create({
		data: {
			dayId,
			from,
			to,
			awakenings: awakenings
				? {
						createMany: {
							data: awakenings,
						},
				  }
				: undefined,
			rating,
		},
	})

	return result
}

export type UpdateDay = {
	dayId: number
	dayDreams: {
		from: Date
		to: Date
	}[]
	nightDreamRating?: number
	nightDreamTo?: Date
	nightDreamFrom?: Date
}

export const updateDay = async ({
	dayId,
	dayDreams,
	nightDreamFrom,
	nightDreamTo,
	nightDreamRating,
}: UpdateDay) => {
	if (dayDreams.length > 0) {
		const createDayDreamsResult = await createDayDreams({ dayId, dayDreams })

		console.log({ createDayDreamsResult })
	}

	if (nightDreamFrom || nightDreamTo || nightDreamRating) {
		const createNightDreamResult = await createNightDream({
			dayId,
			from: nightDreamFrom === undefined ? null : nightDreamFrom,
			to: nightDreamTo === undefined ? null : nightDreamTo,
			rating: nightDreamRating === undefined ? null : nightDreamRating,
		})

		console.log({ createNightDreamResult })
	}
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
