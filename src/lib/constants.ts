// Функция для получения ID валюты
export interface CoinConfig {
  network: string;
  minDeposit: number;
  walletId: string;
  currencyId: string;
}

export const COIN_CONFIG: Record<string, CoinConfig> = {
  BTC: {
    network: 'Bitcoin',
    minDeposit: 0.0001,
    walletId: '1413',
    currencyId: '1000',
  },
  /*USDT: {
    network: 'TRC-20',
    minDeposit: 50,
    walletId: '1418',
    currencyId: '2145',
  },
  USDC: {
    network: 'TRC-20',
    minDeposit: 50,
    walletId: '1422',
    currencyId: '2142',
  },*/
  USDT_SOL: {
    network: 'SOL',
    minDeposit: 50,
    walletId: '1527',
    currencyId: '2030',
  },
  USDC_SOL: {
    network: 'SOL',
    minDeposit: 50,
    walletId: '1528',
    currencyId: '2031',
  },
  SOL: {
    network: 'SOL',
    minDeposit: 0.1,
    walletId: '1526',
    currencyId: '1028',
  },
  TRX: {
    network: 'TRC-20',
    minDeposit: 50,
    walletId: '1417',
    currencyId: '1026',
  },
  LTC: {
    network: 'Litecoin',
    minDeposit: 0.1,
    walletId: '1419',
    currencyId: '1003',
  },
  DOGE: {
    network: 'Dogecoin',
    minDeposit: 100,
    walletId: '1420',
    currencyId: '1019',
  },
};

export function getCurrencyId(coinTicker: string): string {
  return COIN_CONFIG[coinTicker]?.currencyId || '';
}

export function getWalletId(coinTicker: string): string {
  return COIN_CONFIG[coinTicker]?.walletId || '';
}

export function getCoinNetwork(coinTicker: string): string {
  return COIN_CONFIG[coinTicker]?.network || '';
}

export function getMinDeposit(coinTicker: string): number {
  return COIN_CONFIG[coinTicker]?.minDeposit || 0;
}
