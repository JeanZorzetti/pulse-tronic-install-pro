# 📊 Guia de Implementação - Google Analytics 4

**Tracking ID fornecido:** `G-7TET4P858V`

---

## 🎯 O que será rastreado

### Eventos Automáticos (GA4)
- Page views
- Scroll tracking
- Outbound links
- File downloads
- Video engagement

### Eventos Personalizados
- ✅ **Quote Submitted** - Quando usuário solicita orçamento
- ✅ **Contact Submitted** - Quando usuário envia mensagem
- 📱 **WhatsApp Click** - Clique no botão WhatsApp
- 📞 **Phone Click** - Clique no telefone
- 🎬 **Service View** - Visualização de página de serviço

---

## 📝 Passo 1: Adicionar Script no Frontend

### Localização do Arquivo
```
Frontend/index.html
```

### Código a Adicionar

Adicione o seguinte código **dentro da tag `<head>`**, antes do fechamento:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-7TET4P858V"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-7TET4P858V');
</script>
```

---

## 🎨 Passo 2: Implementar Tracking de Eventos

### 2.1 Criar Hook Personalizado

Crie o arquivo: `Frontend/src/hooks/useAnalytics.ts`

```typescript
import { useEffect } from 'react';

// Declare gtag global
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

export const usePageView = (path: string) => {
  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-7TET4P858V', {
        page_path: path,
      });
    }
  }, [path]);
};

export const trackEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Eventos específicos
export const trackQuoteSubmission = (data: {
  service?: string;
  vehicle?: string;
}) => {
  trackEvent('quote_submitted', {
    event_category: 'engagement',
    event_label: data.service || 'general',
    vehicle_type: data.vehicle,
  });
};

export const trackContactSubmission = (subject?: string) => {
  trackEvent('contact_submitted', {
    event_category: 'engagement',
    event_label: subject || 'general',
  });
};

export const trackWhatsAppClick = (source: string) => {
  trackEvent('whatsapp_click', {
    event_category: 'social',
    event_label: source,
  });
};

export const trackPhoneClick = (source: string) => {
  trackEvent('phone_click', {
    event_category: 'contact',
    event_label: source,
  });
};

export const trackServiceView = (serviceName: string) => {
  trackEvent('service_view', {
    event_category: 'content',
    service_name: serviceName,
  });
};
```

---

### 2.2 Implementar no Formulário de Orçamento

Localize o componente de formulário de orçamento e adicione:

```typescript
import { trackQuoteSubmission } from '@/hooks/useAnalytics';

// Dentro da função de submit, após sucesso:
const handleSubmit = async (data: FormData) => {
  try {
    const response = await api.post('/quotes', data);

    // Tracking do Google Analytics
    trackQuoteSubmission({
      service: data.serviceName,
      vehicle: data.vehicle
    });

    // Resto do código...
  } catch (error) {
    // Error handling...
  }
};
```

---

### 2.3 Implementar no Formulário de Contato

```typescript
import { trackContactSubmission } from '@/hooks/useAnalytics';

const handleSubmit = async (data: FormData) => {
  try {
    const response = await api.post('/contacts', data);

    // Tracking do Google Analytics
    trackContactSubmission(data.subject);

    // Resto do código...
  } catch (error) {
    // Error handling...
  }
};
```

---

### 2.4 Tracking de Botões WhatsApp

Em todos os botões/links de WhatsApp:

```typescript
import { trackWhatsAppClick } from '@/hooks/useAnalytics';

<Button
  onClick={() => {
    trackWhatsAppClick('hero_section'); // ou 'footer', 'contact_page', etc
    window.open('https://wa.me/5511999999999', '_blank');
  }}
>
  Falar no WhatsApp
</Button>
```

---

### 2.5 Tracking de Visualização de Serviços

Na página de detalhes do serviço:

```typescript
import { useEffect } from 'react';
import { trackServiceView } from '@/hooks/useAnalytics';

