import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/game-context';
import { useToast } from '@/hooks/use-toast';
import { SERVER_PRODUCTS, formatCurrency } from '@/lib/constants';

export function HostingTab({ onTabChange }) {
  const { gameState, purchaseServer } = useGame();
  const { toast } = useToast();

  const handlePurchaseServer = async (productId) => {
    const product = SERVER_PRODUCTS.find(p => p.id === productId);
    const currentServers = gameState.servers?.length || 0;
    const serverLimit = gameState.user?.serverLimit || 3;
    
    if (currentServers >= serverLimit) {
      toast({
        title: "Server Limit Reached",
        description: `You can only have ${serverLimit} servers. Complete learning courses to increase your limit.`,
        variant: "destructive",
      });
      return;
    }

    if (gameState.user.balance < product.price) {
      toast({
        title: "Insufficient Funds",
        description: `You need ${formatCurrency(product.price)} to purchase this server.`,
        variant: "destructive",
      });
      return;
    }

    try {
      await purchaseServer(productId);
      toast({
        title: "Server Purchased",
        description: `${product.name} has been added to your servers!`,
      });
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!gameState.user) return null;

  const currentServers = gameState.servers?.length || 0;
  const serverLimit = gameState.user.serverLimit || 3;
  const canPurchase = currentServers < serverLimit;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-100">Server Store</h2>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-slate-400">Available Slots:</span>
          <span className="bg-slate-700 px-3 py-1 rounded-lg text-sm font-medium">
            {serverLimit - currentServers}/{serverLimit}
          </span>
        </div>
      </div>

      {/* Server Limit Warning */}
      {!canPurchase && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <i className="fas fa-lock text-red-400"></i>
            <span className="text-red-400 font-medium">Server Limit Reached</span>
          </div>
          <p className="text-sm text-slate-300 mt-1">
            You've reached your server limit of {serverLimit}. Complete learning courses to unlock more slots!
          </p>
        </div>
      )}

      {/* Server Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {SERVER_PRODUCTS.map((product) => {
          const canAfford = gameState.user.balance >= product.price;
          const isDisabled = !canPurchase || !canAfford;

          return (
            <div key={product.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-primary/30 transition-all">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <i className={product.icon + " text-primary text-lg"}></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-100">{product.name}</h3>
                  <p className="text-sm text-slate-400">{product.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{formatCurrency(product.price)}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-sm text-slate-400">Income per minute</span>
                  <span className="font-semibold text-secondary">+{formatCurrency(product.incomePerMinute)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-sm text-slate-400">Monthly cost</span>
                  <span className="font-semibold text-red-400">-{formatCurrency(product.monthlyCost)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-sm text-slate-400">Net profit/month</span>
                  <span className="font-semibold text-secondary">
                    +{formatCurrency((product.incomePerMinute * 60 * 24 * 30) - product.monthlyCost)}
                  </span>
                </div>
              </div>

              <Button 
                className="w-full"
                disabled={isDisabled}
                onClick={() => handlePurchaseServer(product.id)}
                variant={isDisabled ? "secondary" : "default"}
              >
                {!canPurchase ? 'Server Limit Reached' : 
                 !canAfford ? 'Insufficient Funds' : 
                 'Purchase Server'}
              </Button>

              {!canAfford && canPurchase && (
                <p className="text-xs text-red-400 mt-2 text-center">
                  Need {formatCurrency(product.price - gameState.user.balance)} more
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Upgrade Notice */}
      <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <i className="fas fa-graduation-cap text-purple-400"></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-purple-400">Want More Servers?</h3>
            <p className="text-sm text-slate-400">Complete learning courses to increase your server limit</p>
          </div>
        </div>
        <p className="text-sm text-slate-300 mb-4">
          Each completed course can unlock additional server slots and improve your server efficiency. 
          Visit the Learning Center to start your next course!
        </p>
        <Button 
          variant="outline" 
          className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
          onClick={() => onTabChange && onTabChange('learning')}
        >
          Browse Learning Courses
        </Button>
      </div>
    </div>
  );
}
