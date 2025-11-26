import * as React from "react";
import styles from "./ConnectButton.styles.module.css";
import ArrowBottomIcon from "../../assets/arrow-bottom.svg";
import walletIcon from "../../assets/wallet.svg";
import type { IConnectedStateProps } from "./types.ts";
import {shortenAddress} from "../../utils/shortenAddress.ts";

export const ConnectedState: React.FC<IConnectedStateProps> = ({
 account,
 chain,
 openAccountModal,
 openChainModal
}) => {
  const accountAddress = account?.displayName ||
    (account?.address ? shortenAddress(account.address) : '');

  const handleWalletClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    openAccountModal();
  };

  return (
    <button
      type="button"
      className={styles.accountButton}
      onClick={openChainModal}
    >
      <span className={styles.accountInfo}>
        {chain.hasIcon && chain.iconUrl ? (
          <span className={styles.assetBadge}>
            <img
              src={chain.iconUrl}
              alt={chain.name ?? 'Chain icon'}
            />
          </span>
        ) : (
          <div className={styles.assetBadgeFallback}></div>
        )}
        <span className={styles.accountAddress}>
          {accountAddress}
        </span>
        <img src={ArrowBottomIcon} alt="" />
      </span>
      <div
        className={styles.accountAction}
        onClick={handleWalletClick}
        role="button"
        tabIndex={0}
      >
        <img src={walletIcon} alt="" aria-hidden />
      </div>
    </button>
  );
};