const ServiceDetailPage = ({ service }) => {
  useEffect(() => {
    trackServiceView(service.title);
  }, [service]);

  return (
    // Componente...
  );
};
```

---

### 2.6 Page View Tracking (React Router)

Se estiver usando React Router, adicione no componente principal:

```typescript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePageView } from '@/hooks/useAnalytics';

function App() {
  const location = useLocation();
  usePageView(location.pathname + location.search);

  return (
    // Resto do app...
  );
}
```

---

## 🧪 Passo 3: Testar a Implementação

### 3.1 Modo de Debug do GA4

Adicione esta extensão do Chrome:
- **Google Analytics Debugger**: https://chrome.google.com/webstore

### 3.2 Verificar Eventos em Tempo Real

1. Acesse Google Analytics: https://analytics.google.com
2. Vá em **Reports** > **Realtime**
3. Teste os formulários e veja os eventos aparecerem

### 3.3 Checklist de Testes

- [ ] Page views sendo rastreados
- [ ] Evento `quote_submitted` funciona
- [ ] Evento `contact_submitted` funciona
- [ ] Evento `whatsapp_click` funciona
- [ ] Evento `phone_click` funciona (se implementado)
- [ ] Evento `service_view` funciona
- [ ] Dados aparecem no GA4 Realtime

---

## 📈 Passo 4: Configurar Conversões no GA4

### 4.1 Marcar Eventos como Conversões

1. Acesse Google Analytics
2. Vá em **Admin** > **Events**
3. Marque como conversão:
   - ✅ `quote_submitted`
   - ✅ `contact_submitted`
   - ✅ `whatsapp_click`

### 4.2 Criar Funil de Conversão

1. Vá em **Explore** > **Funnel exploration**
2. Configure:
   - Step 1: `page_view` (home)
   - Step 2: `page_view` (serviços)
   - Step 3: `quote_submitted`

---

## 🎯 Métricas Importantes a Acompanhar

### Engajamento
- Taxa de rejeição (Bounce rate)
- Tempo médio na página
- Páginas por sessão

### Conversões
- Total de orçamentos solicitados
- Taxa de conversão (visitantes → orçamentos)
- Origem do tráfego de conversões

### Comportamento
- Serviços mais visualizados
- Páginas com maior taxa de saída
- Cliques em WhatsApp vs formulários

---

## 🔒 Privacidade e LGPD

### Cookies e Consentimento

O GA4 requer consentimento do usuário. Considere implementar:

**Opção 1: Banner simples**
- Aviso que o site usa cookies
- Botão "Aceitar"

**Opção 2: Cookie Consent Manager**
- Librarie sugerida: `react-cookie-consent`
- Permite usuário aceitar/rejeitar

**Implementação básica:**

```typescript
import CookieConsent from 'react-cookie-consent';

<CookieConsent
  location="bottom"
  buttonText="Aceitar"
  cookieName="pulse_tronic_consent"
  style={{ background: "#2B373B" }}
  buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
  expires={150}
>
  Este site usa cookies para melhorar sua experiência.
</CookieConsent>
```

---

## 📚 Recursos Adicionais

### Documentação Oficial
- [GA4 Documentation](https://support.google.com/analytics/answer/9304153)
- [gtag.js API Reference](https://developers.google.com/tag-platform/gtagjs/reference)

### Ferramentas Úteis
- [GA4 Event Builder](https://ga-dev-tools.google/ga4/event-builder/)
- [Tag Assistant](https://tagassistant.google.com/)

---

## ✅ Checklist Final

- [ ] Script GA4 adicionado no `<head>`
- [ ] Hook `useAnalytics.ts` criado
- [ ] Tracking de quote_submitted implementado
- [ ] Tracking de contact_submitted implementado
- [ ] Tracking de whatsapp_click implementado
- [ ] Page view tracking implementado
- [ ] Testes realizados no modo debug
- [ ] Eventos aparecendo no GA4 Realtime
- [ ] Conversões configuradas no GA4
- [ ] Cookie consent implementado (LGPD)

---

**🎉 Pronto!** Seu Google Analytics está configurado e rastreando todas as interações importantes do site.
