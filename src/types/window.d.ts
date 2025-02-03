interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request?: (...args: any[]) => Promise<any>;
    providers?: Array<{
      isMetaMask?: boolean;
      request?: (...args: any[]) => Promise<any>;
    }>;
  };
}