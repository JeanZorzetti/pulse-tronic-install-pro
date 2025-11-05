import nodemailer, { Transporter } from 'nodemailer';
import { env } from '../config/env';

export class EmailService {
  private static instance: EmailService;
  private transporter: Transporter;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Verify email configuration
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Email service is ready');
      return true;
    } catch (error) {
      console.error('❌ Email service error:', error);
      return false;
    }
  }

  // Send quote confirmation to customer
  async sendQuoteConfirmation(
    customerEmail: string,
    customerName: string,
    quoteData: any
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Pulse Tronic</h1>
            <p>Instalação Profissional Automotiva</p>
          </div>
          <div class="content">
            <h2>Olá, ${customerName}!</h2>
            <p>Recebemos sua solicitação de orçamento. Nossa equipe está analisando e responderemos em breve!</p>

            <div class="info-box">
              <h3>Detalhes da Solicitação:</h3>
              <p><strong>Veículo:</strong> ${quoteData.vehicle}</p>
              <p><strong>Equipamento:</strong> ${quoteData.equipment}</p>
              ${quoteData.service ? `<p><strong>Serviço:</strong> ${quoteData.service}</p>` : ''}
            </div>

            <p>Nosso prazo de resposta é de até 24 horas úteis. Se tiver alguma dúvida, entre em contato conosco pelo WhatsApp.</p>

            <div style="text-align: center;">
              <a href="https://wa.me/${env.ADMIN_WHATSAPP?.replace(/\D/g, '')}" class="button">Falar no WhatsApp</a>
            </div>
          </div>
          <div class="footer">
            <p>Pulse Tronic - Especialistas em Instalação BYOD</p>
            <p>${env.SMTP_FROM}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: env.SMTP_FROM,
      to: customerEmail,
      subject: 'Recebemos sua solicitação de orçamento - Pulse Tronic',
      html,
    });
  }

  // Send new quote notification to admin
  async sendQuoteNotificationToAdmin(quoteData: any): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 20px; }
          .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #dc2626; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🔔 Nova Solicitação de Orçamento</h2>
          </div>
          <div class="content">
            <div class="info-box">
              <p><strong>Cliente:</strong> ${quoteData.customerName}</p>
              <p><strong>Email:</strong> ${quoteData.customerEmail || 'Não informado'}</p>
              <p><strong>Telefone:</strong> ${quoteData.customerPhone}</p>
              <p><strong>Veículo:</strong> ${quoteData.vehicle}</p>
              <p><strong>Equipamento:</strong> ${quoteData.equipment}</p>
              ${quoteData.message ? `<p><strong>Mensagem:</strong> ${quoteData.message}</p>` : ''}
            </div>
            <p><strong>Acesse o painel administrativo para responder.</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: env.SMTP_FROM,
      to: env.ADMIN_EMAIL,
      subject: `🔔 Nova Solicitação de Orçamento - ${quoteData.customerName}`,
      html,
    });
  }

  // Send contact confirmation to customer
  async sendContactConfirmation(
    customerEmail: string,
    customerName: string
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Pulse Tronic</h1>
          </div>
          <div class="content">
            <h2>Olá, ${customerName}!</h2>
            <p>Recebemos sua mensagem e responderemos o mais breve possível!</p>
            <p>Nosso prazo de resposta é de até 24 horas úteis.</p>
            <p>Obrigado por entrar em contato!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: env.SMTP_FROM,
      to: customerEmail,
      subject: 'Recebemos sua mensagem - Pulse Tronic',
      html,
    });
  }

  // Send new contact notification to admin
  async sendContactNotificationToAdmin(contactData: any): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 20px; }
          .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #059669; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>💬 Nova Mensagem de Contato</h2>
          </div>
          <div class="content">
            <div class="info-box">
              <p><strong>Nome:</strong> ${contactData.name}</p>
              <p><strong>Email:</strong> ${contactData.email || 'Não informado'}</p>
              <p><strong>Telefone:</strong> ${contactData.phone}</p>
              ${contactData.subject ? `<p><strong>Assunto:</strong> ${contactData.subject}</p>` : ''}
              <p><strong>Mensagem:</strong></p>
              <p>${contactData.message}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: env.SMTP_FROM,
      to: env.ADMIN_EMAIL,
      subject: `💬 Nova Mensagem de Contato - ${contactData.name}`,
      html,
    });
  }
}
