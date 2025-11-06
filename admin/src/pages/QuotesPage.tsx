import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Filter, Eye, Trash2, FileText, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { quoteService } from '@/services/quote.service';
import type { Quote } from '@/types';
import { QuoteStatus } from '@/types';

const statusColors: Record<QuoteStatus, string> = {
  NEW: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  ANALYZING: 'bg-blue-100 text-blue-800 border-blue-200',
  QUOTE_SENT: 'bg-purple-100 text-purple-800 border-purple-200',
  APPROVED: 'bg-green-100 text-green-800 border-green-200',
  REJECTED: 'bg-red-100 text-red-800 border-red-200',
  COMPLETED: 'bg-gray-100 text-gray-800 border-gray-200',
};

const statusLabels: Record<QuoteStatus, string> = {
  NEW: 'Novo',
  ANALYZING: 'Em Análise',
  QUOTE_SENT: 'Orçamento Enviado',
  APPROVED: 'Aprovado',
  REJECTED: 'Rejeitado',
  COMPLETED: 'Concluído',
};

export default function QuotesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const take = 10;
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['quotes', page, search],
    queryFn: () =>
      quoteService.getAll({
        skip: page * take,
        take,
      }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: QuoteStatus }) =>
      quoteService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Status atualizado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar status');
    },
  });

  const handleStatusChange = (quote: Quote, newStatus: QuoteStatus) => {
    updateStatusMutation.mutate({ id: quote.id, status: newStatus });
  };

  const filteredQuotes = data?.data.filter((quote) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      quote.customer.name.toLowerCase().includes(searchLower) ||
      quote.customer.email.toLowerCase().includes(searchLower) ||
      quote.equipmentBrand.toLowerCase().includes(searchLower) ||
      quote.equipmentModel.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = data ? Math.ceil(data.total / take) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              Orçamentos
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie todos os orçamentos solicitados
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por cliente, email, equipamento..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Mais Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-sm text-muted-foreground">Carregando orçamentos...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-sm text-destructive">
                  Erro ao carregar orçamentos. Tente novamente.
                </p>
              </div>
            ) : filteredQuotes && filteredQuotes.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Equipamento</TableHead>
                      <TableHead>Veículo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuotes.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell className="font-medium">
                          {format(new Date(quote.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                            locale: ptBR,
                          })}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{quote.customer.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {quote.customer.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">
                              {quote.equipmentBrand} {quote.equipmentModel}
                            </div>
                            {quote.service && (
                              <div className="text-muted-foreground">{quote.service.name}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {quote.vehicleBrand} {quote.vehicleModel}
                            <div className="text-muted-foreground">{quote.vehicleYear}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[quote.status]} variant="outline">
                            {statusLabels[quote.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Mudar Status</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {quote.status !== QuoteStatus.NEW && (
                                <DropdownMenuItem onClick={() => handleStatusChange(quote, QuoteStatus.NEW)}>
                                  🆕 Novo
                                </DropdownMenuItem>
                              )}
                              {quote.status !== QuoteStatus.ANALYZING && (
                                <DropdownMenuItem onClick={() => handleStatusChange(quote, QuoteStatus.ANALYZING)}>
                                  🔍 Em Análise
                                </DropdownMenuItem>
                              )}
                              {quote.status !== QuoteStatus.QUOTE_SENT && (
                                <DropdownMenuItem onClick={() => handleStatusChange(quote, QuoteStatus.QUOTE_SENT)}>
                                  📧 Orçamento Enviado
                                </DropdownMenuItem>
                              )}
                              {quote.status !== QuoteStatus.APPROVED && (
                                <DropdownMenuItem onClick={() => handleStatusChange(quote, QuoteStatus.APPROVED)}>
                                  ✅ Aprovado
                                </DropdownMenuItem>
                              )}
                              {quote.status !== QuoteStatus.REJECTED && (
                                <DropdownMenuItem onClick={() => handleStatusChange(quote, QuoteStatus.REJECTED)}>
                                  ❌ Rejeitado
                                </DropdownMenuItem>
                              )}
                              {quote.status !== QuoteStatus.COMPLETED && (
                                <DropdownMenuItem onClick={() => handleStatusChange(quote, QuoteStatus.COMPLETED)}>
                                  🎉 Concluído
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && data && (
                  <div className="flex items-center justify-between border-t p-4">
                    <div className="text-sm text-muted-foreground">
                      Mostrando {page * take + 1} a {Math.min((page + 1) * take, data.total)} de{' '}
                      {data.total} orçamentos
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0}
                      >
                        Anterior
                      </Button>
                      <div className="text-sm">
                        Página {page + 1} de {totalPages}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={page === totalPages - 1}
                      >
                        Próxima
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  {search ? 'Nenhum orçamento encontrado com esse filtro.' : 'Nenhum orçamento cadastrado ainda.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
