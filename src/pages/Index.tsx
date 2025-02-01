import { WagmiConfig } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletConnection } from "@/components/wallet/WalletConnection";
import { wagmiConfig } from "@/components/wallet/WalletConfig";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Web3 Login</CardTitle>
          <CardDescription>
            Connect your wallet to access recehan site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WagmiConfig config={wagmiConfig}>
            <WalletConnection />
          </WagmiConfig>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;