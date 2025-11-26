export interface IChain {
  hasIcon: boolean;
  iconUrl?: string | undefined;
  iconBackground?: string | undefined;
  id: number;
  name?: string | undefined;
  unsupported?: boolean | undefined;
}

export interface  IAccount {
  address: string;
  balanceDecimals?: number | undefined;
  balanceFormatted?: string | undefined;
  balanceSymbol?: string | undefined;
  displayBalance?: string | undefined;
  displayName: string;
  ensAvatar?: string | undefined;
  ensName?: string | undefined;
  hasPendingTransactions: boolean;
}