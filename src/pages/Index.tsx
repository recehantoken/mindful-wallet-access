import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { WagmiConfig, useAccount, useConnect, useDisconnect } from 'wagmi';
import { mainnet, arbitrum, optimism, polygon } from 'wagmi/chains';
import { supabase } from "@/integrations/supabase/client";

// 1. Get projectId from WalletConnect Cloud - this is a demo ID, replace with your own
const projectId = '3fbb6bba6f1de962d911bb5b5c9dba88';

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3 Login',
  description: 'Web3 Login Example',
  url: 'https://web3login.example',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const chains = [mainnet, arbitrum, optimism, polygon];
const wagmiConfig = defaultWagmiConfig({ projectId, metadata });

// 3. Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  defaultChain: mainnet,
  featuredWalletIds: [],
  tokens: {
    [mainnet.id]: {
      address: '0x0000000000000000000000000000000000000000'
    }
  }
});

function WalletConnection() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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

  const handleConnect = async (connector: any) => {
    try {
      setIsLoading(true);
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
    <div className="flex flex-col gap-4">
      {!isConnected ? (
        <>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connect your wallet to access the application
            </AlertDescription>
          </Alert>
          {connectors.map((connector) => (
            <Button
              key={connector.id}
              onClick={() => handleConnect(connector)}
              disabled={!connector.ready || isLoading}
              className="w-full"
            >
              Connect {connector.name}
              {isLoading && " (Connecting...)"}
            </Button>
          ))}
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

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Web3 Login</CardTitle>
          <CardDescription>
            Connect your wallet to access the application
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