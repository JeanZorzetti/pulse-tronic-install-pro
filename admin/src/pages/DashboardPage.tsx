import { useQuery } from '@tanstack/react-query';
import { FileText, MessageSquare, Bell, TrendingUp } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardService } from '@/services/dashboard.service';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
    retry: false,
  });

  const { data: charts, isLoading: isLoadingCharts } = useQuery({
    queryKey: ['dashboard-charts'],
    queryFn: () => dashboardService.getCharts(),
    retry: false,
  });

  const metrics = [
    {
      title: 'Orçamentos Hoje',
      value: stats?.quotesToday || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Orçamentos Semana',
      value: stats?.quotesWeek || 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Orçamentos Pendentes',
      value: stats?.pendingQuotes || 0,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Contatos Hoje',
      value: stats?.contactsToday || 0,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Notificações Não Lidas',
      value: stats?.unreadNotifications || 0,
      icon: Bell,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Taxa de Conversão',
      value: stats?.conversionRate ? `${stats.conversionRate.toFixed(1)}%` : '0%',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
  ];

  // Status labels and colors for chart
  const statusLabels: Record<string, string> = {
    NEW: 'Novo',
    ANALYZING: 'Em Análise',
    QUOTE_SENT: 'Orçamento Enviado',
    APPROVED: 'Aprovado',
    REJECTED: 'Rejeitado',
    COMPLETED: 'Concluído',
  };

  const statusColors: Record<string, string> = {
    NEW: '#fbbf24',
    ANALYZING: '#3b82f6',
    QUOTE_SENT: '#a855f7',
    APPROVED: '#22c55e',
    REJECTED: '#ef4444',
    COMPLETED: '#6b7280',
  };

  // Format chart data
  const statusChartData = charts?.statusData.map((item) => ({
    name: statusLabels[item.status] || item.status,
    value: item.count,
    color: statusColors[item.status] || '#6b7280',
  })) || [];

  const timelineChartData = charts?.timelineData.map((item) => ({
    date: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    count: item.count,
  })) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bem-vindo, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Aqui está um resumo das atividades recentes
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  <div className="text-2xl font-bold">{metric.value}</div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {index === 0 && 'Nas últimas 24 horas'}
                  {index === 1 && 'Nos últimos 7 dias'}
                  {index === 2 && 'Aguardando resposta'}
                  {index === 3 && 'Novas mensagens hoje'}
                  {index === 4 && 'Requer atenção'}
                  {index === 5 && 'Orçamentos aprovados'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Orçamentos por Status</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingCharts ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : statusChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="value" name="Quantidade">
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                  Nenhum dado disponível
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orçamentos dos Últimos 7 Dias</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingCharts ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : timelineChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Orçamentos"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                  Nenhum dado disponível
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Ver Orçamentos Pendentes</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.pendingQuotes || 0} aguardando resposta
                  </p>
                </div>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Responder Contatos</p>
                  <p className="text-sm text-muted-foreground">
                    Mensagens recebidas hoje
                  </p>
                </div>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Ver Notificações</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.unreadNotifications || 0} não lidas
                  </p>
                </div>
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground text-center py-8">
                Nenhuma atividade recente
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Info */}
        {!stats && !isLoading && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <p className="text-sm text-orange-800">
                <strong>Nota:</strong> O backend ainda não possui o endpoint de estatísticas.
                As métricas serão exibidas assim que o endpoint{' '}
                <code className="bg-orange-100 px-2 py-1 rounded">
                  GET /api/admin/dashboard/stats
                </code>{' '}
                for implementado.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
