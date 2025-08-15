import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGame } from '@/contexts/game-context';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [loginData, setLoginData] = useState({ nickname: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    nickname: '', 
    password: '', 
    confirmPassword: '' 
  });
  const { login, register, isLoading } = useGame();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(loginData.nickname, loginData.password);
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Registration Failed",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    try {
      await register(registerData.nickname, registerData.password, registerData.confirmPassword);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/80 backdrop-blur-sm border-slate-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <div className="flex-1 text-center">
              <CardTitle className="text-2xl font-bold text-primary">GameStats</CardTitle>
              <p className="text-slate-400">Server Hosting Simulator</p>
            </div>
            <div className="flex-1 flex justify-end">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[100px] bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇺🇸 EN</SelectItem>
                  <SelectItem value="ru">🇷🇺 RU</SelectItem>
                  <SelectItem value="de">🇩🇪 DE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-nickname">Nickname</Label>
                  <Input
                    id="login-nickname"
                    type="text"
                    value={loginData.nickname}
                    onChange={(e) => setLoginData({ ...loginData, nickname: e.target.value })}
                    required
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-nickname">Nickname</Label>
                  <Input
                    id="register-nickname"
                    type="text"
                    value={registerData.nickname}
                    onChange={(e) => setRegisterData({ ...registerData, nickname: e.target.value })}
                    required
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm">Confirm Password</Label>
                  <Input
                    id="register-confirm"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Register'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
