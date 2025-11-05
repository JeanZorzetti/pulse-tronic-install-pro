import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Pulse Tronic</h1>
            <p className="text-sm text-muted-foreground">Painel Administrativo</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Bem-vindo, {user?.name}! 👋</h2>
          <p className="text-muted-foreground mb-8">
            Este é o painel administrativo da Pulse Tronic. Em breve você terá acesso a todas as
            funcionalidades de gerenciamento.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Orçamentos</h3>
              <p className="text-muted-foreground text-sm">
                Gerencie orçamentos solicitados pelos clientes
              </p>
              <div className="mt-4 text-3xl font-bold text-primary">0</div>
              <p className="text-xs text-muted-foreground">Pendentes</p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Contatos</h3>
              <p className="text-muted-foreground text-sm">
                Visualize mensagens dos formulários de contato
              </p>
              <div className="mt-4 text-3xl font-bold text-primary">0</div>
              <p className="text-xs text-muted-foreground">Não respondidos</p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Notificações</h3>
              <p className="text-muted-foreground text-sm">
                Acompanhe novos eventos e atualizações
              </p>
              <div className="mt-4 text-3xl font-bold text-primary">0</div>
              <p className="text-xs text-muted-foreground">Não lidas</p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Serviços</h3>
              <p className="text-muted-foreground text-sm">
                Gerencie o catálogo de serviços oferecidos
              </p>
              <div className="mt-4 text-3xl font-bold text-primary">-</div>
              <p className="text-xs text-muted-foreground">Em breve</p>
            </div>
          </div>

          <div className="mt-8 bg-primary/10 border border-primary/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-primary">Em Desenvolvimento</h3>
            <p className="text-sm text-muted-foreground">
              O painel administrativo está sendo construído. Em breve você terá acesso a:
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span>
                Dashboard com métricas e gráficos
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span>
                Gerenciamento completo de orçamentos
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span>
                Sistema de notificações em tempo real
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span>
                CMS para serviços, FAQs e depoimentos
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span>
                Calendário de agendamentos
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
