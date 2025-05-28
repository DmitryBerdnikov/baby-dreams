'use client';
import Link from 'next/link'

export const Header = () => {
	return (
		<nav className="py-2 sticky bottom-0 bg-white border-t-2">
			<ul className="flex justify-center gap-6">
				<li>
					<Link href={`/days/${new Date().toISOString().substring(0, 10)}`}>
						Сегодня
					</Link>
				</li>
				<li>
					<Link href="/days/create">Создать</Link>
				</li>
				<li>
					<Link href="/days">Все дни</Link>
				</li>
			</ul>
		</nav>
	)
}
