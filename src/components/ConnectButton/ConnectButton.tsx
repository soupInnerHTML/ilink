import {ConnectButton as RKConnectButton} from '@rainbow-me/rainbowkit';
import clsx from 'clsx';
import styles from './ConnectButton.styles.module.css';
import {ConnectedState} from "./ConnectedState.tsx";
import {DisconnectedState} from "./DisconnectedState.tsx";


export function ConnectButton() {
  return (
    <RKConnectButton.Custom>
      {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected = ready && account && chain;

        return (
          <div
            className={clsx(styles.container, {[styles.hidden]: !ready})}
            aria-hidden={!ready}
          >
            {!connected ? (
              <DisconnectedState openConnectModal={openConnectModal} />
            ) : (
              <ConnectedState
                account={account}
                chain={chain}
                openAccountModal={openAccountModal}
                openChainModal={openChainModal}
              />
            )}
          </div>
        );
      }}
    </RKConnectButton.Custom>
  );
}