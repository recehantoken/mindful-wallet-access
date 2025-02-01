import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useConnect } from 'wagmi';
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface WalletConnectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  wallets: {
    hasMetaMask: boolean;
    hasWalletConnect: boolean;
    isMobile: boolean;
  };
}

export function WalletConnectionDialog({ isOpen, onOpenChange, wallets }: WalletConnectionDialogProps) {
  const { connectAsync, connectors } = useConnect();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async (connector: any) => {
    try {
      setIsLoading(true);
      console.log('Attempting to connect with connector:', connector.name);
      await connectAsync({ connector });
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getWalletStatus = (connectorName: string) => {
    if (connectorName === 'MetaMask') {
      if (wallets.isMobile && !wallets.hasMetaMask) {
        return "Install MetaMask Mobile";
      }
      return wallets.hasMetaMask ? "Connect MetaMask" : "Install MetaMask";
    }
    if (connectorName === 'WalletConnect') {
      return "Connect with WalletConnect";
    }
    return `Connect ${connectorName}`;
  };

  const isConnectorDisabled = (connectorName: string) => {
    if (connectorName === 'MetaMask') {
      return !wallets.hasMetaMask && !wallets.isMobile;
    }
    return false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full">
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to our application
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {wallets.isMobile 
                ? "Mobile device detected - you can use MetaMask mobile app or WalletConnect"
                : wallets.hasMetaMask 
                  ? "MetaMask is installed and ready to connect"
                  : "MetaMask is not installed. You can install it or use WalletConnect"}
            </AlertDescription>
          </Alert>
          {connectors.map((connector) => (
            <Button
              key={connector.id}
              onClick={() => handleConnect(connector)}
              disabled={isLoading || isConnectorDisabled(connector.name)}
              className="w-full"
            >
              {isLoading && connector.ready ? "Connecting..." : getWalletStatus(connector.name)}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}