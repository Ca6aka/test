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
  const { language, changeLanguage, t } = useLanguage();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(loginData.nickname, loginData.password);
    } catch (error) {
      toast({
        title: t('loginFailed'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Validate nickname function
  const validateNickname = (nickname) => {
    if (nickname.length > 8) {
      return t('nicknameTooLong') || 'Nickname must be 8 characters or less';
    }
    // Allow only letters, numbers, and limited safe characters
    const validPattern = /^[a-zA-Z0-9_-]+$/;
    if (!validPattern.test(nickname)) {
      return t('nicknameInvalidChars') || 'Nickname can only contain letters, numbers, hyphens, and underscores';
    }
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validate nickname
    const nicknameError = validateNickname(registerData.nickname);
    if (nicknameError) {
      toast({
        title: t('registrationFailed'),
        description: nicknameError,
        variant: "destructive",
      });
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: t('registrationFailed'),
        description: t('passwordsDoNotMatch'),
        variant: "destructive",
      });
      return;
    }
    try {
      await register(registerData.nickname, registerData.password, registerData.confirmPassword);
    } catch (error) {
      toast({
        title: t('registrationFailed'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Floating particles - reduced for mobile performance */}
        <div className="absolute inset-0 hidden sm:block">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-400/10 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDk5LCAxMDIsIDI0MSwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        
        {/* Glowing orbs - simpler on mobile */}
        <div className="absolute top-1/4 left-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-blue-500/20 rounded-full blur-xl sm:blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-purple-500/20 rounded-full blur-xl sm:blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 left-1/2 w-24 sm:w-48 h-24 sm:h-48 bg-green-500/20 rounded-full blur-xl sm:blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <Card className="w-full max-w-md bg-slate-800/90 backdrop-blur-lg border-slate-700/50 shadow-2xl relative z-10">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <div className="flex-1 text-center">
              <CardTitle>
                <span className="text-2xl font-bold text-primary bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent test-name-1">
                  Root Tycoon
                </span>
              </CardTitle>

              <p className="text-slate-400 mt-1">Server Hosting Simulator</p>
            </div>
            <div className="flex-1 flex justify-end">
              <Select value={language} onValueChange={changeLanguage}>
                <SelectTrigger className="w-[100px] bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇺🇸 EN</SelectItem>
                  <SelectItem value="ru">🇷🇺 RU</SelectItem>
                  <SelectItem value="ua">🇺🇦 UA</SelectItem>
                  <SelectItem value="de">🇩🇪 DE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t('login')}</TabsTrigger>
              <TabsTrigger value="register">{t('register')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-nickname">{t('nickname')}</Label>
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
                  <Label htmlFor="login-password">{t('password')}</Label>
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
                  {isLoading ? t('loggingIn') : t('login')}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-nickname">{t('nickname')}</Label>
                  <Input
                    id="register-nickname"
                    type="text"
                    value={registerData.nickname}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Limit input to 8 characters and filter special characters
                      if (value.length <= 8 && /^[a-zA-Z0-9_-]*$/.test(value)) {
                        setRegisterData({ ...registerData, nickname: value });
                      }
                    }}
                    required
                    maxLength={8}
                    placeholder={t('nicknameMax8Chars') || 'Max 8 characters, letters/numbers only'}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">{t('password')}</Label>
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
                  <Label htmlFor="register-confirm">{t('confirmPassword')}</Label>
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
                  {isLoading ? t('creatingAccount') : t('register')}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
