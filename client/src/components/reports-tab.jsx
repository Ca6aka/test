import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MessageCircle, Plus, MoreHorizontal, X, Send, Clock, CheckCircle, Flag } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useGame } from '@/contexts/game-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { formatCurrency } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

export function ReportsTab() {
  const { t } = useLanguage();
  const { gameState } = useGame();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedReport, setSelectedReport] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewReportDialog, setShowNewReportDialog] = useState(false);
  const [newReportSubject, setNewReportSubject] = useState('');
  const [newReportCategory, setNewReportCategory] = useState('');
  const [newReportMessage, setNewReportMessage] = useState('');

  const isAdmin = gameState.user?.admin >= 1;

  // Fetch reports
  const { data: reports = [], refetch: refetchReports } = useQuery({
    queryKey: ['/api/reports'],
    queryFn: () => fetch('/api/reports').then(res => res.json()),
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  // Fetch messages for selected report
  const { data: messages = [], refetch: refetchMessages } = useQuery({
    queryKey: ['/api/reports', selectedReport?.id, 'messages'],
    queryFn: () => fetch(`/api/reports/${selectedReport.id}/messages`).then(res => res.json()),
    enabled: !!selectedReport,
    refetchInterval: 2000 // Refresh every 2 seconds
  });

  // Create new report
  const createReportMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest('/api/reports', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reports'] });
      setShowNewReportDialog(false);
      setNewReportSubject('');
      setNewReportCategory('');
      setNewReportMessage('');
      toast({ title: t('reportSent'), description: t('reportSentDescription') });
    },
    onError: (error) => {
      toast({ title: t('error'), description: error.message, variant: 'destructive' });
    }
  });

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: async (message) => {
      const response = await apiRequest(`/api/reports/${selectedReport.id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ message })
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reports', selectedReport.id, 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/reports'] });
      setNewMessage('');
    },
    onError: (error) => {
      toast({ title: t('error'), description: error.message, variant: 'destructive' });
    }
  });

  // Admin actions
  const closeReportMutation = useMutation({
    mutationFn: async (reportId) => {
      const response = await apiRequest(`/api/reports/${reportId}/close`, {
        method: 'POST'
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reports'] });
      setSelectedReport(null);
      toast({ title: t('reportClosed'), description: t('reportClosedDescription') });
    }
  });

  const deleteReportMutation = useMutation({
    mutationFn: async (reportId) => {
      const response = await apiRequest(`/api/reports/${reportId}`, {
        method: 'DELETE'
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reports'] });
      setSelectedReport(null);
      toast({ title: t('reportDeleted'), description: t('reportDeletedDescription') });
    }
  });

  const markReportMutation = useMutation({
    mutationFn: async (reportId) => {
      const response = await apiRequest(`/api/reports/${reportId}/mark`, {
        method: 'POST'
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reports'] });
    }
  });

  const handleCreateReport = () => {
    if (!newReportSubject.trim() || !newReportCategory || !newReportMessage.trim()) {
      toast({ title: t('error'), description: t('fillAllFields'), variant: 'destructive' });
      return;
    }

    createReportMutation.mutate({
      subject: newReportSubject,
      category: newReportCategory,
      initialMessage: newReportMessage
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate(newMessage);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <Badge variant="default" className="bg-blue-500/20 text-blue-400">{t('open')}</Badge>;
      case 'closed':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-400">{t('closed')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryIcon = (category) => {
    return category === 'technical' ? '🔧' : '💬';
  };

  // Check if user has active report
  const hasActiveReport = reports.some(report => report.status === 'open' && !isAdmin);

  return (
    <div className="h-full flex flex-col lg:flex-row bg-slate-900/50 rounded-lg border border-slate-700">
      {/* Left Panel - Reports List */}
      <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">{isAdmin ? t('incomingReports') : t('myReports')}</h2>
          {!isAdmin && (
            <Dialog open={showNewReportDialog} onOpenChange={setShowNewReportDialog}>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={hasActiveReport}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('newTicket')}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">{t('createNewTicket')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">{t('subject')}</label>
                    <Input
                      value={newReportSubject}
                      onChange={(e) => setNewReportSubject(e.target.value)}
                      placeholder={t('enterSubject')}
                      className="bg-slate-700 border-slate-600 text-white"
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">{t('category')}</label>
                    <Select value={newReportCategory} onValueChange={setNewReportCategory}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder={t('selectCategory')} />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="general" className="text-white">{t('generalIssue')}</SelectItem>
                        <SelectItem value="technical" className="text-white">{t('technicalIssue')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">{t('description')}</label>
                    <textarea
                      value={newReportMessage}
                      onChange={(e) => setNewReportMessage(e.target.value)}
                      placeholder={t('describeIssue')}
                      className="w-full p-3 bg-slate-700 border border-slate-600 text-white rounded-md min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={1000}
                    />
                  </div>
                  <Button 
                    onClick={handleCreateReport}
                    disabled={createReportMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {createReportMutation.isPending ? t('sending') : t('startChat')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {hasActiveReport && !isAdmin && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-400">{t('activeReportExists')}</p>
          </div>
        )}

        <div className="space-y-2 max-h-[400px] lg:max-h-[600px] overflow-y-auto">
          {reports.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{isAdmin ? t('noIncomingReports') : t('noReports')}</p>
            </div>
          ) : (
            reports.map((report) => (
              <Card 
                key={report.id}
                className={`cursor-pointer transition-all border ${
                  selectedReport?.id === report.id 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : report.isMarked && isAdmin 
                      ? 'border-red-500/50 bg-red-500/5' 
                      : 'border-slate-600 bg-slate-700/50 hover:bg-slate-700'
                }`}
                onClick={() => setSelectedReport(report)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getCategoryIcon(report.category)}</span>
                      <div>
                        <h3 className="font-medium text-white text-sm truncate">
                          {isAdmin ? `${report.userNickname}: ${report.subject}` : report.subject}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {report.hasNewMessages && (
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      )}
                      {getStatusBadge(report.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className="flex-1 flex flex-col">
        {selectedReport ? (
          <>
            {/* Chat Header */}
            <div className="border-b border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">{selectedReport.subject}</h3>
                  <p className="text-sm text-slate-400">
                    {getCategoryIcon(selectedReport.category)} {t(selectedReport.category + 'Issue')} • {getStatusBadge(selectedReport.status)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {isAdmin && selectedReport.status === 'open' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-slate-700 border-slate-600">
                        <DropdownMenuItem onClick={() => closeReportMutation.mutate(selectedReport.id)}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {t('closeChat')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteReportMutation.mutate(selectedReport.id)}>
                          <X className="w-4 h-4 mr-2" />
                          {t('deleteChat')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => markReportMutation.mutate(selectedReport.id)}>
                          <Flag className="w-4 h-4 mr-2" />
                          {selectedReport.isMarked ? t('unmarkChat') : t('markChat')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setSelectedReport(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isFromAdmin ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isFromAdmin
                        ? 'bg-slate-700 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium">
                        {message.isFromAdmin ? t('admin') : message.userNickname}
                      </span>
                      <span className="text-xs opacity-70">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            {selectedReport.status === 'open' ? (
              <div className="border-t border-slate-700 p-4">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t('typeMessage')}
                    className="flex-1 bg-slate-700 border-slate-600 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    maxLength={500}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={sendMessageMutation.isPending || !newMessage.trim()}
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border-t border-slate-700 p-4 bg-slate-800/50">
                <p className="text-center text-slate-400 text-sm">
                  {t('chatClosedByAdmin')}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>{t('selectReportToView')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}