type CreateDayParams = {
    // format: 2024-03-17
    day: string;
    // format 08:30
    hoursWithMinutes: string;
}

export const createDate = ({
	day,
    hoursWithMinutes
}: CreateDayParams) =>
	new Date(`${day}T${hoursWithMinutes}`)
