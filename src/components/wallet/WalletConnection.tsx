import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useDisconnect } from 'wagmi';
import { supabase } from "@/integrations/supabase/client";
import { WalletConnectionDialog } from "./WalletConnectionDialog";
import { initializeWalletKit } from "./WalletConfig";
import { Wallet } from "lucide-react";

type WalletInfo = {
  name: string;
  logo: string;
  ready: boolean;
}

export function WalletConnection() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [wallets, setWallets] = useState<WalletInfo[]>([]);

  useEffect(() => {
    const checkWallets = async () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Check if MetaMask is installed
      const isMetaMaskInstalled = typeof window !== 'undefined' && 
        typeof window.ethereum !== 'undefined' && 
        window.ethereum.isMetaMask;
      
      console.log('Device type:', isMobileDevice ? 'Mobile' : 'Desktop');
      console.log('MetaMask installed:', isMetaMaskInstalled);
      
      const availableWallets: WalletInfo[] = [
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

      setWallets(availableWallets);
    };

    checkWallets();
    initializeWalletKit();
  }, []);

  useEffect(() => {
    const saveWalletConnection = async () => {
      if (isConnected && address) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            console.error('No authenticated user found');
            return;
          }

          const { error } = await supabase
            .from('wallet_connections')
            .upsert({
              user_id: user.id,
              wallet_address: address,
              wallet_type: 'metamask',
              last_connected_at: new Date().toISOString()
            }, {
              onConflict: 'wallet_address',
              ignoreDuplicates: false
            });

          if (error) throw error;
          
          toast({
            title: "Wallet Connected",
            description: "Your wallet has been successfully connected.",
          });
          setIsDialogOpen(false);
        } catch (error) {
          console.error('Error saving wallet connection:', error);
          toast({
            variant: "destructive",
            title: "Connection Error",
            description: "Failed to save wallet connection.",
          });
        }
      }
    };

    saveWalletConnection();
  }, [isConnected, address, toast]);

  return (
    <div className="flex flex-col gap-4">
      {!isConnected ? (
        <>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </Button>
          <WalletConnectionDialog 
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            wallets={wallets}
          />
        </>
      ) : (
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              Connected with: {address?.slice(0, 6)}...{address?.slice(-4)}
            </AlertDescription>
          </Alert>
          <Button onClick={() => disconnect()} variant="outline" className="w-full">
            Disconnect Wallet
          </Button>
        </div>
      )}
    </div>
  );
}