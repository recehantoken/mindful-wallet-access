export type WalletInfo = {
  name: string;
  logo: string;
  ready: boolean;
}

export const checkAvailableWallets = (): WalletInfo[] => {
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  const isMetaMaskInstalled = typeof window !== 'undefined' && 
    typeof window.ethereum !== 'undefined' && 
    (window.ethereum.isMetaMask || 
     (window.ethereum.providers && 
      window.ethereum.providers.some((provider: any) => provider.isMetaMask)));

  console.log('Device type:', isMobileDevice ? 'Mobile' : 'Desktop');
  console.log('MetaMask installed:', isMetaMaskInstalled);
  
  return [
    {
      name: 'MetaMask',
      logo: 'https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg',
      ready: isMetaMaskInstalled || isMobileDevice
    },
    {
      name: 'WalletConnect',
      logo: 'https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Blue%20(Default)/Logo.svg',
      ready: true
    },
    {
      name: 'Ledger',
      logo: '/lovable-uploads/ac7f6456-e1df-4031-b9ad-ec01163cf25a.png',
      ready: true
    },
    {
      name: 'Zerion',
      logo: '/lovable-uploads/ac7f6456-e1df-4031-b9ad-ec01163cf25a.png',
      ready: true
    },
    {
      name: 'Fireblocks',
      logo: '/lovable-uploads/ac7f6456-e1df-4031-b9ad-ec01163cf25a.png',
      ready: true
    }
  ];
};