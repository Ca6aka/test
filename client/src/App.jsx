import { Switch, Route, Redirect} from "wouter"
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { GameProvider, useGame } from "@/contexts/game-context";
import { LanguageProvider } from "@/contexts/language-context";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import PlayerProfilePage from "@/pages/player-profile";
import NotFound from "@/pages/not-found";


function AppRouter() {
  const { gameState } = useGame();

  return (
    <Switch>
      <Route path="/">
        {gameState.user ? <Redirect to="/game" /> : <HomePage />}
      </Route>
      
      <Route path="/start">
        {gameState.user ? <Redirect to="/game" /> : <HomePage />}
      </Route>
      
      <Route path="/reg">
        {gameState.user ? <Redirect to="/game" /> : <LoginPage />}
      </Route>
      
      <Route path="/game">
        {gameState.user ? <DashboardPage /> : <Redirect to="/reg" />}
      </Route>
      
      <Route path="/player/:nickname" component={PlayerProfilePage} />
      
      <Route path="/player">
        {gameState.user ? <Redirect to="/game" /> : <Redirect to="/reg" />}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider defaultTheme="light" storageKey="serversim-ui-theme">
          <GameProvider>
            <TooltipProvider>
              <Toaster />
              <AppRouter />
            </TooltipProvider>
          </GameProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
