import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Filter, Eye, Trash2, FileText, MoreVertical, X, Calendar, Download } from 'lucide-react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import QuoteDetailsModal from '@/components/QuoteDetailsModal';
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
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | ''>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const take = 10;
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['quotes', page, search, statusFilter, dateFrom, dateTo],
    queryFn: () =>
      quoteService.getAll({
        skip: page * take,
        take,
        search: search || undefined,
        status: statusFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
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

  const deleteMutation = useMutation({
    mutationFn: (id: string) => quoteService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsDeleteDialogOpen(false);
      setQuoteToDelete(null);
      toast.success('Orçamento excluído com sucesso');
    },
    onError: () => {
      toast.error('Erro ao excluir orçamento');
    },
  });

  const handleStatusChange = (quote: Quote, newStatus: QuoteStatus) => {
    updateStatusMutation.mutate({ id: quote.id, status: newStatus });
  };

  const handleViewDetails = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedQuote(null);
  };

  const handleDeleteClick = (quote: Quote) => {
    setQuoteToDelete(quote);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (quoteToDelete) {
      deleteMutation.mutate(quoteToDelete.id);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setQuoteToDelete(null);
  };

  const handleClearFilters = () => {
    setStatusFilter('');
    setDateFrom('');
    setDateTo('');
    setPage(0);
  };

  const handleApplyFilters = () => {
    setPage(0);
    setIsFilterOpen(false);
  };

  const handleExportCSV = () => {
    const params = new URLSearchParams();
    if (statusFilter) params.append('status', statusFilter);
    if (search) params.append('search', search);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);

    const url = `${import.meta.env.VITE_API_URL}/api/admin/quotes/export/csv?${params.toString()}`;
    window.open(url, '_blank');
    toast.success('Exportando orçamentos para CSV...');
  };

  const handleExportPDF = () => {
    const params = new URLSearchParams();
    if (statusFilter) params.append('status', statusFilter);
    if (search) params.append('search', search);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);

    const url = `${import.meta.env.VITE_API_URL}/api/admin/quotes/export/pdf?${params.toString()}`;
    window.open(url, '_blank');
    toast.success('Exportando orçamentos para PDF...');
  };

  const hasActiveFilters = statusFilter !== '' || dateFrom !== '' || dateTo !== '';

  const quotes = data?.data || [];
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
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Mais Filtros
                    {hasActiveFilters && (
                      <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {[statusFilter, dateFrom, dateTo].filter(Boolean).length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Filtros Avançados</h4>
                      <p className="text-sm text-muted-foreground">
                        Refine sua busca por status e período
                      </p>
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as QuoteStatus | '')}
                        className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                      >
                        <option value="">Todos os status</option>
                        <option value={QuoteStatus.NEW}>Novo</option>
                        <option value={QuoteStatus.ANALYZING}>Em Análise</option>
                        <option value={QuoteStatus.QUOTE_SENT}>Orçamento Enviado</option>
                        <option value={QuoteStatus.APPROVED}>Aprovado</option>
                        <option value={QuoteStatus.REJECTED}>Rejeitado</option>
                        <option value={QuoteStatus.COMPLETED}>Concluído</option>
                      </select>
                    </div>

                    {/* Date Range */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Período</label>
                      <div className="grid gap-2">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Data inicial</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="date"
                              value={dateFrom}
                              onChange={(e) => setDateFrom(e.target.value)}
                              className="pl-9"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Data final</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="date"
                              value={dateTo}
                              onChange={(e) => setDateTo(e.target.value)}
                              className="pl-9"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                        className="flex-1"
                        disabled={!hasActiveFilters}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Limpar
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleApplyFilters}
                        className="flex-1"
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        Aplicar
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                title="Exportar para CSV"
              >
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                title="Exportar para PDF"
              >
                <Download className="h-4 w-4 mr-2" />
                PDF
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
            ) : quotes && quotes.length > 0 ? (
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
                    {quotes.map((quote) => (
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
                              <div className="text-muted-foreground">{quote.service.title}</div>
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
                              <DropdownMenuItem onClick={() => handleViewDetails(quote)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteClick(quote)}
                              >
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

      <QuoteDetailsModal
        quote={selectedQuote}
        open={isDetailsOpen}
        onClose={handleCloseDetails}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o orçamento de{' '}
              <strong>{quoteToDelete?.customer.name}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
