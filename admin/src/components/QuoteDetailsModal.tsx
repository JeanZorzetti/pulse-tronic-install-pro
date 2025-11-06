import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  FileText,
  User,
  Mail,
  Phone,
  Car,
  Wrench,
  Calendar,
  DollarSign,
  Clock,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import type { Quote, QuoteStatus } from '@/types';

interface QuoteDetailsModalProps {
  quote: Quote | null;
  open: boolean;
  onClose: () => void;
  onStatusChange?: (quote: Quote, newStatus: QuoteStatus) => void;
  onDelete?: (quoteId: string) => void;
}

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

export default function QuoteDetailsModal({
  quote,
  open,
  onClose,
}: QuoteDetailsModalProps) {
  if (!quote) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Detalhes do Orçamento
              </DialogTitle>
              <DialogDescription className="mt-1">
                Solicitado em {format(new Date(quote.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </DialogDescription>
            </div>
            <Badge className={statusColors[quote.status]} variant="outline">
              {statusLabels[quote.status]}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Cliente */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              Informações do Cliente
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{quote.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <p className="font-medium text-sm">{quote.customer.email}</p>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Telefone</p>
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <p className="font-medium">{quote.customer.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Veículo */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Car className="h-5 w-5 text-muted-foreground" />
              Informações do Veículo
            </h3>
            <div className="grid grid-cols-3 gap-4 bg-muted/50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Marca</p>
                <p className="font-medium">{quote.vehicleBrand}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Modelo</p>
                <p className="font-medium">{quote.vehicleModel}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ano</p>
                <p className="font-medium">{quote.vehicleYear}</p>
              </div>
            </div>
          </div>

          {/* Equipamento */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Wrench className="h-5 w-5 text-muted-foreground" />
              Equipamento/Serviço
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Marca do Equipamento</p>
                  <p className="font-medium">{quote.equipmentBrand}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Modelo do Equipamento</p>
                  <p className="font-medium">{quote.equipmentModel}</p>
                </div>
              </div>
              {quote.service && (
                <div>
                  <p className="text-sm text-muted-foreground">Serviço Solicitado</p>
                  <p className="font-medium">{quote.service.name}</p>
                </div>
              )}
              {quote.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Descrição</p>
                  <p className="font-medium text-sm leading-relaxed">{quote.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Orçamento */}
          {(quote.estimatedPrice || quote.estimatedDuration) && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                Estimativa
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                {quote.estimatedPrice && (
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Estimado</p>
                    <p className="font-semibold text-lg text-green-600">
                      R$ {quote.estimatedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
                {quote.estimatedDuration && (
                  <div>
                    <p className="text-sm text-muted-foreground">Duração Estimada</p>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{quote.estimatedDuration} minutos</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Responsável */}
          {quote.assignedTo && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                Responsável
              </h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="font-medium">{quote.assignedTo.name}</p>
                <p className="text-sm text-muted-foreground">{quote.assignedTo.email}</p>
              </div>
            </div>
          )}

          {/* Datas */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              Histórico
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Criado em</p>
                <p className="font-medium text-sm">
                  {format(new Date(quote.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Última Atualização</p>
                <p className="font-medium text-sm">
                  {format(new Date(quote.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
