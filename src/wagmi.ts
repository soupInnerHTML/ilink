import {getDefaultConfig} from '@rainbow-me/rainbowkit';
import {arbitrum, base, baseSepolia, mainnet, optimism, polygon} from 'wagmi/chains';
import {http, injected} from "wagmi";
import {walletConnect} from 'wagmi/connectors';

const projectId = import.meta.env.VITE_WAGMI_PROJECT_ID;

export const config = getDefaultConfig({
  appName: 'ilink',
  projectId: projectId,
  chains: [mainnet, base, baseSepolia, polygon, optimism, arbitrum],
  ssr: false,
  // @ts-expect-error connectors necessary
  connectors: [
    injected(),
    walletConnect({ projectId }),
  ],
  transports: {
    [mainnet.id]: http('https://rpc.ankr.com/eth'),
    [base.id]: http('https://mainnet.base.org'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
});