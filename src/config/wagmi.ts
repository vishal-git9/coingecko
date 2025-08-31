// import { http, createConfig } from 'wagmi'
// import { base, mainnet } from 'wagmi/chains'
// import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

// const projectId = '204ad609e70d8cb2003fda14e2c37fcf'

// export const config = createConfig({
//   chains: [mainnet, base],
//   connectors: [
//     injected(),
//     walletConnect({ projectId }),
//     metaMask(),
//     safe(),
//   ],
//   transports: {
//     [mainnet.id]: http(),
//     [base.id]: http(),
//   },
// })

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
    bscTestnet,
    arbitrum,
    base,
    mainnet,
    optimism,
    polygon,
    sepolia,
} from 'wagmi/chains';


export const config = getDefaultConfig({
  appName: 'coingecko',
  projectId: '204ad609e70d8cb2003fda14e2c37fcf',
  chains: [
    bscTestnet,
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    ...(import.meta.env.VITE_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
});
