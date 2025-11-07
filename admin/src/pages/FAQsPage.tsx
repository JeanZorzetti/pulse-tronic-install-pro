import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { faqService } from '@/services/faq.service';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Power } from 'lucide-react';
import { toast } from 'sonner';
import type { FAQ } from '@/types';
import { FAQFormModal } from '@/components/FAQFormModal';

export function FAQsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [faqToEdit, setFaqToEdit] = useState<FAQ | null>(null);
  const [faqToDelete, setFaqToDelete] = useState<FAQ | null>(null);
  const [faqToView, setFaqToView] = useState<FAQ | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);

  const queryClient = useQueryClient();

  // Fetch FAQs
  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ['faqs', 'admin', statusFilter],
    queryFn: () => faqService.getAllAdmin(statusFilter),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => faqService.deleteAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success('FAQ excluído com sucesso');
      setIsDeleteDialogOpen(false);
      setFaqToDelete(null);
    },
    onError: () => {
      toast.error('Erro ao excluir FAQ');
    },
  });

  // Toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => faqService.toggleActiveAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success('Status atualizado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar status');
    },
  });

  const handleCreate = () => {
    setFaqToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (faq: FAQ) => {
    setFaqToEdit(faq);
    setIsFormOpen(true);
  };

  const handleDelete = (faq: FAQ) => {
    setFaqToDelete(faq);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (faqToDelete) {
      deleteMutation.mutate(faqToDelete.id);
    }
  };

  const handleToggleActive = (id: string) => {
    toggleActiveMutation.mutate(id);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFaqToEdit(null);
  };

  const handleViewDetails = (faq: FAQ) => {
    setFaqToView(faq);
  };

  const handleCloseDetails = () => {
    setFaqToView(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">FAQs</h1>
          <p className="text-muted-foreground">
            Gerencie as perguntas frequentes do site
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nova FAQ
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={statusFilter === undefined ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter(undefined)}
        >
          Todos
        </Button>
        <Button
          variant={statusFilter === true ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter(true)}
        >
          Ativos
        </Button>
        <Button
          variant={statusFilter === false ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter(false)}
        >
          Inativos
        </Button>
      </div>

      {/* FAQs Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Ordem</TableHead>
              <TableHead>Pergunta</TableHead>
              <TableHead>Resposta</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="text-right w-[180px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : faqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Nenhuma FAQ encontrada
                </TableCell>
              </TableRow>
            ) : (
              faqs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="font-mono text-sm">
                    {faq.displayOrder}
                  </TableCell>
                  <TableCell className="font-medium max-w-[300px] truncate">
                    {faq.question}
                  </TableCell>
                  <TableCell className="max-w-[400px] truncate text-muted-foreground">
                    {faq.answer}
                  </TableCell>
                  <TableCell>
                    <Badge variant={faq.isActive ? 'default' : 'secondary'}>
                      {faq.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(faq)}
                        title="Ver Detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(faq)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(faq.id)}
                        title={faq.isActive ? 'Desativar' : 'Ativar'}
                      >
                        <Power
                          className={`h-4 w-4 ${faq.isActive ? 'text-green-600' : 'text-gray-400'}`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(faq)}
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Form Modal */}
      <FAQFormModal
        faq={faqToEdit}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
      />

      {/* View Details Dialog */}
      {faqToView && (
        <AlertDialog open={!!faqToView} onOpenChange={handleCloseDetails}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Detalhes da FAQ</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-4 text-left">
                  <div>
                    <p className="font-semibold text-sm text-foreground mb-1">
                      Pergunta:
                    </p>
                    <p className="text-foreground">{faqToView.question}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground mb-1">
                      Resposta:
                    </p>
                    <p className="text-foreground whitespace-pre-wrap">
                      {faqToView.answer}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <p className="font-semibold text-sm text-foreground mb-1">
                        Ordem de Exibição:
                      </p>
                      <p className="text-foreground">{faqToView.displayOrder}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground mb-1">
                        Status:
                      </p>
                      <Badge variant={faqToView.isActive ? 'default' : 'secondary'}>
                        {faqToView.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleCloseDetails}>
                Fechar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta FAQ? Esta ação não pode ser
              desfeita.
              {faqToDelete && (
                <p className="mt-2 font-medium">{faqToDelete.question}</p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
