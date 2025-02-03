import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useDisconnect } from 'wagmi';
import { supabase } from "@/integrations/supabase/client";
import { WalletConnectionDialog } from "./WalletConnectionDialog";
import { ConnectedWallet } from "./ConnectedWallet";
import { Wallet } from "lucide-react";
import { WalletInfo, checkAvailableWallets } from "@/utils/walletUtils";

export function WalletConnection() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [wallets, setWallets] = useState<WalletInfo[]>([]);

  useEffect(() => {
    const checkWallets = async () => {
      const availableWallets = checkAvailableWallets();
      setWallets(availableWallets);
    };

    checkWallets();
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
        <ConnectedWallet 
          address={address || ''} 
          onDisconnect={disconnect}
        />
      )}
    </div>
  );
}