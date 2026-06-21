import { allTokens } from '@/lib/tokens';
import PatternsClient from './PatternsClient';

export default function PatternsPage() {
  return <PatternsClient tokens={allTokens} />;
}
