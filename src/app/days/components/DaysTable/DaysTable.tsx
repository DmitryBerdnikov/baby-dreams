'use client'

import * as React from 'react'
import { CaretSortIcon } from '@radix-ui/react-icons'
import {
	ColumnDef,
	SortingState,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'

import { Button } from '@components/ui/button'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Day, NightDream } from '@/entities/day'
import { DayDream } from '@prisma/client'

export const columns: ColumnDef<Day>[] = [
	{
		accessorKey: 'date',
		header: 'День',
		cell: ({ row }) => row.getValue('date'),
	},
	{
		accessorKey: 'nightDreamRating',
		header: 'Рейтинг ночи',
		cell: ({ row }) => {
			const nightDream = row.getValue('nightDream')

			if (!nightDream) {
				return null
			}

			const typedNightDream = nightDream as NightDream

			return typedNightDream.rating
		},
	},
	{
		accessorKey: 'wakeUpTime',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Время пробуждения
					<CaretSortIcon className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => (
			<div className="lowercase">
				{new Date(row.getValue('wakeUpTime')).toLocaleTimeString().slice(0, -3)}
			</div>
		),
	},
	{
		accessorKey: 'dayDreamsLength',
		header: 'Кол-во дневных снов',
		cell: ({ row }) => {
			if (!row.getValue('dayDreams')) {
				return null
			}

			return (row.getValue('dayDreams') as DayDream[]).length
		},
	},
	{
		accessorKey: 'dayDreams',
		header: 'Дневные сны',
		cell: ({ row }) => {
			const dayDreams = (row.getValue('dayDreams') || []) as DayDream[]

			return (dayDreams as DayDream[]).map((item, index) => (
				<React.Fragment key={index}>
					<span>
						{new Date(item.from).toLocaleTimeString().slice(0, -3)} -{' '}
						{new Date(item.to).toLocaleTimeString().slice(0, -3)}
					</span>
					{index < dayDreams.length - 1 && <span className="mx-2">|</span>}
				</React.Fragment>
			))
		},
	},
	{
		accessorKey: 'nightDream',
		header: 'Ночь',
		cell: ({ row }) => {
			const nightDream = row.getValue('nightDream')

			if (!nightDream) {
				return null
			}

			const typedNightDream = nightDream as NightDream

			return (
				<span>
					{typedNightDream.from && new Date(typedNightDream.from).toLocaleTimeString().slice(0, -3)}
					<span className="mx-3">|</span>
					{typedNightDream.to && new Date(typedNightDream.to).toLocaleTimeString().slice(0, -3)}
				</span>
			)
		},
	},
]

type DaysTableProps = {
	days: Day[]
}

export const DaysTable = ({ days }: DaysTableProps) => {
	const [sorting, setSorting] = React.useState<SortingState>([])

	const table = useReactTable({
		data: days,
		columns,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
	})

	return (
		<div className="p-4">
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
