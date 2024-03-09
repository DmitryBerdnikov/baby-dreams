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
import { Day } from '@/entities/day'
import { DayDream } from '@prisma/client'

export const columns: ColumnDef<Day>[] = [
	{
		accessorKey: 'date',
		header: 'День',
		cell: ({ row }) => row.getValue('date'),
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
				{new Date(row.getValue('wakeUpTime')).toLocaleTimeString()}
			</div>
		),
	},
	{
		accessorKey: 'dayDreams',
		header: 'Кол-во дневных снов',
		cell: ({ row }) => {
      if (!row.getValue('dayDreams')) {
        return null
      }

      return (row.getValue('dayDreams') as DayDream[]).length
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
