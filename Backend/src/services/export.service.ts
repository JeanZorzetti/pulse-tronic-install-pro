import { createObjectCsvWriter } from 'csv-writer';
import PDFDocument from 'pdfkit';
import { Response } from 'express';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import path from 'path';
import fs from 'fs';

interface QuoteExport {
  id: string;
  customer: {
    name: string;
    email: string | null;
    phone: string;
  };
  service: {
    title: string;
  };
  status: string;
  equipment?: string;
  vehicle?: string;
  issueDescription?: string;
  preferredDate?: Date;
  preferredTime?: string;
  estimatedValue?: number;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ExportService {
  /**
   * Export quotes to CSV
   */
  static async exportQuotesToCSV(quotes: QuoteExport[], res: Response): Promise<void> {
    try {
      // Create temp directory if it doesn't exist
      const tempDir = path.join(__dirname, '../../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `orcamentos_${timestamp}.csv`;
      const filepath = path.join(tempDir, filename);

      const csvWriter = createObjectCsvWriter({
        path: filepath,
        header: [
          { id: 'id', title: 'ID' },
          { id: 'customerName', title: 'Cliente' },
          { id: 'customerEmail', title: 'Email' },
          { id: 'customerPhone', title: 'Telefone' },
          { id: 'service', title: 'Serviço' },
          { id: 'status', title: 'Status' },
          { id: 'equipment', title: 'Equipamento' },
          { id: 'vehicle', title: 'Veículo' },
          { id: 'issueDescription', title: 'Descrição do Problema' },
          { id: 'preferredDate', title: 'Data Preferencial' },
          { id: 'preferredTime', title: 'Horário Preferencial' },
          { id: 'estimatedValue', title: 'Valor Estimado' },
          { id: 'adminNotes', title: 'Observações Admin' },
          { id: 'createdAt', title: 'Criado Em' },
          { id: 'updatedAt', title: 'Atualizado Em' },
        ],
      });

      // Transform quotes data
      const records = quotes.map((quote) => ({
        id: quote.id,
        customerName: quote.customer.name,
        customerEmail: quote.customer.email || '-',
        customerPhone: quote.customer.phone,
        service: quote.service.title,
        status: this.translateStatus(quote.status),
        equipment: quote.equipment || '-',
        vehicle: quote.vehicle || '-',
        issueDescription: quote.issueDescription || '-',
        preferredDate: quote.preferredDate
          ? format(new Date(quote.preferredDate), 'dd/MM/yyyy', { locale: ptBR })
          : '-',
        preferredTime: quote.preferredTime || '-',
        estimatedValue: quote.estimatedValue
          ? `R$ ${quote.estimatedValue.toFixed(2)}`
          : '-',
        adminNotes: quote.adminNotes || '-',
        createdAt: format(new Date(quote.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
        updatedAt: format(new Date(quote.updatedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
      }));

      await csvWriter.writeRecords(records);

      // Send file
      res.download(filepath, filename, (err) => {
        // Delete temp file after download
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        if (err) {
          throw err;
        }
      });
    } catch (error) {
      throw new Error(`Erro ao exportar CSV: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Export quotes to PDF
   */
  static async exportQuotesToPDF(quotes: QuoteExport[], res: Response): Promise<void> {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `orcamentos_${timestamp}.pdf`;

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      // Pipe PDF to response
      doc.pipe(res);

      // Header
      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('Relatório de Orçamentos', { align: 'center' });

      doc.moveDown(0.5);
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(
          `Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`,
          { align: 'center' }
        );

      doc.moveDown(0.5);
      doc
        .fontSize(10)
        .text(`Total de Orçamentos: ${quotes.length}`, { align: 'center' });

      doc.moveDown(2);

      // Quotes
      quotes.forEach((quote, index) => {
        if (index > 0) {
          doc.addPage();
        }

        // Quote Header
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text(`Orçamento #${quote.id.substring(0, 8)}`, { underline: true });

        doc.moveDown(1);

        // Customer Info
        doc.fontSize(12).font('Helvetica-Bold').text('Cliente:', { continued: false });
        doc.fontSize(10).font('Helvetica').text(`Nome: ${quote.customer.name}`);
        doc.text(`Email: ${quote.customer.email}`);
        doc.text(`Telefone: ${quote.customer.phone}`);

        doc.moveDown(1);

        // Service Info
        doc.fontSize(12).font('Helvetica-Bold').text('Serviço:', { continued: false });
        doc.fontSize(10).font('Helvetica').text(`${quote.service.title}`);
        doc.text(`Status: ${this.translateStatus(quote.status)}`);

        doc.moveDown(1);

        // Details
        doc.fontSize(12).font('Helvetica-Bold').text('Detalhes:', { continued: false });
        if (quote.equipment) {
          doc.fontSize(10).font('Helvetica').text(`Equipamento: ${quote.equipment}`);
        }
        if (quote.vehicle) {
          doc.text(`Veículo: ${quote.vehicle}`);
        }
        if (quote.issueDescription) {
          doc.text(`Problema: ${quote.issueDescription}`, {
            width: 500,
            align: 'justify',
          });
        }

        doc.moveDown(1);

        // Scheduling
        if (quote.preferredDate || quote.preferredTime) {
          doc.fontSize(12).font('Helvetica-Bold').text('Agendamento:', { continued: false });
          if (quote.preferredDate) {
            doc
              .fontSize(10)
              .font('Helvetica')
              .text(
                `Data: ${format(new Date(quote.preferredDate), 'dd/MM/yyyy', { locale: ptBR })}`
              );
          }
          if (quote.preferredTime) {
            doc.text(`Horário: ${quote.preferredTime}`);
          }
          doc.moveDown(1);
        }

        // Value
        if (quote.estimatedValue) {
          doc
            .fontSize(12)
            .font('Helvetica-Bold')
            .text(`Valor Estimado: R$ ${quote.estimatedValue.toFixed(2)}`);
          doc.moveDown(1);
        }

        // Admin Notes
        if (quote.adminNotes) {
          doc.fontSize(12).font('Helvetica-Bold').text('Observações:', { continued: false });
          doc.fontSize(10).font('Helvetica').text(quote.adminNotes, {
            width: 500,
            align: 'justify',
          });
          doc.moveDown(1);
        }

        // Timestamps
        doc.fontSize(8).font('Helvetica').fillColor('#666666');
        doc.text(
          `Criado: ${format(new Date(quote.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`
        );
        doc.text(
          `Atualizado: ${format(new Date(quote.updatedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`
        );
        doc.fillColor('#000000');
      });

      // Footer on last page
      doc.fontSize(8).text('Pulse Tronic Install Pro - Sistema de Gerenciamento', {
        align: 'center',
      });

      doc.end();
    } catch (error) {
      throw new Error(`Erro ao exportar PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Translate status to Portuguese
   */
  private static translateStatus(status: string): string {
    const statusMap: Record<string, string> = {
      PENDING: 'Pendente',
      CONTACTED: 'Contatado',
      IN_PROGRESS: 'Em Andamento',
      COMPLETED: 'Concluído',
      CANCELLED: 'Cancelado',
    };
    return statusMap[status] || status;
  }
}
