import { SupportedChain } from './shared';

export interface TokenAsset {
  symbol: string;
  name: string;
  tradingPair: string;
  geckoDenomination: string;
  chain?: SupportedChain;
}

export enum SupportedTradingPair {
  ETHUSD = 'ETHUSD',
  BNBUSD = 'BNBUSD',
}

export const TOKEN_ASSET_LIST: TokenAsset[] = [
  {
    geckoDenomination: 'ethereum',
    name: 'Ethereum Coin',
    symbol: 'ETH',
    tradingPair: SupportedTradingPair.ETHUSD,
    chain: SupportedChain.ETHEREUM,
  },
  {
    geckoDenomination: 'binancecoin',
    name: 'Binance Coin',
    symbol: 'BNB',
    tradingPair: SupportedTradingPair.BNBUSD,
    chain: SupportedChain.BSC,
  },
];
