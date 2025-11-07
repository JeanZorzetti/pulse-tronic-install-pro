import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { faqService } from '@/services/faq.service';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import type { FAQ } from '@/types';

interface FAQFormModalProps {
  faq: FAQ | null;
  isOpen: boolean;
  onClose: () => void;
}

interface FAQFormData {
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
}

export function FAQFormModal({ faq, isOpen, onClose }: FAQFormModalProps) {
  const queryClient = useQueryClient();
  const isEditing = !!faq;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FAQFormData>({
    defaultValues: {
      question: '',
      answer: '',
      displayOrder: 0,
      isActive: true,
    },
  });

  const isActive = watch('isActive');

  // Reset form when modal opens/closes or FAQ changes
  useEffect(() => {
    if (isOpen) {
      if (faq) {
        reset({
          question: faq.question,
          answer: faq.answer,
          displayOrder: faq.displayOrder,
          isActive: faq.isActive,
        });
      } else {
        reset({
          question: '',
          answer: '',
          displayOrder: 0,
          isActive: true,
        });
      }
    }
  }, [isOpen, faq, reset]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: FAQFormData) => faqService.createAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success('FAQ criado com sucesso');
      onClose();
      reset();
    },
    onError: () => {
      toast.error('Erro ao criar FAQ');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: FAQFormData) =>
      faqService.updateAdmin(faq!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success('FAQ atualizado com sucesso');
      onClose();
      reset();
    },
    onError: () => {
      toast.error('Erro ao atualizar FAQ');
    },
  });

  const onSubmit = (data: FAQFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar FAQ' : 'Nova FAQ'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor="question">
              Pergunta <span className="text-red-500">*</span>
            </Label>
            <Input
              id="question"
              placeholder="Digite a pergunta frequente"
              {...register('question', {
                required: 'Pergunta é obrigatória',
              })}
              disabled={isLoading}
            />
            {errors.question && (
              <p className="text-sm text-red-500">{errors.question.message}</p>
            )}
          </div>

          {/* Answer */}
          <div className="space-y-2">
            <Label htmlFor="answer">
              Resposta <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="answer"
              placeholder="Digite a resposta detalhada"
              rows={6}
              {...register('answer', {
                required: 'Resposta é obrigatória',
              })}
              disabled={isLoading}
            />
            {errors.answer && (
              <p className="text-sm text-red-500">{errors.answer.message}</p>
            )}
          </div>

          {/* Display Order */}
          <div className="space-y-2">
            <Label htmlFor="displayOrder">Ordem de Exibição</Label>
            <Input
              id="displayOrder"
              type="number"
              min="0"
              {...register('displayOrder', {
                valueAsNumber: true,
              })}
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              FAQs com ordem menor aparecem primeiro
            </p>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Status Ativo</Label>
              <p className="text-sm text-muted-foreground">
                FAQs ativos são exibidos no site público
              </p>
            </div>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setValue('isActive', checked)}
              disabled={isLoading}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Salvando...'
                : isEditing
                  ? 'Salvar Alterações'
                  : 'Criar FAQ'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
