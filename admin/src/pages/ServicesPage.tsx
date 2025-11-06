import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wrench, Plus, Edit, Trash2, Eye, Power } from 'lucide-react';
import { toast } from 'sonner';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { serviceService } from '@/services/service.service';
import type { Service, ServiceCategory } from '@/types';

const categoryLabels: Record<ServiceCategory, string> = {
  MULTIMEDIA: 'Multimídia',
  SOUND: 'Som',
  CAMERA: 'Câmeras',
  SECURITY: 'Segurança',
  ACCESSORIES: 'Acessórios',
};

const categoryColors: Record<ServiceCategory, string> = {
  MULTIMEDIA: 'bg-blue-100 text-blue-800 border-blue-200',
  SOUND: 'bg-purple-100 text-purple-800 border-purple-200',
  CAMERA: 'bg-green-100 text-green-800 border-green-200',
  SECURITY: 'bg-red-100 text-red-800 border-red-200',
  ACCESSORIES: 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

export default function ServicesPage() {
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceService.getAll(),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => serviceService.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Status do serviço atualizado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar status do serviço');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => serviceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setIsDeleteDialogOpen(false);
      setServiceToDelete(null);
      toast.success('Serviço excluído com sucesso');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao excluir serviço';
      toast.error(message);
    },
  });

  const handleToggleActive = (service: Service) => {
    toggleActiveMutation.mutate(service.id);
  };

  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (serviceToDelete) {
      deleteMutation.mutate(serviceToDelete.id);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setServiceToDelete(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Wrench className="h-8 w-8 text-primary" />
              Gerenciar Serviços
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os serviços oferecidos pela empresa
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Serviço
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Serviços
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{services?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {services?.filter((s) => s.isActive).length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Inativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {services?.filter((s) => !s.isActive).length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Orçamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {services?.reduce((acc, s) => acc + (s._count?.quotes || 0), 0) || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-sm text-muted-foreground">Carregando serviços...</p>
              </div>
            ) : !services || services.length === 0 ? (
              <div className="p-8 text-center">
                <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Nenhum serviço cadastrado ainda.
                </p>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Serviço
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tempo Estimado</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Orçamentos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{service.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {service.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={categoryColors[service.category]}
                        >
                          {categoryLabels[service.category]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {service.estimatedTime ? (
                          <span className="text-sm">
                            {service.estimatedTime} min
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{service.items.length} items</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {service._count?.quotes || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        {service.isActive ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Ativo
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                            Inativo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Ver Detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(service)}
                            title={service.isActive ? 'Desativar' : 'Ativar'}
                          >
                            <Power
                              className={`h-4 w-4 ${
                                service.isActive ? 'text-green-600' : 'text-gray-400'
                              }`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(service)}
                            title="Excluir"
                            disabled={service._count && service._count.quotes > 0}
                          >
                            <Trash2
                              className={`h-4 w-4 ${
                                service._count && service._count.quotes > 0
                                  ? 'text-gray-300'
                                  : 'text-destructive'
                              }`}
                            />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o serviço{' '}
              <strong>{serviceToDelete?.title}</strong>? Esta ação não pode ser desfeita.
              {serviceToDelete?._count && serviceToDelete._count.quotes > 0 && (
                <span className="block mt-2 text-destructive">
                  Este serviço possui {serviceToDelete._count.quotes} orçamentos associados
                  e não pode ser excluído. Considere desativá-lo.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={
                deleteMutation.isPending ||
                (serviceToDelete?._count && serviceToDelete._count.quotes > 0)
              }
            >
              {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
