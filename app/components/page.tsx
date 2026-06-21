import { allTokens } from '@/lib/tokens';
import ComponentsClient from './ComponentsClient';

export default function ComponentsPage() {
  return <ComponentsClient tokens={allTokens} />;
}
