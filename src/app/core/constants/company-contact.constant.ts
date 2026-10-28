/**
 * Configuración centralizada de contactos, canales de WhatsApp y datos institucionales de Goldreef Autos.
 * Cualquier cambio en números de teléfono, asesores o mensajes predeterminados debe gestionarse aquí.
 */

export interface CompanyAdvisor {
  id: string;
  name: string;
  role: string;
  phone: string;
  phoneDisplay: string;
  waUrl: string;
  badge?: string;
  avatarUrl?: string;
}

export const COMPANY_ADVISORS: CompanyAdvisor[] = [
  {
    id: 'andres-acosta',
    name: 'Andrés Acosta',
    role: 'Asesor Comercial & Ventas',
    phone: '593986847543',
    phoneDisplay: '+593 986847543',
    waUrl: 'https://wa.me/593986847543',
    badge: 'Cuenta de Empresa',
    avatarUrl: '/assets/advisors/andres-acosta.png'
  },
  {
    id: 'jonathan-alvarez',
    name: 'Jonathan Alvarez',
    role: 'Asesor Comercial & Ventas',
    phone: '593995828197',
    phoneDisplay: '+593 995828197',
    waUrl: 'https://wa.me/593995828197',
    badge: 'Cuenta de Empresa',
    avatarUrl: '/assets/advisors/jonathan-alvarez.png'
  }
];

export const COMPANY_CONTACT = {
  // Teléfono oficial del Asesor Comercial Andrés Acosta (para wa.me/...)
  adminPhone: '593986847543',
  adminPhoneDisplay: '+593 986847543',

  // Teléfono oficial del Asesor Comercial Jonathan Alvarez
  supportPhone: '593995828197',
  supportPhoneDisplay: '+593 995828197',

  // Asesores oficiales de venta
  advisors: COMPANY_ADVISORS,

  // Correo institucional
  adminEmail: 'contacto@goldreefautos.com',

  // Nombre comercial e institucional
  companyName: 'Goldreef Autos',
  legalName: 'Goldreef Autos S.A.',
  website: 'https://goldreefautos.com',
  domain: 'goldreefautos.com',

  // Dirección física de Casa Matriz
  address: 'Av. Oswaldo Guayasamín y Florencia, Cumbayá, Junto a Maresa',
  city: 'Cumbayá, Quito',
  country: 'Ecuador',
  fullAddress: 'Av. Oswaldo Guayasamín y Florencia, Cumbayá, Junto a Maresa, Quito, Ecuador',

  // Empresa desarrolladora del software
  developer: {
    name: '365 SOFT',
    text: 'Desarrollado por 365 SOFT',
    website: 'https://365soft.com'
  },

  // Horarios de atención
  hours: {
    weekdays: 'Lun - Vie: 9:00 - 19:30',
    saturday: 'Sáb: 10:00 - 14:00',
    sunday: 'Cerrado'
  }
} as const;

/**
 * Limpia y normaliza un número telefónico extrayendo solo dígitos.
 * Si no se proporciona ninguno, retorna el teléfono oficial del Administrador.
 */
export function cleanPhoneNumber(phone?: string | null): string {
  if (!phone) return COMPANY_CONTACT.adminPhone;
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 8 ? cleaned : COMPANY_CONTACT.adminPhone;
}

/**
 * Genera una URL válida para la API de WhatsApp Web / App
 */
