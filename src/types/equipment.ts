export interface Balance {
  id: number;
  coinTicker: string;
  coinAmount: string;
}

export interface ConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: number;
  balances: Balance[];
  defaultFromCoin: string;
}
