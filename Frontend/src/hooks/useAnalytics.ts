/**
 * Google Analytics 4 Custom Hook
 *
 * Tracking ID: G-7TET4P858V
 *
 * Custom Events:
 * - quote_submitted: Quando um orçamento é solicitado
 * - contact_submitted: Quando o formulário de contato é enviado
 * - whatsapp_click: Quando o botão WhatsApp é clicado
 * - phone_click: Quando o botão de telefone é clicado
 * - service_view: Quando um serviço específico é visualizado
 */

// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

/**
 * Track a custom event in Google Analytics
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
    console.log('[GA4] Event tracked:', eventName, eventParams);
  } else {
    console.warn('[GA4] gtag not available');
  }
};

/**
 * Track page views (call this on route changes)
 */
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-7TET4P858V', {
      page_path: url,
      page_title: title,
    });
    console.log('[GA4] Page view tracked:', url);
  }
};

/**
 * Track when a quote is submitted
 */
export const trackQuoteSubmission = (data: {
  service?: string;
  vehicle?: string;
  customerName?: string;
}) => {
  trackEvent('quote_submitted', {
    event_category: 'engagement',
    event_label: data.service || 'general',
    vehicle_type: data.vehicle,
    customer_name: data.customerName,
  });
};

/**
 * Track when contact form is submitted
 */
export const trackContactSubmission = (subject?: string) => {
  trackEvent('contact_submitted', {
    event_category: 'engagement',
    event_label: subject || 'general',
  });
};

/**
 * Track when WhatsApp button is clicked
 */
export const trackWhatsAppClick = (source: string) => {
  trackEvent('whatsapp_click', {
    event_category: 'social',
    event_label: source, // 'header', 'footer', 'cta', etc
  });
};

/**
 * Track when phone button is clicked
 */
export const trackPhoneClick = (source: string) => {
  trackEvent('phone_click', {
    event_category: 'contact',
    event_label: source,
  });
};

/**
 * Track when a service is viewed
 */
export const trackServiceView = (serviceName: string) => {
  trackEvent('service_view', {
    event_category: 'content',
    event_label: serviceName,
  });
};

/**
 * Custom hook for analytics
 */
export const useAnalytics = () => {
  return {
    trackEvent,
    trackPageView,
    trackQuoteSubmission,
    trackContactSubmission,
    trackWhatsAppClick,
    trackPhoneClick,
    trackServiceView,
  };
};

export default useAnalytics;