export function buildWhatsAppUrl(text: string, phone: string = COMPANY_CONTACT.adminPhone): string {
  const targetPhone = cleanPhoneNumber(phone);
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Abre directamente una conversación de WhatsApp en una pestaña nueva
 */
export function openWhatsAppDirect(text: string, phone: string = COMPANY_CONTACT.adminPhone): void {
  const url = buildWhatsAppUrl(text, phone);
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Plantillas de mensajes estructurados para WhatsApp
 */
export const WHATSAPP_MESSAGES = {
  /**
   * Consulta directa al Administrador General
   */
  adminDirect: (): string => {
    return 'Hola Goldreef Autos 👋, deseo ponerme en contacto directo con un asesor para realizar una consulta.';
  },

  /**
   * Consulta general de catálogo
   */
  catalogInquiry: (): string => {
    return 'Hola Goldreef Autos 👋, estoy revisando el catálogo web y deseo consultar sobre la disponibilidad, precio y opciones de financiamiento de sus vehículos.';
  },

  /**
   * Consulta sobre un vehículo en particular
   */
  vehicleInquiry: (vehicleName: string, price: number | string, currency: string = 'USD'): string => {
    return `Hola Goldreef Autos 👋, estoy interesado en el vehículo *${vehicleName}* publicado a *${price} ${currency}*. ¿Podrían confirmarme su disponibilidad y condiciones de entrega?`;
  },

  /**
   * Venta / Consignación de vehículo usado (enlace inicial)
   */
  sellUsedInitial: (): string => {
    return 'Hola Goldreef Autos 👋, deseo vender mi vehículo usado con ustedes mediante compra directa o consignación. ¿Me podrían indicar los pasos para la tasación e inspección técnica?';
  },

  /**
   * Formulario de tasación rápida de vehículo usado
   */
  sellUsedQuick: (data: { vehicle?: string; year?: string | number; km?: string; phone?: string }): string => {
    return [
      '🚗 *SOLICITUD DE TASACIÓN RÁPIDA DE VEHÍCULO USADO*',
      `📋 *Vehículo:* ${data.vehicle || 'No indicado'}`,
      `📅 *Año:* ${data.year || 'No indicado'}`,
      `🛣️ *Kilometraje:* ${data.km || 'No indicado'}`,
      `📱 *WhatsApp de contacto:* ${data.phone || 'No indicado'}`
    ].join('\n');
  },

  /**
   * Ficha completa de tasación de vehículo usado
   */
  sellUsedFull: (data: {
    name?: string;
    phone?: string;
    vehicle?: string;
    year?: string | number;
    km?: string;
    price?: string;
    notes?: string;
  }): string => {
    return [
      '🤝 *FICHA DE TASACIÓN / VENTA DE VEHÍCULO USADO*',
      `👤 *Propietario:* ${data.name || 'No indicado'}`,
      `📱 *WhatsApp / Teléfono:* ${data.phone || 'No indicado'}`,
      `🚗 *Vehículo:* ${data.vehicle || 'No indicado'}`,
      `📅 *Año:* ${data.year || 'No indicado'}`,
      `🛣️ *Kilometraje:* ${data.km || 'No indicado'}`,
      data.price ? `💵 *Precio pretendido:* ${data.price}` : '',
      data.notes ? `📝 *Detalles adicionales:* ${data.notes}` : ''
    ].filter(Boolean).join('\n');
  },

  /**
   * Consulta inicial de Taller y Venta de Repuestos (BenziMotor)
   */
  workshopInitial: (): string => {
    return 'Hola BenziMotor 🔧, deseo realizar una consulta sobre el Taller Especializado y la Venta de Repuestos para mi vehículo.';
  },

  /**
   * Solicitud de cita de taller o cotización de repuestos (BenziMotor)
   */
  workshopAppointment: (data: {
    name?: string;
    phone?: string;
    vehicle?: string;
    service?: string;
    date?: string;
    notes?: string;
  }): string => {
    return [
      '🔧 *SOLICITUD A BENZIMOTOR — TALLER Y REPUESTOS*',
      `👤 *Cliente:* ${data.name || 'No indicado'}`,
      `📱 *Teléfono / WhatsApp:* ${data.phone || 'No indicado'}`,
      `🚗 *Vehículo:* ${data.vehicle || 'No indicado'}`,
      `⚙️ *Requerimiento / Repuesto:* ${data.service || 'Cotización de Repuestos'}`,
      data.date ? `📅 *Fecha tentativa:* ${data.date}` : '',
      data.notes ? `📝 *Detalles de la pieza / falla:* ${data.notes}` : ''
    ].filter(Boolean).join('\n');
  }
};
