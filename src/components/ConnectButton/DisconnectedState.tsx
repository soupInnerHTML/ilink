import styles from "./ConnectButton.styles.module.css";
import * as React from "react";
import type {IDisconnectedStateProps} from "./types.ts";

export const DisconnectedState: React.FC<IDisconnectedStateProps> = ({ openConnectModal }) => {
  return (
    <button
      type="button"
      onClick={openConnectModal}
      className={`${styles.button} ${styles.buttonPrimary}`}
    >
      Connect Wallet
    </button>
  );
}