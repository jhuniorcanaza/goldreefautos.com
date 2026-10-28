import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuoteService } from '../../core/services/quote.service';
import { COMPANY_CONTACT, COMPANY_ADVISORS, CompanyAdvisor, WHATSAPP_MESSAGES, buildWhatsAppUrl } from '../../core/constants/company-contact.constant';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 fade-in">
      
      <!-- Header -->
      <div class="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Atención Personalizada
          </span>
        </div>
        <h1 class="mt-3 font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Contacto y Sucursal
        </h1>
        <p class="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl">
          Visítanos en nuestra sede de Cumbayá o comunícate de manera directa con nuestros Asesores Comerciales oficiales por WhatsApp.
        </p>
      </div>

      <!-- Asesores Comerciales Destacados (Tarjetas Ejecutivas) -->
      <div class="mt-10">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="font-heading text-xl font-bold text-slate-900 dark:text-white">
              Asesores Comerciales Oficiales
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Trato directo, transparente y sin intermediarios vía WhatsApp Business
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          @for (adv of advisors; track adv.id) {
            <div class="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm hover:shadow-md transition-all group">
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                  <!-- Avatar Icon / Badge -->
                  <div class="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-slate-900 flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0 ring-2 ring-blue-500/30">
                    <span>{{ getInitials(adv.name) }}</span>
                    <span class="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" title="Activo en WhatsApp">
                      <span class="h-1.5 w-1.5 rounded-full bg-white"></span>
                    </span>
                  </div>

                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="font-heading text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {{ adv.name }}
                      </h3>
                      <span class="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 ring-1 ring-inset ring-emerald-600/20">
                        {{ adv.badge || 'Cuenta de Empresa' }}
                      </span>
                    </div>
                    <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      {{ adv.role }}
                    </p>
                    <p class="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                      {{ adv.phoneDisplay }}
                    </p>
                  </div>
                </div>

                <!-- Botón de Contacto WhatsApp -->
                <a [href]="adv.waUrl" target="_blank"
                   class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer">
                  <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>Chatear por WhatsApp</span>
                </a>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Main Layout: Sucursal + Formulario -->
      <div class="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
        
        <!-- Column 1: Info Sucursal & Mapa (5/12 cols) -->
        <div class="lg:col-span-5 space-y-6">
          <h2 class="font-heading text-xl font-bold text-slate-900 dark:text-white">
            Ubicación de Casa Matriz
          </h2>
          
          <!-- Branch Card -->
          <div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm space-y-4">
            <div class="flex items-center gap-2">
              <span class="inline-flex h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse"></span>
              <h3 class="font-heading text-base font-bold text-slate-900 dark:text-white">
                Goldreef Autos — Casa Matriz
              </h3>
            </div>
            
            <ul class="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <li class="flex items-start gap-3">
                <div class="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div>
                  <span class="block font-semibold text-slate-900 dark:text-white">{{ contact.address }}</span>
                  <span class="block text-xs text-slate-500">{{ contact.city }}, {{ contact.country }}</span>
                </div>
              </li>

              <li class="flex items-start gap-3">
                <div class="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div>
                  <div class="font-semibold text-slate-800 dark:text-slate-200">
                    Líneas Directas de WhatsApp:
                  </div>
                  <div class="text-xs text-slate-500 space-y-0.5 mt-1">
                    @for (adv of advisors; track adv.id) {
                      <div>{{ adv.name }}: <strong class="text-slate-700 dark:text-slate-300">{{ adv.phoneDisplay }}</strong></div>
                    }
                  </div>
                </div>
              </li>

              <li class="flex items-start gap-3">
                <div class="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8m-2 11a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h12a2 2 0 012 2v11z"/>
                  </svg>
                </div>
                <span class="self-center">{{ contact.adminEmail }}</span>
              </li>

              <li class="flex items-start gap-3">
                <div class="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <span class="block"><strong class="text-slate-800 dark:text-slate-200">Lunes a Viernes:</strong> 9:00 AM - 7:30 PM</span>
                  <span class="block"><strong class="text-slate-800 dark:text-slate-200">Sábado:</strong> 10:00 AM - 2:00 PM</span>
                  <span class="block text-slate-400 text-xs">Domingos y Feriados cerrado</span>
                </div>
              </li>
            </ul>

            <!-- Google Maps link -->
            <div class="pt-2">
              <a href="https://maps.google.com/?q=Av+Oswaldo+Guayasamín+y+Florencia+Cumbaya" target="_blank"
                 class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                Abrir en Google Maps
              </a>
            </div>
          </div>

          <!-- Interactive Iframe Map (Cumbayá, Quito, Ecuador - Av. Oswaldo Guayasamín) -->
          <div class="h-72 w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative">
            <iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" 
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-78.4450%2C-0.2100%2C-78.4250%2C-0.1980&amp;layer=mapnik&amp;marker=-0.2036%2C-78.4348"
                    style="border: 0;"></iframe>
          </div>
        </div>

        <!-- Column 2: Form (7/12 cols) -->
        <div class="lg:col-span-7 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h2 class="font-heading text-xl font-bold text-slate-900 dark:text-white mb-2">
            Envíanos un Mensaje
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Completa nuestro formulario de contacto formal y un asesor comercial especializado te contactará en un plazo máximo de 24 horas hábiles.
          </p>
          
          @if (formEnviado()) {
            <div class="rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-6 text-emerald-800 dark:text-emerald-200 flex gap-3.5 fade-in">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="font-heading font-bold text-base text-slate-900 dark:text-white">¡Mensaje Recibido!</h3>
                <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">Hemos registrado tu consulta con éxito. Un asesor de Goldreef Autos te contactará a la brevedad.</p>
                <button (click)="resetForm()" class="mt-4 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  Enviar otro mensaje
                </button>
              </div>
            </div>
          } @else {
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-5">
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Nombre Completo *</label>
                  <input type="text" formControlName="nombre" 
                         class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
                         [class.border-red-400]="isFieldInvalid('nombre')" placeholder="Ej. Carlos Mendoza" />
                  @if (isFieldInvalid('nombre')) {
                    <span class="text-[10px] text-red-500 mt-1 block">El nombre es requerido.</span>
                  }
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Email *</label>
                  <input type="email" formControlName="email" 
                         class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
                         [class.border-red-400]="isFieldInvalid('email')" placeholder="correo@ejemplo.com" />
                  @if (isFieldInvalid('email')) {
                    <span class="text-[10px] text-red-500 mt-1 block">Ingresa un correo electrónico válido.</span>
                  }
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">WhatsApp / Teléfono *</label>
                  <input type="tel" formControlName="telefono" 
                         class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
                         [class.border-red-400]="isFieldInvalid('telefono')" placeholder="Ej. +593 99 999 9999" />
                  @if (isFieldInvalid('telefono')) {
                    <span class="text-[10px] text-red-500 mt-1 block">El teléfono es requerido.</span>
                  }
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Asunto de Consulta</label>
                  <select formControlName="asunto" 
                          class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none">
                    <option value="ventas">Cotización y Compra de Vehículo</option>
                    <option value="tasacion">Vender mi Auto / Tasación</option>
                    <option value="financiamiento">Opciones de Financiamiento</option>
                    <option value="servicio">Taller & Repuestos (BenziMotor)</option>
                    <option value="otro">Otro Asunto</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Mensaje detallado *</label>
                <textarea formControlName="mensaje" rows="4" 
                          class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
                          [class.border-red-400]="isFieldInvalid('mensaje')"
                          placeholder="Describe el vehículo de tu interés o tu consulta detallada..."></textarea>
                @if (isFieldInvalid('mensaje')) {
                  <span class="text-[10px] text-red-500 mt-1 block">El mensaje es requerido y debe tener al menos 15 caracteres.</span>
                }
              </div>

              <button type="submit" [disabled]="contactForm.invalid"
                      class="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-500 disabled:opacity-50 transition-colors cursor-pointer">
                Enviar Formulario de Contacto
              </button>
            </form>
          }
        </div>

      </div>

    </div>
  `
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly quoteService = inject(QuoteService);
  
  protected readonly contact = COMPANY_CONTACT;
  protected readonly advisors = COMPANY_ADVISORS;
  protected readonly contactForm: FormGroup;
  protected readonly formEnviado = signal(false);

  constructor() {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      asunto: ['ventas', [Validators.required]],
      mensaje: ['', [Validators.required, Validators.minLength(15)]]
    });
  }

  protected getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  protected async onSubmit(): Promise<void> {
    if (this.contactForm.valid) {
      const success = await this.quoteService.submitQuote({
        nombre: this.contactForm.value.nombre,
        email: this.contactForm.value.email,
        telefono: this.contactForm.value.telefono,
        mensaje: `[Asunto: ${this.contactForm.value.asunto}] ${this.contactForm.value.mensaje}`
      });
      if (success) {
        this.formEnviado.set(true);
      }
    }
  }

  protected resetForm(): void {
    this.contactForm.reset({ asunto: 'ventas' });
    this.formEnviado.set(false);
  }

  protected isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
}
