import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Mail, Phone, Search, Trash2, CheckCircle2, Clock, MessageSquare, Eye } from 'lucide-react';
import { toast } from 'sonner';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ContactDetailsModal from '@/components/ContactDetailsModal';
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
import { contactService } from '@/services/contact.service';
import type { Contact } from '@/types';
import { ContactStatus } from '@/types';

const statusConfig: Record<ContactStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  NEW: { label: 'Nova', variant: 'default' },
  READ: { label: 'Lida', variant: 'secondary' },
  REPLIED: { label: 'Respondida', variant: 'outline' },
  CLOSED: { label: 'Fechada', variant: 'destructive' },
};

export default function ContactsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContactStatus | ''>('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['contacts', page, search, statusFilter],
    queryFn: () =>
      contactService.getAll({
        page,
        take: 10,
        search: search || undefined,
        status: statusFilter || undefined,
      }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactStatus }) =>
      contactService.updateStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Status atualizado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar status');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contactService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsDeleteDialogOpen(false);
      setContactToDelete(null);
      toast.success('Contato removido com sucesso');
    },
    onError: () => {
      toast.error('Erro ao remover contato');
    },
  });

  const handleStatusChange = (contact: Contact, newStatus: ContactStatus) => {
    updateStatusMutation.mutate({ id: contact.id, status: newStatus });
  };

  const handleViewDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedContact(null);
  };

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (contactToDelete) {
      deleteMutation.mutate(contactToDelete.id);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setContactToDelete(null);
  };

  const contacts = data?.data || [];
  const totalPages = data ? Math.ceil(data.total / 10) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Mensagens de Contato</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as mensagens recebidas pelo formulário de contato
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou assunto..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as ContactStatus | '');
              setPage(1);
            }}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="">Todos os status</option>
            <option value="NEW">Nova</option>
            <option value="READ">Lida</option>
            <option value="REPLIED">Respondida</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Novas</p>
                <p className="text-2xl font-bold">
                  {contacts.filter((c) => c.status === 'NEW').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lidas</p>
                <p className="text-2xl font-bold">
                  {contacts.filter((c) => c.status === ContactStatus.READ).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Respondidas</p>
                <p className="text-2xl font-bold">
                  {contacts.filter((c) => c.status === ContactStatus.REPLIED).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg bg-card">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : contacts.length === 0 ? (
            <div className="p-8 text-center">
              <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Nenhuma mensagem encontrada</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Assunto</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {format(new Date(contact.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                          locale: ptBR,
                        })}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{contact.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs">
                            <Mail className="h-3 w-3" />
                            <span>{contact.email}</span>
                          </div>
                          {contact.phone && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{contact.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-medium text-sm truncate">{contact.subject}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {contact.message}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[contact.status].variant}>
                          {statusConfig[contact.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(contact)}
                            title="Ver Detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {contact.status === ContactStatus.NEW && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(contact, ContactStatus.READ)}
                              title="Marcar como lida"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          )}
                          {contact.status === ContactStatus.READ && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(contact, ContactStatus.REPLIED)}
                              title="Marcar como respondida"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(contact)}
                            title="Remover"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    Página {page} de {totalPages} ({data?.total} mensagens no total)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ContactDetailsModal
        contact={selectedContact}
        open={isDetailsOpen}
        onClose={handleCloseDetails}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a mensagem de{' '}
              <strong>{contactToDelete?.name}</strong>? Esta ação não pode ser desfeita.
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
