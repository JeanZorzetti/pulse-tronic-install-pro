import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { Service, ServiceCategory } from '@/types';

interface ServiceFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => void;
  service?: Service | null;
  isLoading?: boolean;
}

export interface ServiceFormData {
  title: string;
  description: string;
  category: ServiceCategory;
  estimatedTime?: number;
  isActive: boolean;
  displayOrder: number;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  items: Array<{ item: string; displayOrder: number }>;
}

const categoryOptions: Array<{ value: ServiceCategory; label: string }> = [
  { value: 'MULTIMEDIA' as ServiceCategory, label: 'Multimídia' },
  { value: 'SOUND' as ServiceCategory, label: 'Som' },
  { value: 'CAMERA' as ServiceCategory, label: 'Câmeras' },
  { value: 'SECURITY' as ServiceCategory, label: 'Segurança' },
  { value: 'ACCESSORIES' as ServiceCategory, label: 'Acessórios' },
];

export default function ServiceFormModal({
  open,
  onClose,
  onSubmit,
  service,
  isLoading,
}: ServiceFormModalProps) {
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    category: 'MULTIMEDIA' as ServiceCategory,
    estimatedTime: undefined,
    isActive: true,
    displayOrder: 0,
    slug: '',
    metaTitle: '',
    metaDescription: '',
    items: [],
  });

  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        description: service.description,
        category: service.category,
        estimatedTime: service.estimatedTime || undefined,
        isActive: service.isActive,
        displayOrder: service.displayOrder,
        slug: service.slug,
        metaTitle: service.metaTitle || '',
        metaDescription: service.metaDescription || '',
        items: service.items.map((item, index) => ({
          item: item.item,
          displayOrder: item.displayOrder || index,
        })),
      });
    } else {
      // Reset form for new service
      setFormData({
        title: '',
        description: '',
        category: 'MULTIMEDIA' as ServiceCategory,
        estimatedTime: undefined,
        isActive: true,
        displayOrder: 0,
        slug: '',
        metaTitle: '',
        metaDescription: '',
        items: [],
      });
      setNewItem('');
    }
  }, [service, open]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      setFormData((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            item: newItem.trim(),
            displayOrder: prev.items.length,
          },
        ],
      }));
      setNewItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...formData.items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newItems.length) {
      [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
      // Update displayOrder
      newItems.forEach((item, i) => {
        item.displayOrder = i;
      });
      setFormData((prev) => ({ ...prev, items: newItems }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {service ? 'Editar Serviço' : 'Novo Serviço'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informações Básicas</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium">
                  Título do Serviço <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ex: Central Multimídia Pioneer"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">
                  Descrição <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Descreva o serviço..."
                  required
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Categoria <span className="text-destructive">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value as ServiceCategory,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  required
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Tempo Estimado (minutos)</label>
                <Input
                  type="number"
                  value={formData.estimatedTime || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      estimatedTime: e.target.value ? parseInt(e.target.value) : undefined,
                    }))
                  }
                  placeholder="Ex: 60"
                  min="0"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Slug <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="Ex: central-multimidia-pioneer"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  URL amigável (gerado automaticamente do título)
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Ordem de Exibição</label>
                <Input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      displayOrder: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                }
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                Serviço Ativo
              </label>
            </div>
          </div>

          {/* Items Inclusos */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Items Inclusos</h3>

            <div className="flex gap-2">
              <Input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Ex: Integração com comandos de volante"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddItem();
                  }
                }}
              />
              <Button type="button" onClick={handleAddItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>

            {formData.items.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                {formData.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 p-2 bg-muted/50 rounded"
                  >
                    <span className="text-sm flex-1">{item.item}</span>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveItem(index, 'up')}
                        disabled={index === 0}
                        title="Mover para cima"
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveItem(index, 'down')}
                        disabled={index === formData.items.length - 1}
                        title="Mover para baixo"
                      >
                        ↓
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                        title="Remover"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {formData.items.length === 0 && (
              <div className="text-center p-4 border rounded-md border-dashed">
                <p className="text-sm text-muted-foreground">
                  Nenhum item adicionado ainda
                </p>
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">SEO (Opcional)</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Meta Título</label>
                <Input
                  value={formData.metaTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))
                  }
                  placeholder="Título para mecanismos de busca"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {(formData.metaTitle || '').length}/60 caracteres
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Meta Descrição</label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))
                  }
                  placeholder="Descrição para mecanismos de busca"
                  rows={3}
                  maxLength={160}
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {(formData.metaDescription || '').length}/160 caracteres
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : service ? 'Atualizar Serviço' : 'Criar Serviço'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
