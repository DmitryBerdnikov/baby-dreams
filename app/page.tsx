import Image from "next/image";
import prisma from '../lib/prisma';
import { GetStaticProps } from "next";

export default async function Home() {
  const day = await prisma.day.findUnique({
    where: {
      date: '2024-01-29T21:00:00.000Z'
    },
    include: {
      nightDream: {
        include: {
          awakenings: true
        }
      },
      dayDreams: true,
    }
  });

  if (!day) {
    return 'No day'
  }

  return (
    <main>
      <p><b>День</b>: {new Date(day?.date).toLocaleDateString('ru', { hour: 'numeric', minute: 'numeric'})}</p>
      <p><b>Время просыпания</b>: {new Date(day?.wakeUpTime).toLocaleDateString('ru', { hour: 'numeric', minute: 'numeric'})}</p>
      <p><b>Кол-во дневных снов</b>: {day.dayDreams.length}</p>
      <p><b>Время ночного засыпания</b>: {day.nightDream?.from && new Date(day.nightDream?.from).toLocaleDateString()}</p>
    </main>
  );
}
