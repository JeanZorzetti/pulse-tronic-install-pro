import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Mail, Phone, User, MessageSquare, Calendar, Clock, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import type { Contact, ContactStatus } from '@/types';

interface ContactDetailsModalProps {
  contact: Contact | null;
  open: boolean;
  onClose: () => void;
}

const statusConfig: Record<ContactStatus, { label: string; color: string }> = {
  NEW: { label: 'Nova', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  READ: { label: 'Lida', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  REPLIED: { label: 'Respondida', color: 'bg-green-100 text-green-800 border-green-200' },
  CLOSED: { label: 'Fechada', color: 'bg-gray-100 text-gray-800 border-gray-200' },
};

export default function ContactDetailsModal({
  contact,
  open,
  onClose,
}: ContactDetailsModalProps) {
  if (!contact) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                Detalhes da Mensagem
              </DialogTitle>
              <DialogDescription className="mt-1">
                Recebida em {format(new Date(contact.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </DialogDescription>
            </div>
            <Badge className={statusConfig[contact.status].color} variant="outline">
              {statusConfig[contact.status].label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Informações do Contato */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              Informações de Contato
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{contact.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <a
                      href={`mailto:${contact.email}`}
                      className="font-medium text-sm text-primary hover:underline"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>
                {contact.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <a
                        href={`tel:${contact.phone}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Assunto */}
          {contact.subject && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                Assunto
              </h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="font-medium">{contact.subject}</p>
              </div>
            </div>
          )}

          {/* Mensagem */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              Mensagem
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{contact.message}</p>
            </div>
          </div>

          {/* Histórico */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              Histórico
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Recebida em</p>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <p className="font-medium text-sm">
                      {format(new Date(contact.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Última Atualização</p>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <p className="font-medium text-sm">
                      {format(new Date(contact.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              </div>
              {contact.respondedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Respondida em</p>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <p className="font-medium text-sm">
                      {format(new Date(contact.respondedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Fechar
          </Button>
          <Button asChild>
            <a href={`mailto:${contact.email}`}>
              <Mail className="h-4 w-4 mr-2" />
              Responder por Email
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
