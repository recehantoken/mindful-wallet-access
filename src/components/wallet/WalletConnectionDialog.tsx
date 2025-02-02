import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useConnect, useChainId, useSwitchChain } from 'wagmi';
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { polygon } from 'wagmi/chains';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface WalletInfo {
  name: string;
  logo: string;
  ready: boolean;
}

interface WalletConnectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  wallets: WalletInfo[];
}

export function WalletConnectionDialog({ isOpen, onOpenChange, wallets }: WalletConnectionDialogProps) {
  const { connectAsync, connectors } = useConnect();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async (walletName: string) => {
    setIsLoading(true);
    const connector = connectors.find(c => c.name.toLowerCase() === walletName.toLowerCase());
    
    try {
      if (!connector) throw new Error('Connector not found');
      
      await connectAsync({ connector });
      
      // After successful connection, switch to Polygon if not already on it
      if (chainId !== polygon.id) {
        console.log('Switching to Polygon network...');
        await switchChainAsync({ chainId: polygon.id });
      }

      // After successful connection and network switch, redirect based on URL path
      const currentPath = window.location.pathname;
      if (currentPath.includes('login')) {
        window.location.href = 'https://gate.recehan.gold/user/login';
      } else if (currentPath.includes('register')) {
        window.location.href = 'https://gate.recehan.gold/user/register';
      } else {
        // Default to login if no specific path matches
        window.location.href = 'https://gate.recehan.gold/user/login';
      }

      toast({
        title: "Wallet Connected",
        description: "Successfully connected to wallet and switched to Polygon network.",
      });
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-6 w-6" />
            Connect Wallet
          </DialogTitle>
          <DialogDescription>
            Choose your preferred wallet to connect to the application
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {wallets.map((wallet) => (
            <Button
              key={wallet.name}
              onClick={() => handleConnect(wallet.name)}
              disabled={!wallet.ready || isLoading}
              className="w-full justify-start gap-4"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <img src={wallet.logo} alt={`${wallet.name} logo`} className="h-6 w-6" />
              )}
              {wallet.name}
              {!wallet.ready && " (not available)"}
            </Button>
          ))}
        </div>
        {!wallets.some(wallet => wallet.ready) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No supported wallets were detected. Please install MetaMask or another compatible wallet.
            </AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
}