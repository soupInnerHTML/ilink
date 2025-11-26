import type {IAccount, IChain} from "../../types/rainbowkit.ts";

export interface IConnectedStateProps {
  account: IAccount | undefined;
  chain: IChain;
  openAccountModal: () => void;
  openChainModal: () => void;
}

export interface IDisconnectedStateProps {
  openConnectModal: () => void;
}