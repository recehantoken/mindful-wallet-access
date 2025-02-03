import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ConnectedWalletProps {
  address: string;
  onDisconnect: () => void;
}

export function ConnectedWallet({ address, onDisconnect }: ConnectedWalletProps) {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          Connected with: {address?.slice(0, 6)}...{address?.slice(-4)}
        </AlertDescription>
      </Alert>
      <Button onClick={onDisconnect} variant="outline" className="w-full">
        Disconnect Wallet
      </Button>
    </div>
  );
}