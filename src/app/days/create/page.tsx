import { createDay } from '@api/day';
import { FormDay } from '../../components/FormDay';

export default function HomePage() {
  return (
    <FormDay onSubmit={createDay} />
  );
}
