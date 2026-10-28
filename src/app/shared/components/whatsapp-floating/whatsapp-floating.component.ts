import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { COMPANY_CONTACT, WHATSAPP_MESSAGES, openWhatsAppDirect } from '../../../core/constants/company-contact.constant';

@Component({
  selector: 'app-whatsapp-floating',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      <!-- Mini Ventana Emergente de Chat -->
      @if (isOpen()) {
        <div class="mb-3 w-[320px] sm:w-[360px] overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          
          <!-- Header de la ventana -->
          <div class="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 text-white">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white font-black backdrop-blur-sm shadow-inner">
                  <span>RS</span>
                  <span class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-emerald-700"></span>
                </div>
                <div>
                  <h3 class="text-sm font-bold flex items-center gap-1.5 leading-none">
                    Ruedas Store
                    <svg class="h-4 w-4 text-emerald-200 fill-current" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </h3>
                  <p class="text-[11px] text-emerald-100 font-medium mt-1">
                    Administración · {{ contact.adminPhoneDisplay }}
                  </p>
                </div>
              </div>

              <button (click)="toggleOpen()" 
                      type="button"
                      class="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                      title="Cerrar ventana">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Cuerpo del chat con opciones rápidas -->
          <div class="p-4 bg-slate-50 space-y-3 max-h-[380px] overflow-y-auto">
            
            <!-- Mensaje de bienvenida -->
            <div class="flex gap-2.5 items-start">
              <div class="rounded-2xl rounded-tl-none bg-white p-3.5 shadow-xs text-xs text-slate-700 leading-relaxed border border-slate-200 max-w-[90%]">
                <p>¡Hola! 👋 Te damos la bienvenida a <strong>{{ contact.companyName }}</strong>.</p>
                <p class="mt-1">¿Deseas consultar sobre vehículos, vender tu auto o comunicarte con administración?</p>
                <span class="text-[9px] text-slate-400 mt-1.5 block text-right">Canal Oficial Verificado</span>
              </div>
            </div>

            <!-- Botón de Contacto Directo con el Administrador -->
            <button type="button" 
                    (click)="sendQuickMessage('hablar_admin')"
                    class="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white p-3 text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer">
              <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Chatear con el Administrador Directo</span>
            </button>

            <!-- Opciones Rápidas (Chips de Acción) -->
            <div class="space-y-1.5 pt-1">
              <p class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Consultas frecuentes:</p>
              
              <button type="button" 
                      (click)="sendQuickMessage('consultar_catalogo')"
                      class="w-full text-left rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 p-2.5 text-xs text-slate-700 hover:text-emerald-700 transition-all flex items-center justify-between group cursor-pointer shadow-2xs">
                <span class="flex items-center gap-2">
                  <span>🚗</span>
                  <span class="font-medium">Consultar por un vehículo</span>
                </span>
                <span class="text-slate-400 group-hover:text-emerald-600 transition-colors">→</span>
              </button>

              <button type="button" 
                      (click)="sendQuickMessage('vender_auto')"
                      class="w-full text-left rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 p-2.5 text-xs text-slate-700 hover:text-emerald-700 transition-all flex items-center justify-between group cursor-pointer shadow-2xs">
                <span class="flex items-center gap-2">
                  <span>💰</span>
                  <span class="font-semibold text-emerald-600">Vender mi vehículo usado</span>
                </span>
                <span class="text-slate-400 group-hover:text-emerald-600 transition-colors">→</span>
              </button>

              <button type="button" 
                      (click)="sendQuickMessage('taller_postventa')"
                      class="w-full text-left rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 p-2.5 text-xs text-slate-700 hover:text-emerald-700 transition-all flex items-center justify-between group cursor-pointer shadow-2xs">
                <span class="flex items-center gap-2">
                  <span>🔧</span>
                  <span class="font-medium">Servicio de Taller y Citas</span>
                </span>
                <span class="text-slate-400 group-hover:text-emerald-600 transition-colors">→</span>
              </button>
            </div>

          </div>

          <!-- Input para escribir mensaje libre -->
          <div class="p-3 bg-white border-t border-slate-150">
            <form (submit)="onCustomSubmit($event)" class="flex items-center gap-2">
              <input type="text" 
                     [(ngModel)]="customMessage" 
                     name="message" 
                     placeholder="Escribe tu mensaje al administrador..."
                     class="flex-1 rounded-xl bg-slate-100 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
              <button type="submit" 
                      class="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shrink-0"
                      title="Enviar por WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>

        </div>
      }

      <!-- Botón Flotante Principal -->
      <div class="relative flex items-center">
        <!-- Tooltip animado cuando está cerrado -->
        @if (!isOpen()) {
          <div (click)="toggleOpen()"
               class="mr-3 hidden sm:flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>WhatsApp Administrador</span>
          </div>
        }

        <!-- Botón circular de WhatsApp con pulso -->
        <button (click)="toggleOpen()" 
                [attr.aria-label]="isOpen() ? 'Cerrar chat de WhatsApp' : 'Abrir chat de WhatsApp con Administrador'"
                class="group relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none cursor-pointer">
          
          <!-- Onda de pulso sutil -->
          <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30 animate-ping"></span>

          @if (isOpen()) {
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          } @else {
            <svg class="h-7 w-7 relative z-10 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          }
        </button>
      </div>

    </div>
  `
})
export class WhatsAppFloatingComponent {
  protected readonly contact = COMPANY_CONTACT;
  protected readonly isOpen = signal(false);
  protected customMessage = '';

  protected toggleOpen(): void {
    this.isOpen.update(v => !v);
  }

  protected sendQuickMessage(type: 'consultar_catalogo' | 'vender_auto' | 'taller_postventa' | 'hablar_admin'): void {
    let msg = '';
    switch (type) {
      case 'hablar_admin':
        msg = WHATSAPP_MESSAGES.adminDirect();
        break;
      case 'consultar_catalogo':
        msg = WHATSAPP_MESSAGES.catalogInquiry();
        break;
      case 'vender_auto':
        msg = WHATSAPP_MESSAGES.sellUsedInitial();
        break;
      case 'taller_postventa':
        msg = WHATSAPP_MESSAGES.workshopInitial();
        break;
    }

    openWhatsAppDirect(msg, this.contact.adminPhone);
    this.isOpen.set(false);
  }

  protected onCustomSubmit(event: Event): void {
    event.preventDefault();
    if (this.customMessage.trim()) {
      openWhatsAppDirect(this.customMessage.trim(), this.contact.adminPhone);
      this.customMessage = '';
      this.isOpen.set(false);
    }
  }
}
