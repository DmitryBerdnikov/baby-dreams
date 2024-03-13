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

export type CreateNightDreamAwakenings = {
	nightDreamId: number
	nightDreamAwakenings: {
		time: Date
	}[]
}

export const createNightDreamAwakenings = async ({
	nightDreamId,
	nightDreamAwakenings,
}: CreateNightDreamAwakenings) => {
	const mappedNightDreamAwakenings = nightDreamAwakenings.map((item) => ({ ...item, nightDreamId }))

	const result = await prisma.nightDreamAwakenings.createMany({
		data: mappedNightDreamAwakenings,
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

export type UpdateNightDream = NightDream

export const updateNightDream = async ({
	id,
	dayId,
	from,
	to,
	awakenings,
	rating,
}: UpdateNightDream) => {
	const result = await prisma.nightDream.update({
		where: {
			id,
		},
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
	nightDream?: NightDream
	dayDreams: {
		from: Date
		to: Date
	}[]
	nightDreamRating?: number
	nightDreamTo?: Date
	nightDreamFrom?: Date
	nightDreamAwakenings?: {
		time: Date;
	}[]
}

export const updateDay = async ({
	nightDream,
	dayId,
	dayDreams,
	nightDreamFrom,
	nightDreamTo,
	nightDreamRating,
	nightDreamAwakenings = []
}: UpdateDay) => {
	if (dayDreams.length > 0) {
		await createDayDreams({ dayId, dayDreams })
	}

	if (nightDreamAwakenings.length > 0 && nightDream?.id) {
		await createNightDreamAwakenings({ nightDreamId: nightDream.id, nightDreamAwakenings })
	}

	if (nightDreamFrom || nightDreamTo || nightDreamRating) {
		const params = {
			dayId,
			from: nightDreamFrom !== undefined ? nightDreamFrom : nightDream?.from ? nightDream?.from : null,
			to: nightDreamTo !== undefined ? nightDreamTo : nightDream?.to ? nightDream?.to : null,
			rating: nightDreamRating !== undefined ? nightDreamRating : nightDream?.rating ? nightDream?.rating : null,
			awakenings: [],
		}

		if (nightDream?.id) {
			await updateNightDream({ ...params, id: nightDream.id })
		} else {
			await createNightDream(params)
		}
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
