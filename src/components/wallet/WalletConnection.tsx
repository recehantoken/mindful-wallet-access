import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { supabase } from "@/integrations/supabase/client";
import { WalletConnectionDialog } from "./WalletConnectionDialog";
import { initializeWalletKit } from "./WalletConfig";

export function WalletConnection() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [wallets, setWallets] = useState({
    hasMetaMask: false,
    hasWalletConnect: false,
    isMobile: false
  });

  useEffect(() => {
    const checkWallets = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isMetaMaskInstalled = typeof window !== 'undefined' && Boolean(window?.ethereum?.isMetaMask);
      
      console.log('Device type:', isMobileDevice ? 'Mobile' : 'Desktop');
      console.log('MetaMask installed:', isMetaMaskInstalled);
      
      setWallets({
        hasMetaMask: isMetaMaskInstalled,
        hasWalletConnect: true, // WalletConnect is always available as a fallback
        isMobile: isMobileDevice
      });
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
        <WalletConnectionDialog 
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          wallets={wallets}
        />
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