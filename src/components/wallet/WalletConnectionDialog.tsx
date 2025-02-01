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
  hasMetaMask: boolean;
}

export function WalletConnectionDialog({ isOpen, onOpenChange, hasMetaMask }: WalletConnectionDialogProps) {
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
              {hasMetaMask 
                ? "MetaMask is installed and ready to connect"
                : "MetaMask is not installed. Please install MetaMask to continue"}
            </AlertDescription>
          </Alert>
          {connectors.map((connector) => (
            <Button
              key={connector.id}
              onClick={() => handleConnect(connector)}
              disabled={!connector.ready || isLoading || (connector.name === 'MetaMask' && !hasMetaMask)}
              className="w-full"
            >
              Connect {connector.name}
              {!connector.ready && " (not ready)"}
              {connector.name === 'MetaMask' && !hasMetaMask && " (not installed)"}
              {isLoading && connector.ready && " (Connecting...)"}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}