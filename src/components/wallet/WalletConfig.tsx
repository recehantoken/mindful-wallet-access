import { Core } from '@walletconnect/core';
import { WalletKit } from '@reown/walletkit';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { mainnet, arbitrum, optimism, polygon } from 'wagmi/chains';

// Initialize WalletConnect Core
const core = new Core({
  projectId: 'a9fd0615ede0b1e448b9c0084c138b83'
});

// Define metadata for WalletKit
const walletKitMetadata = {
  name: 'recehan-signon',
  description: 'AppKit Example',
  url: window.location.origin,
  icons: ['https://assets.reown.com/reown-profile-pic.png']
};

// Initialize WalletKit (we'll do this in a useEffect since it's async)
export let walletKit: any = null;

// Create wagmiConfig
const metadata = {
  name: 'Web3 Login',
  description: 'Web3 Login Example',
  url: 'https://web3login.example',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const chains = [mainnet, arbitrum, optimism, polygon] as const;

export const wagmiConfig = defaultWagmiConfig({ 
  chains,
  projectId: 'a9fd0615ede0b1e448b9c0084c138b83', 
  metadata 
});

// Create modal
createWeb3Modal({
  wagmiConfig,
  projectId: 'a9fd0615ede0b1e448b9c0084c138b83',
  defaultChain: mainnet,
  featuredWalletIds: [],
  tokens: {
    [mainnet.id]: {
      address: '0x0000000000000000000000000000000000000000'
    }
  }
});

export const initializeWalletKit = async () => {
  try {
    walletKit = await WalletKit.init({
      core,
      metadata: walletKitMetadata
    });
    console.log('WalletKit initialized successfully');
  } catch (error) {
    console.error('Failed to initialize WalletKit:', error);
  }
};