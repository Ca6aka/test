import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { BookOpen, CheckCircle, ArrowRight, Gift, Coins, Server, GraduationCap, X } from 'lucide-react';
import { useLanguage } from '../contexts/language-context';
import { useToast } from '../hooks/use-toast';
import { apiRequest } from '../lib/queryClient';

const TutorialSystem = ({ onComplete }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const { data: tutorialData, isLoading } = useQuery({
    queryKey: ['/api/tutorial'],
    refetchInterval: 5000,
  });

  const updateProgressMutation = useMutation({
    mutationFn: (step) => apiRequest('/api/tutorial/progress', { 
      method: 'POST', 
      body: JSON.stringify({ step }) 
    }),
    onSuccess: (data) => {
      if (data.completed) {
        toast({
          title: t('tutorialCompleted'),
          description: t('tutorialCompletedDesc'),
        });
        setIsVisible(false);
        if (onComplete) onComplete();
      }
      queryClient.invalidateQueries({ queryKey: ['/api/tutorial'] });
    },
  });

  useEffect(() => {
    if (tutorialData && !tutorialData.completed) {
      setCurrentStep(tutorialData.currentStep || 0);
    } else if (tutorialData?.completed) {
      setIsVisible(false);
    }
  }, [tutorialData]);

  if (isLoading || !isVisible || tutorialData?.completed) {
    return null;
  }

  const steps = [
    {
      id: 'welcome',
      title: t('welcomeToGame'),
      description: t('tutorialStep1'),
      icon: BookOpen,
      color: 'blue',
      reward: 15000
    },
    {
      id: 'earning',
      title: t('earnMoney'),
      description: t('tutorialStep2'),
      icon: Coins,
      color: 'yellow',
      reward: 0
    },
    {
      id: 'shop',
      title: t('visitShop'),
      description: t('tutorialStep3'),
      icon: Gift,
      color: 'green',
      reward: 0
    },
    {
      id: 'servers',
      title: t('manageServers'),
      description: t('tutorialStep4'),
      icon: Server,
      color: 'purple',
      reward: 0
    },
    {
      id: 'learning',
      title: t('learningCenter'),
      description: t('tutorialStep5'),
      icon: GraduationCap,
      color: 'red',
      reward: 0
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNextStep = () => {
    const nextStep = currentStep + 1;
    
    if (nextStep >= steps.length) {
      updateProgressMutation.mutate(steps.length - 1);
    } else {
      setCurrentStep(nextStep);
      updateProgressMutation.mutate(nextStep);
    }
  };

  const handleSkip = () => {
    updateProgressMutation.mutate(steps.length - 1);
  };

  const IconComponent = currentStepData.icon;
  const colorClasses = {
    blue: 'border-blue-500 bg-gradient-to-br from-blue-900/30 to-blue-800/20 text-blue-300',
    yellow: 'border-yellow-500 bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 text-yellow-300',
    green: 'border-green-500 bg-gradient-to-br from-green-900/30 to-green-800/20 text-green-300',
    purple: 'border-purple-500 bg-gradient-to-br from-purple-900/30 to-purple-800/20 text-purple-300',
    red: 'border-red-500 bg-gradient-to-br from-red-900/30 to-red-800/20 text-red-300'
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={`max-w-2xl w-full border-2 ${colorClasses[currentStepData.color]}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full bg-${currentStepData.color}-600/30`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                <Badge variant="outline" className="mt-1">
                  {t('step')} {currentStep + 1} {t('of')} {steps.length}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <Progress value={progress} className="w-full h-2" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <p className="text-slate-300 text-lg leading-relaxed">
              {currentStepData.description}
            </p>
            
            {currentStepData.reward > 0 && (
              <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-green-300">
                  <Gift className="w-4 h-4" />
                  <span className="font-medium">{t('tutorialReward')}: ${currentStepData.reward}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index <= currentStep
                      ? `bg-${currentStepData.color}-500`
                      : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="text-slate-400 border-slate-600 hover:bg-slate-700"
              >
                {t('skipTutorial')}
              </Button>
              
              <Button
                onClick={handleNextStep}
                disabled={updateProgressMutation.isPending}
                className={`bg-${currentStepData.color}-600 hover:bg-${currentStepData.color}-700 text-white`}
              >
                {updateProgressMutation.isPending ? (
                  t('updating')
                ) : currentStep >= steps.length - 1 ? (
                  t('completeTutorial')
                ) : (
                  <>
                    {t('nextStep')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorialSystem;