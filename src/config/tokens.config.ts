import { SupportedChain } from '../constants/shared';

export interface TokenAsset {
  symbol: string;
  name: string;
  tradingPair: string;
  geckoDenomination: string;
  chain?: SupportedChain;
}

export enum SupportedTradingPair {
  ETHUSD = 'ETHUSD',
}

export const TOKEN_ASSET_LIST: TokenAsset[] = [
  {
    geckoDenomination: 'ethereum',
    name: 'Ethereum Coin',
    symbol: 'ETH',
    tradingPair: SupportedTradingPair.ETHUSD,
    chain: SupportedChain.ETHEREUM,
  },
];
