export const AUTH_TOKEN = 'predstakeAuthToken';

export enum SupportedChain {
  ETHEREUM = 'ethereum',
  BSC = 'bsc',
}

export const AUTH_MESSAGE =
  'Welcome to Prediction App! \n\nThis request will not trigger a blockchain transaction or cost any gas fees.';

export const MARKET_EVENT_BET_INDICES: Record<number, number> = {
  11: 0,
  22: 1,
};

export const MARKET_EVENT_TOTAL_POOL_INDEX = 4;

export enum GraphPeriod {
  Hourly = 'hourly',
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  AllTime = 'all',
}
