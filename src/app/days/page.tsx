import { fetchDays } from '@api/day';
import { DaysTable } from './components/DaysTable';

export default async function Home() {
  const days = await fetchDays();

  return <DaysTable days={days} />;
}
