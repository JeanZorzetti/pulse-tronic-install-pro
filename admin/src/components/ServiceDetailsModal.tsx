import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { ServiceCategory, type Service } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X, Clock, List, Tag, Globe, FileText } from 'lucide-react';
import { Button } from './ui/button';

interface ServiceDetailsModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

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

export function ServiceDetailsModal({ service, isOpen, onClose }: ServiceDetailsModalProps) {
  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-2xl font-bold pr-8">{service.title}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Category Section */}
          <div className="flex gap-3">
            <Badge
              variant={service.isActive ? 'default' : 'secondary'}
              className={service.isActive ? 'bg-green-100 text-green-800 border-green-200' : ''}
            >
              {service.isActive ? 'Ativo' : 'Inativo'}
            </Badge>
            <Badge variant="outline" className={categoryColors[service.category]}>
              <Tag className="h-3 w-3 mr-1" />
              {categoryLabels[service.category]}
            </Badge>
            {service.estimatedTime && (
              <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                <Clock className="h-3 w-3 mr-1" />
                {service.estimatedTime} min
              </Badge>
            )}
          </div>

          {/* Basic Information Section */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informações Básicas
            </h3>
            <div className="grid gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Descrição</p>
                <p className="text-base whitespace-pre-wrap">{service.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Slug (URL)</p>
                  <code className="text-sm bg-muted px-2 py-1 rounded">{service.slug}</code>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ordem de Exibição</p>
                  <p className="text-base font-medium">{service.displayOrder}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Items Section */}
          {service.items && service.items.length > 0 && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <List className="h-5 w-5" />
                Itens Inclusos ({service.items.length})
              </h3>
              <ul className="space-y-2">
                {service.items
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((item, index) => (
                    <li key={item.id} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {index + 1}
                      </span>
                      <span className="flex-1 pt-0.5">{item.item}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* SEO Information Section */}
          {(service.metaTitle || service.metaDescription) && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Globe className="h-5 w-5" />
                SEO (Otimização para Motores de Busca)
              </h3>
              <div className="grid gap-4">
                {service.metaTitle && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Meta Title</p>
                    <p className="text-base">{service.metaTitle}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {service.metaTitle.length} caracteres
                    </p>
                  </div>
                )}
                {service.metaDescription && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Meta Description</p>
                    <p className="text-base">{service.metaDescription}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {service.metaDescription.length} caracteres
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Statistics Section */}
          {service._count && (
            <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-sm text-blue-900">Estatísticas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-700 mb-1">Orçamentos Associados</p>
                  <p className="text-2xl font-bold text-blue-900">{service._count.quotes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Metadata Section */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm text-muted-foreground">
            <div>
              <p className="mb-1">Criado</p>
              <p className="font-medium text-foreground">
                {formatDistanceToNow(new Date(service.createdAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </p>
            </div>
            <div>
              <p className="mb-1">Última Atualização</p>
              <p className="font-medium text-foreground">
                {formatDistanceToNow(new Date(service.updatedAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
