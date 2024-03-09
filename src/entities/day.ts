import { Prisma } from "@prisma/client"

const day = Prisma.validator<Prisma.DayDefaultArgs>()({
    include: { nightDream: { include: { awakenings: true }}, dayDreams: true }
})

export type Day = Prisma.DayGetPayload<typeof day>

const nightDream = Prisma.validator<Prisma.NightDreamDefaultArgs>()({
    include: { awakenings: true }
})

export type NightDream = Prisma.NightDreamGetPayload<typeof nightDream>

const nightDreamAwakening = Prisma.validator<Prisma.NightDreamAwakeningsDefaultArgs>()({
    include: {}
})

export type NightDreamAwakening = Prisma.NightDreamAwakeningsGetPayload<typeof nightDreamAwakening>
