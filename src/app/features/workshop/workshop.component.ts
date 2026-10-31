import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { COMPANY_CONTACT, WHATSAPP_MESSAGES, openWhatsAppDirect, buildWhatsAppUrl } from '../../core/constants/company-contact.constant';

@Component({
  selector: 'app-workshop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      
      <!-- Hero Header -->
      <section class="relative overflow-hidden bg-slate-950 py-16 sm:py-24 text-white border-b border-slate-800/80">
        <!-- Background Ambient Glow & Graphic -->
        <div class="absolute inset-0 z-0">
          <img src="/categories/taller-postventa.jpg" 
               alt="BenziMotor Taller y Repuestos" 
               class="h-full w-full object-cover opacity-50 sm:opacity-55 transition-opacity" />
          <div class="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/40"></div>
          <div class="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950/85"></div>
          <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none"></div>
        </div>

        <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="max-w-3xl">
            <!-- Badge -->
            <div class="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <span class="inline-block h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
              BenziMotor · Taller Oficial & Venta de Repuestos
            </div>

            <!-- Title -->
            <h1 class="mt-5 font-heading text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
              BenziMotor
              <span class="block text-2xl sm:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 mt-2">
                Venta de Repuestos & Taller Automotriz Especializado
              </span>
            </h1>

            <!-- Description -->
            <p class="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Provisión directa de repuestos originales y alternativos para todo tipo de vehículos, junto con servicio de taller mecánico, diagnóstico computarizado y mantenimiento preventivo con garantía técnica.
            </p>

            <!-- Actions -->
            <div class="mt-8 flex flex-wrap gap-3.5">
              <button type="button"
                      (click)="scrollToFormSection('repuestos')"
                      class="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Cotizar Repuestos o Agendar Cita
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              <button type="button"
                      (click)="scrollToFormSection('cita')"
                      class="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 px-5 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Agendar Turno de Taller
              </button>

              <a [href]="getWhatsAppDirectLink()" target="_blank" rel="noopener noreferrer"
                 class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                Consultar vía WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Trust & Capabilities Strip (Interactive Cards) -->
      <section class="border-b border-slate-800/80 bg-slate-900/90 py-8 transition-colors">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <button type="button" (click)="scrollToFormSection('repuestos')" class="p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group">
              <div class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 mb-2 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <p class="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-400 transition-colors">Repuestos Garantizados</p>
              <p class="mt-1 text-xs text-slate-400">Originales y de primer nivel</p>
            </button>

            <button type="button" (click)="scrollToFormSection('repuestos')" class="p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group">
              <div class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 mb-2 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p class="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-400 transition-colors">Garantía BenziMotor</p>
              <p class="mt-1 text-xs text-slate-400">Respaldo técnico comprobado</p>
            </button>

            <button type="button" (click)="scrollToFormSection('repuestos')" class="p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group">
              <div class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 mb-2 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-400 transition-colors">Respuesta Rápida</p>
              <p class="mt-1 text-xs text-slate-400">Cotizaciones en tiempo récord</p>
            </button>

            <button type="button" (click)="scrollToFormSection('cita')" class="p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group">
              <div class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 mb-2 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
              </div>
              <p class="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-400 transition-colors">Taller Multimarca</p>
              <p class="mt-1 text-xs text-slate-400">Mantenimiento e instalación</p>
            </button>
          </div>
        </div>
      </section>

      <!-- Appointment & Spare Parts Quote Form Section -->
      <section id="formulario-taller" class="py-16 sm:py-24 scroll-mt-20">
        <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- Left Info Panel (4 cols) -->
            <div class="lg:col-span-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
              <div class="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20 uppercase tracking-wider">
                Atención BenziMotor
              </div>
              <h3 class="mt-3 font-heading text-2xl font-bold text-slate-900 dark:text-white">
                ¿Necesitas repuestos o cita técnica?
              </h3>
              <p class="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Selecciona si deseas cotizar un repuesto específico o agendar una cita en taller y recibe atención prioritaria.
              </p>

              <div class="mt-6 space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Atención WhatsApp</p>
                    <p class="text-sm font-semibold text-slate-800 dark:text-white">{{ contact.adminPhoneDisplay }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Horarios de Taller</p>
                    <p class="text-xs text-slate-700 dark:text-slate-300">{{ contact.hours.weekdays }}</p>
                    <p class="text-xs text-slate-700 dark:text-slate-300">{{ contact.hours.saturday }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ubicación</p>
                    <p class="text-xs text-slate-700 dark:text-slate-300">{{ contact.address }}</p>
                  </div>
                </div>
              </div>

              <div class="mt-8 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 p-4">
                <p class="text-xs font-semibold text-amber-900 dark:text-amber-200">
                  💡 ¿Tienes el código o foto del repuesto?
                </p>
                <p class="mt-1 text-[11px] text-amber-800/80 dark:text-amber-300/80">
                  Al enviar esta ficha se abrirá nuestro chat oficial con todos tus datos listos para que puedas adjuntar fotos de la pieza o matrícula.
                </p>
              </div>
            </div>

            <!-- Right Form (8 cols) -->
            <div id="workshop-form-card"
                 class="lg:col-span-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-xl transition-all duration-500"
                 [class.ring-4]="isFormHighlighted()"
                 [class.ring-amber-500/60]="isFormHighlighted()">
              
              <!-- Mode Selector Tabs (Repuestos vs Cita Taller) -->
              <div class="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 mb-6">
                <button type="button"
                        (click)="setActiveTab('repuestos')"
                        class="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer"
                        [class]="activeTab() === 'repuestos'
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Cotizar Repuestos
                </button>

                <button type="button"
                        (click)="setActiveTab('cita')"
                        class="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer"
                        [class]="activeTab() === 'cita'
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Agendar Cita en Taller
                </button>
              </div>

              <div>
                <span class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                      [class]="activeTab() === 'repuestos'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20'">
                  {{ activeTab() === 'repuestos' ? 'Provisión de Piezas & Componentes' : 'Servicio Técnico Especializado' }}
                </span>
                <h2 class="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {{ activeTab() === 'repuestos' ? 'Solicita Cotización de Repuestos' : 'Agenda tu Ingreso a Taller' }}
                </h2>
                <p class="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {{ activeTab() === 'repuestos'
                    ? 'Indícanos los datos de tu vehículo y el repuesto que buscas para enviarte disponibilidad y precio.'
                    : 'Coordina día y horario para diagnóstico computarizado, mantenimiento preventivo o reparación.' }}
                </p>
              </div>

              @if (submittedSuccess()) {
                <div class="mt-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-4 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white shrink-0 font-bold">✓</span>
                    <div>
                      <p class="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-200">¡Solicitud preparada con éxito!</p>
                      <p class="text-[11px] text-emerald-700 dark:text-emerald-400">Se abrió el canal oficial de WhatsApp de BenziMotor con los detalles de tu solicitud.</p>
                    </div>
                  </div>
                </div>
              }

              <form (submit)="onScheduleSubmit($event)" class="mt-6 space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Tu Nombre Completo *</label>
                    <input id="workshop-name-input" type="text" [(ngModel)]="bookingName" name="name" required placeholder="Ej. Carlos Mendoza"
                           class="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-amber-500 transition-colors" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">WhatsApp / Teléfono *</label>
                    <input type="tel" [(ngModel)]="bookingPhone" name="phone" required placeholder="Ej. +593 98 684 7543"
                           class="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-amber-500 transition-colors" />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Vehículo (Marca, Modelo y Año) *</label>
                    <input type="text" [(ngModel)]="bookingVehicle" name="vehicle" required placeholder="Ej. Toyota Hilux 2022 / Mercedes C200"
                           class="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-amber-500 transition-colors" />
                  </div>

                  @if (activeTab() === 'repuestos') {
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Calidad de Repuesto Preferida *</label>
                      <select [(ngModel)]="partCondition" name="partCondition"
                              class="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-amber-500 transition-colors">
                        <option value="Original (OEM) y Alternativo Certificado">Cotizar Ambas Opciones (Original y Alternativo)</option>
                        <option value="Solo Repuesto Original (OEM)">Solo Repuesto Original (OEM)</option>
                        <option value="Alternativo Certificado de Alta Calidad">Alternativo Certificado de Primer Nivel</option>
                      </select>
                    </div>
                  } @else {
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Servicio de Taller Requerido *</label>
                      <select [(ngModel)]="bookingService" name="service" required
                              class="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-amber-500 transition-colors">
                        <option value="Mantenimiento Preventivo / Cambio de Aceite y Filtros">Mantenimiento Preventivo / Fluidos y Filtros</option>
                        <option value="Diagnóstico Computarizado Multimarca">Diagnóstico Computarizado por Escáner</option>
                        <option value="Frenos, Dirección y Suspensión">Frenos, Dirección y Suspensión</option>
                        <option value="Instalación y Montaje de Repuestos">Instalación y Montaje de Repuestos</option>
                        <option value="Inspección Técnica / Revisión Pre-Compra">Inspección Técnica / Revisión Pre-Compra</option>
                        <option value="Otra Consulta Técnica Especializada">Otra Consulta Técnica Especializada</option>
                      </select>
                    </div>
                  }
                </div>

                @if (activeTab() === 'repuestos') {
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Código de Parte / Número de Chasis VIN (Opcional)</label>
                    <input type="text" [(ngModel)]="partCodeOrVin" name="partCodeOrVin" placeholder="Ej. Código OEM de la pieza o número de chasis para verificación exacta"
                           class="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-amber-500 transition-colors" />
                  </div>
                } @else {
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Fecha Tentativa Preferida</label>
                      <input type="date" [(ngModel)]="bookingDate" name="date"
                             class="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-amber-500 transition-colors" />
                    </div>
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Horario Preferido</label>
                      <select [(ngModel)]="bookingTimeSlot" name="timeSlot"
                              class="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-amber-500 transition-colors">
                        <option value="Mañana (08:30 - 12:30)">Mañana (08:30 - 12:30)</option>
                        <option value="Tarde (14:00 - 18:00)">Tarde (14:00 - 18:00)</option>
                        <option value="Sábado (09:00 - 13:30)">Sábado (09:00 - 13:30)</option>
                      </select>
                    </div>
                  </div>
                }

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {{ activeTab() === 'repuestos' ? 'Lista o Detalle del Repuesto que Buscas *' : 'Descripción del Trabajo o Falla Mecánica *' }}
                  </label>
                  <textarea [(ngModel)]="bookingNotes" name="notes" rows="4" required
                            [placeholder]="activeTab() === 'repuestos'
                              ? 'Ej. Necesito pastillas de freno delanteras, amortiguadores o kit de distribución...'
                              : 'Describe el mantenimiento que requieres o el síntoma que presenta tu vehículo...'"
                            class="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"></textarea>
                </div>

                <div class="pt-3">
                  <button type="submit" 
                          class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    {{ activeTab() === 'repuestos' ? 'Solicitar Cotización de Repuesto vía WhatsApp' : 'Confirmar Solicitud de Cita vía WhatsApp' }}
                  </button>
                  <p class="mt-2 text-center text-[11px] text-slate-500 dark:text-slate-400">
                    Tu solicitud se enviará con los detalles pre-cargados a nuestra línea oficial de atención ({{ contact.adminPhoneDisplay }}).
                  </p>
                </div>
              </form>

            </div>

          </div>

        </div>
      </section>

    </div>
  `
})
export class WorkshopComponent {
  protected readonly contact = COMPANY_CONTACT;

  protected readonly activeTab = signal<'repuestos' | 'cita'>('repuestos');
  protected readonly isFormHighlighted = signal(false);
  protected readonly submittedSuccess = signal(false);

  protected bookingName = '';
  protected bookingPhone = '';
  protected bookingVehicle = '';
  protected bookingService = 'Mantenimiento Preventivo / Cambio de Aceite y Filtros';
  protected partCondition = 'Original (OEM) y Alternativo Certificado';
  protected partCodeOrVin = '';
  protected bookingDate = '';
  protected bookingTimeSlot = 'Mañana (08:30 - 12:30)';
  protected bookingNotes = '';

  protected setActiveTab(tab: 'repuestos' | 'cita'): void {
    this.activeTab.set(tab);
    this.submittedSuccess.set(false);
  }

  protected scrollToFormSection(tab: 'repuestos' | 'cita'): void {
    this.activeTab.set(tab);
    if (typeof window !== 'undefined') {
      const section = document.getElementById('formulario-taller');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      this.isFormHighlighted.set(true);
      setTimeout(() => {
        const input = document.getElementById('workshop-name-input') as HTMLInputElement | null;
        input?.focus({ preventScroll: true });
      }, 550);
      setTimeout(() => {
        this.isFormHighlighted.set(false);
      }, 2200);
    }
  }

  protected getWhatsAppDirectLink(): string {
    return buildWhatsAppUrl(WHATSAPP_MESSAGES.workshopInitial(), this.contact.adminPhone);
  }

  protected onScheduleSubmit(event: Event): void {
    event.preventDefault();

    const isParts = this.activeTab() === 'repuestos';
    const serviceLabel = isParts
      ? `Cotización de Repuestos (${this.partCondition})`
      : this.bookingService;

    const extraDetails = isParts
      ? `${this.partCodeOrVin ? `[Código/VIN: ${this.partCodeOrVin}] ` : ''}${this.bookingNotes}`
      : `[Horario: ${this.bookingTimeSlot}] ${this.bookingNotes}`;

    const message = WHATSAPP_MESSAGES.workshopAppointment({
      name: this.bookingName,
      phone: this.bookingPhone,
      vehicle: this.bookingVehicle,
      service: serviceLabel,
      date: isParts ? undefined : this.bookingDate,
      notes: extraDetails
    });

    this.submittedSuccess.set(true);
    openWhatsAppDirect(message, this.contact.adminPhone);
  }
}
