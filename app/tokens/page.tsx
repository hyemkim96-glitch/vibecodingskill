import { allTokens } from '@/lib/tokens';
import TokensIndexClient from './TokensIndexClient';

export default function TokensPage() {
    return <TokensIndexClient tokens={allTokens} />;
}
