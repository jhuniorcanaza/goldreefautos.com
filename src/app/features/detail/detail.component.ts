import { Component, inject, signal, computed, effect, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VehicleService } from '../../core/services/vehicle.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { ComparisonService } from '../../core/services/comparison.service';
import { Vehicle, Specification, getCategoryLabel } from '../../core/models/vehicle.model';
import { QuoteService } from '../../core/services/quote.service';
import { ReservationService } from '../../core/services/reservation.service';
import { VehicleCardComponent } from '../../shared/components/vehicle-card/vehicle-card.component';
import { COMPANY_CONTACT, WHATSAPP_MESSAGES, cleanPhoneNumber, buildWhatsAppUrl } from '../../core/constants/company-contact.constant';
import { extractYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '../../core/utils/youtube.util';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule, CurrencyPipe, DecimalPipe, VehicleCardComponent],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 fade-in">
      
      @if (vehicle(); as v) {
        
        <!-- Navigation Breadcrumbs -->
        <nav class="mb-6 flex text-xs font-semibold text-slate-500 gap-2">
          <a routerLink="/" class="hover:text-blue-600">Inicio</a>
          <span>/</span>
          <a routerLink="/catalogo" class="hover:text-blue-600">Catálogo</a>
          <span>/</span>
          <a routerLink="/catalogo" [queryParams]="{categoria: v.categoria}" class="hover:text-blue-600">{{ getCategoryLabel(v.categoria) }}</a>
          <span>/</span>
          <span class="text-slate-800 font-bold truncate">{{ v.nombre }}</span>
        </nav>

        <!-- Main Product Grid -->
        <div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
          
          <!-- Column 1: Gallery + Integrated Video Player (7/12 cols) -->
          <div class="lg:col-span-7 space-y-4">
            
            <!-- Large Image / Video Frame -->
            <div class="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-sm">
              @if (isVideoActive() && videoEmbedUrl()) {
                <!-- YouTube Embedded Player -->
                <iframe [src]="videoEmbedUrl()"
                        title="Video de {{ v.nombre }}"
                        class="h-full w-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen>
                </iframe>

                <!-- Button to switch back to photos -->
                <button type="button"
                        (click)="deactivateVideo()"
                        class="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white px-3.5 py-2 text-xs font-bold shadow-lg backdrop-blur-md border border-white/15 transition-all cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Ver Fotos
                </button>
              } @else {
                <!-- Status Badge -->
                <span class="absolute top-4 left-4 z-10 inline-flex items-center rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm"
                      [class]="statusBadgeClass()">
                  {{ statusText() }}
                </span>

                <!-- Direct "Ver Video" Button Overlay when vehicle has YouTube video -->
                @if (hasVideo()) {
                  <button type="button"
                          (click)="activateVideo()"
                          class="absolute top-4 right-4 z-10 inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 text-white px-3.5 py-2 text-xs font-bold shadow-lg transition-all hover:scale-105 cursor-pointer border border-red-400/40">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Ver Video
                  </button>
                }

                <img [src]="activeImage() || v.imagenPrincipal" [alt]="v.nombre" class="h-full w-full object-cover bg-slate-100" />
              }
            </div>

            <!-- Thumbnail Carousel Grid (Photos + Video Thumbnail) -->
            @if (allImages().length > 1 || hasVideo()) {
              <div class="flex gap-3 overflow-x-auto pb-2 items-center">
                @if (hasVideo()) {
                  <button type="button"
                          (click)="activateVideo()"
                          class="group relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all cursor-pointer"
                          [class.border-red-600]="isVideoActive()"
                          [class.ring-2]="isVideoActive()"
                          [class.ring-red-500/40]="isVideoActive()"
                          [class.border-transparent]="!isVideoActive()"
                          title="Reproducir Video del Vehículo">
                    <img [src]="videoThumbnailUrl() || v.imagenPrincipal"
                         (error)="onThumbError($event, v.imagenPrincipal)"
                         class="h-full w-full object-cover brightness-75 group-hover:scale-105 transition-transform"
                         alt="Video Tour" />
                    <div class="absolute inset-0 flex flex-col items-center justify-center bg-black/35 group-hover:bg-black/20 transition-colors">
                      <span class="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-md group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current ml-0.5" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </span>
                      <span class="mt-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white">
                        Video
                      </span>
                    </div>
                  </button>
                }

                @for (img of allImages(); track img) {
                  <button type="button"
                          (click)="setActiveImage(img)"
                          class="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all cursor-pointer"
                          [class.border-blue-600]="!isVideoActive() && (activeImage() || v.imagenPrincipal) === img"
                          [class.border-transparent]="isVideoActive() || (activeImage() || v.imagenPrincipal) !== img">
                    <img [src]="img" class="h-full w-full object-cover" alt="Miniatura" />
                  </button>
                }
              </div>
            }
          </div>

          <!-- Column 2: Buy details & actions (5/12 cols) -->
          <div class="lg:col-span-5 flex flex-col justify-between p-6 rounded-3xl border shadow-sm transition-all duration-300"
               [class]="detailContainerClass()">
            <div>
              <!-- Eco Header Banner -->
              @if (isEV()) {
                <div class="mb-5 rounded-2xl bg-emerald-600 dark:bg-emerald-800 text-white p-4 flex items-center justify-between shadow border border-emerald-500/50">
                  <div class="flex items-center gap-3">
                    <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700/60 text-emerald-100 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <span class="block text-[9px] uppercase font-bold tracking-widest text-emerald-250">Tecnología Sustentable</span>
                      <span class="text-xs font-black">100% Ecológico & Eléctrico</span>
                    </div>
                  </div>
                  <span class="rounded-lg bg-emerald-700/80 px-2 py-1 text-[8px] font-bold tracking-widest border border-emerald-500/50 uppercase">Cero Emisiones</span>
                </div>
              }

              <!-- Category and Condition -->
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold uppercase tracking-widest text-blue-600">{{ getCategoryLabel(v.categoria) }}</span>
                <span class="rounded bg-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-800 capitalize">{{ v.condicion }}</span>
              </div>

              <!-- Title & Price -->
              <h1 class="mt-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl"
                  [class]="isEV() ? 'text-emerald-950 dark:text-white' : 'text-slate-900 dark:text-white'">{{ v.nombre }}</h1>
              
              <div class="mt-4 rounded-2xl p-5 shadow-sm transition-all duration-300" [class]="priceBoxClass()">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Precio Contado</span>
                    <div class="mt-1.5 flex items-baseline gap-2">
                      <p class="font-heading text-3xl font-black text-slate-950 dark:text-white">
                        {{ acceptedPrices()[0]?.amount | currency:'USD':'$':'1.0-0' }}
                      </p>
                      <span class="text-sm font-bold text-slate-500 dark:text-slate-400">USD</span>
                    </div>
                  </div>
                  <span class="text-xs text-emerald-600 font-bold flex items-center gap-1 shrink-0 self-start sm:self-center">
                    <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Entrega inmediata
                  </span>
                </div>
              </div>
              <div [class]="isEV() ? 'mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 border-b border-emerald-250/50 dark:border-emerald-800/40 pb-4' : 'mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 border-b border-slate-200 pb-4'">
                <!-- Año -->
                <div [class]="specPillClass()">
                  <div class="flex h-7 w-7 items-center justify-center rounded-md shrink-0" [class]="isEV() ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-50 text-blue-600'">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <span class="block text-[9px] uppercase font-bold text-slate-455">Año</span>
                    <span class="text-xs font-semibold text-slate-900 dark:text-white leading-tight">{{ v.anio }}</span>
                  </div>
                </div>

                <!-- Recorrido -->
                <div [class]="specPillClass()">
                  <div class="flex h-7 w-7 items-center justify-center rounded-md shrink-0" [class]="isEV() ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-50 text-blue-600'">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <span class="block text-[9px] uppercase font-bold text-slate-455">Recorrido</span>
                    <span class="text-xs font-semibold text-slate-900 dark:text-white truncate block leading-tight">{{ v.kilometraje | number:'1.0-0' }} km</span>
                  </div>
                </div>

                <!-- Transmisión -->
                <div [class]="specPillClass()">
                  <div class="flex h-7 w-7 items-center justify-center rounded-md shrink-0" [class]="isEV() ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-50 text-blue-600'">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <span class="block text-[9px] uppercase font-bold text-slate-450">Transmisión</span>
                    <span class="text-xs font-semibold text-slate-900 dark:text-white truncate block leading-tight" [title]="v.transmision">{{ v.transmision }}</span>
                  </div>
                </div>
                
                <!-- Ubicación -->
                <div [class]="specPillClass()">
                  <div class="flex h-7 w-7 items-center justify-center rounded-md shrink-0" [class]="isEV() ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-50 text-blue-600'">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <span class="block text-[9px] uppercase font-bold text-slate-455">Ubicación</span>
                    <span class="text-xs font-semibold text-slate-900 dark:text-white truncate block leading-tight" [title]="v.ubicacion">{{ v.ubicacion }}</span>
                  </div>
                </div>

                <!-- Color -->
                @if (v.color) {
                  <div [class]="specPillClass()">
                    <div class="flex h-7 w-7 items-center justify-center rounded-md shrink-0" [class]="isEV() ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-50 text-blue-600'">
                      <span class="h-3.5 w-3.5 rounded-full border border-slate-300 dark:border-slate-600 shadow-2xs" [style.background-color]="getColorHex(v.color)"></span>
                    </div>
                    <div class="min-w-0">
                      <span class="block text-[9px] uppercase font-bold text-slate-455">Color</span>
                      <span class="text-xs font-semibold text-slate-900 dark:text-white truncate block leading-tight" [title]="v.color">{{ v.color }}</span>
                    </div>
                  </div>
                }

                <!-- Motor -->
                @if (v.motor) {
                  <div [class]="specPillClass()">
                    <div class="flex h-7 w-7 items-center justify-center rounded-md shrink-0" [class]="isEV() ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-50 text-blue-600'">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div class="min-w-0">
                      <span class="block text-[9px] uppercase font-bold text-slate-455">Motor</span>
                      <span class="text-xs font-semibold text-slate-900 dark:text-white truncate block leading-tight" [title]="v.motor">{{ v.motor }}</span>
                    </div>
                  </div>
                }

                <!-- Auto Specifics -->
                @if ((v.categoria === 'autos' || v.categoria === 'autos_electricos') && v.autoDetail) {
                  @if (v.autoDetail.cilindrada) {
                    <div [class]="specPillClass()">
                      <div class="flex h-7 w-7 items-center justify-center rounded-md shrink-0" [class]="isEV() ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-50 text-blue-600'">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div class="min-w-0">
                        <span class="block text-[9px] uppercase font-bold text-slate-455">Cilindrada</span>
                        <span class="text-xs font-semibold text-slate-900 dark:text-white truncate block leading-tight">{{ v.autoDetail.cilindrada }} cc</span>
                      </div>
                    </div>
                  }
                  <div [class]="specPillClass()">
                    <div class="flex h-7 w-7 items-center justify-center rounded-md shrink-0" [class]="isEV() ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-50 text-blue-600'">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1" />
                      </svg>
                    </div>
                    <div class="min-w-0">
                      <span class="block text-[9px] uppercase font-bold text-slate-455">Carrocería</span>
                      <span class="text-xs font-semibold text-slate-900 dark:text-white truncate block leading-tight" [title]="v.autoDetail.carroceria">{{ v.autoDetail.carroceria }}</span>
                    </div>
                  </div>
                  <div [class]="specPillClass()">
                    <div class="flex h-7 w-7 items-center justify-center rounded-md shrink-0" [class]="isEV() ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-50 text-blue-600'">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div class="min-w-0">
                      <span class="block text-[9px] uppercase font-bold text-slate-455">Capacidad</span>
                      <span class="text-xs font-semibold text-slate-900 dark:text-white truncate block leading-tight">{{ v.autoDetail.pasajeros }} as. / {{ v.autoDetail.puertas }}p</span>
                    </div>
                  </div>
                  @if (v.autoDetail.autonomia) {
                    <div [class]="specPillClass()">
                      <div class="flex h-7 w-7 items-center justify-center rounded-md shrink-0" [class]="isEV() ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-50 text-blue-600'">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A2 2 0 012.553 15.48V8.52a2 2 0 011.053-1.796L9 4m12 16l-5.447-2.724a2 2 0 01-1.053-1.796V8.52a2 2 0 011.053-1.796L21 4m-12 0v16m0 0l-4-4m4 4l4-4m4-12v16m0 0l-4-4m4 4l4-4" />
                        </svg>
                      </div>
                      <div class="min-w-0">
                        <span class="block text-[9px] uppercase font-bold text-slate-455">Autonomía</span>
                        <span class="text-xs font-semibold text-slate-900 dark:text-white truncate block leading-tight">{{ v.autoDetail.autonomia }} km</span>
                      </div>
                    </div>
                  }
                  @if (v.autoDetail.tamanoBateria) {
                    <div [class]="specPillClass()">
                      <div class="flex h-7 w-7 items-center justify-center rounded-md shrink-0" [class]="isEV() ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-50 text-blue-600'">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div class="min-w-0">
                        <span class="block text-[9px] uppercase font-bold text-slate-455">Batería</span>
                        <span class="text-xs font-semibold text-slate-900 dark:text-white truncate block leading-tight">{{ v.autoDetail.tamanoBateria }} kWh</span>
                      </div>
                    </div>
                  }
                }

                <!-- Moto Specifics -->
                @if ((v.categoria === 'motos' || v.categoria === 'motos_electricos') && v.motoDetail) {
                  <div [class]="specPillClass()">
                    <div class="flex h-7 w-7 items-center justify-center rounded-md shrink-0" [class]="isEV() ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-50 text-blue-600'">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div class="min-w-0">
                      <span class="block text-[9px] uppercase font-bold text-slate-455">Cilindrada</span>
                      <span class="text-xs font-semibold text-slate-900 dark:text-white truncate block leading-tight">{{ v.motoDetail.cilindrada }} cc</span>
                    </div>
                  </div>
                  <div [class]="specPillClass()">
                    <div class="flex h-7 w-7 items-center justify-center rounded-md shrink-0" [class]="isEV() ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-50 text-blue-600'">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div class="min-w-0">
                      <span class="block text-[9px] uppercase font-bold text-slate-455">Tipo Moto</span>
                      <span class="text-xs font-semibold text-slate-900 dark:text-white truncate block leading-tight" [title]="v.motoDetail.tipoMoto">{{ v.motoDetail.tipoMoto }}</span>
                    </div>
                  </div>
                  @if (v.motoDetail.autonomia) {
                    <div [class]="specPillClass()">
                      <div class="flex h-7 w-7 items-center justify-center rounded-md shrink-0" [class]="isEV() ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-50 text-blue-600'">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A2 2 0 012.553 15.48V8.52a2 2 0 011.053-1.796L9 4m12 16l-5.447-2.724a2 2 0 01-1.053-1.796V8.52a2 2 0 011.053-1.796L21 4m-12 0v16m0 0l-4-4m4 4l4-4m4-12v16m0 0l-4-4m4 4l4-4" />
                        </svg>
                      </div>
                      <div class="min-w-0">
                        <span class="block text-[9px] uppercase font-bold text-slate-455">Autonomía</span>
                        <span class="text-xs font-semibold text-slate-900 dark:text-white truncate block leading-tight">{{ v.motoDetail.autonomia }} km</span>
                      </div>
                    </div>
                  }
                  @if (v.motoDetail.tamanoBateria) {
                    <div [class]="specPillClass()">
                      <div class="flex h-7 w-7 items-center justify-center rounded-md shrink-0" [class]="isEV() ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-50 text-blue-600'">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div class="min-w-0">
                        <span class="block text-[9px] uppercase font-bold text-slate-455">Batería</span>
                        <span class="text-xs font-semibold text-slate-900 dark:text-white truncate block leading-tight">{{ v.motoDetail.tamanoBateria }} kWh</span>
                      </div>
                    </div>
                  }
                }

                <!-- Maquinaria Specifics -->
                @if ((v.categoria === 'maquinaria' || v.categoria === 'maquinaria_agricola' || v.categoria === 'transporte_pesado') && v.maquinariaDetail) {
                  <div [class]="specPillClass()">
                    <div class="flex h-7 w-7 items-center justify-center rounded-md shrink-0" [class]="isEV() ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-50 text-blue-600'">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                    </div>
                    <div class="min-w-0">
                      <span class="block text-[9px] uppercase font-bold text-slate-455">Peso</span>
                      <span class="text-xs font-semibold text-slate-900 dark:text-white truncate block leading-tight">{{ v.maquinariaDetail.pesoOperativo | number:'1.0-0' }} kg</span>
                    </div>
                  </div>
                  <div [class]="specPillClass()">
                    <div class="flex h-7 w-7 items-center justify-center rounded-md shrink-0" [class]="isEV() ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-50 text-blue-600'">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div class="min-w-0">
                      <span class="block text-[9px] uppercase font-bold text-slate-455">Uso</span>
                      <span class="text-xs font-semibold text-slate-900 dark:text-white truncate block leading-tight">{{ v.maquinariaDetail.horasUso }} hrs</span>
                    </div>
                  </div>
                }
              </div>

              <!-- Description -->
              <div class="mt-4">
                <h3 class="text-xs font-bold uppercase tracking-wider" [class]="isEV() ? 'text-emerald-900 dark:text-emerald-205' : 'text-slate-950 dark:text-white'">Descripción del Vehículo</h3>
                <p class="mt-1.5 text-xs leading-relaxed" [class]="isEV() ? 'text-emerald-900 dark:text-emerald-200' : 'text-slate-650 dark:text-slate-350'">{{ v.descripcion }}</p>
              </div>

            </div>

            <!-- CTA Action Buttons -->
            <div class="mt-6 pt-5 border-t border-slate-200">
              <div class="flex gap-3">
                <!-- WhatsApp CTA button -->
                <a [href]="whatsAppLink()" target="_blank" rel="noopener noreferrer"
                   class="flex-1 inline-flex items-center justify-center gap-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 text-sm font-bold transition-all shadow">
                  <svg class="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Consultar al WhatsApp
                </a>

                <!-- Favorite / Compare buttons -->
                <button (click)="toggleFavorite()" 
                        class="flex h-12 w-12 items-center justify-center rounded-xl border focus:outline-none transition-colors"
                        [class]="isFavorite() ? 'border-red-100 bg-red-50 text-red-500 hover:bg-red-100' : 'border-slate-200 bg-white text-slate-400 hover:text-red-500 hover:bg-slate-50'"
                        title="Favorito">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" [attr.fill]="isFavorite() ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                <button (click)="toggleComparison()" 
                        class="flex h-12 w-12 items-center justify-center rounded-xl border focus:outline-none transition-colors"
                        [class]="isCompared() ? 'border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100' : 'border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:bg-slate-50'"
                        title="Comparar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                  </svg>
                </button>
              </div>

              <!-- Advisor Quick Select -->
              <div class="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 px-1">
                <span>Asesores de Ventas:</span>
                <div class="flex items-center gap-2 font-medium">
                  <a [href]="getAdvisorLink('andres')" target="_blank" class="hover:text-emerald-500 text-slate-700 dark:text-slate-300 underline decoration-slate-300 dark:decoration-slate-600 transition-colors">
                    Andrés Acosta (+593)
                  </a>
                  <span>•</span>
                  <a [href]="getAdvisorLink('jonathan')" target="_blank" class="hover:text-emerald-500 text-slate-700 dark:text-slate-300 underline decoration-slate-300 dark:decoration-slate-600 transition-colors">
                    Jonathan Alvarez (+593)
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Specifications Section -->
        <section class="mt-10 border-t border-slate-200/60 dark:border-slate-800 pt-8">
          <h2 class="font-heading text-lg font-bold text-slate-900 dark:text-white">Equipamiento y Características</h2>
          <p class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Detalles de confort, seguridad y especificaciones adicionales</p>

          <div class="mt-5">
            @if (formattedSpecs().length > 0) {
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                @for (spec of formattedSpecs(); track spec.label) {
                  <div class="flex items-center justify-between gap-2 text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div class="flex items-center gap-2 min-w-0">
                      <span class="h-2 w-2 rounded-full shrink-0" [class]="isEV() ? 'bg-emerald-500' : 'bg-blue-500'"></span>
                      <span class="font-bold text-slate-900 dark:text-white truncate">{{ spec.label }}:</span>
                    </div>
                    @if (spec.value) {
                      <span class="font-semibold text-slate-600 dark:text-slate-300 shrink-0">{{ spec.value }}</span>
                    }
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-8 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <p class="text-xs text-slate-400">Este vehículo no tiene equipamiento específico registrado.</p>
              </div>
            }
          </div>
        </section>

        <!-- Recommended Vehicles Section -->
        @if (recommendedVehicles().length > 0) {
          <section class="mt-12 border-t border-slate-200/60 dark:border-slate-800 pt-10">
            <h2 class="font-heading text-xl font-bold text-slate-900 dark:text-white">Vehículos Recomendados</h2>
            <p class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Opciones similares en nuestro catálogo que podrían interesarte</p>

            <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              @for (item of recommendedVehicles(); track item.id) {
                <app-vehicle-card [vehicle]="item" displayCurrency="USD"></app-vehicle-card>
              }
            </div>
          </section>
        }

      } @else {
        <!-- Error / Loading view -->
        <div class="py-24 text-center">
          <h2 class="font-heading text-2xl font-bold text-slate-900">Vehículo no encontrado</h2>
          <p class="text-slate-500 mt-2">El ID solicitado no corresponde a ningún vehículo en nuestro inventario actual.</p>
          <a routerLink="/catalogo" class="mt-6 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">
            Regresar al catálogo
          </a>
        </div>
      }

      <!-- MODAL: Solicitar Cotización (Fondo 100% transparente) -->
      @if (isQuoteModalOpen()) {
        <div class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-transparent pointer-events-none">
          <div class="fixed inset-0 bg-transparent pointer-events-auto" (click)="closeQuoteModal()"></div>
          <div class="relative z-10 pointer-events-auto w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.22)] border border-slate-200 dark:border-slate-800 animate-fade-in">
            <button (click)="closeQuoteModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 class="font-heading text-xl font-extrabold text-slate-900 dark:text-white">Solicitar Cotización</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Completa los campos para recibir una cotización formal de: <strong class="text-slate-800 dark:text-slate-200">{{ vehicle()?.nombre }}</strong></p>

            @if (quoteFormSubmitted()) {
              <div class="mt-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 p-4 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/50 flex gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <div>
                  <p class="font-bold text-sm">¡Cotización enviada!</p>
                  <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">Un asesor de finanzas te contactará a la brevedad.</p>
                </div>
              </div>
            } @else {
              <form [formGroup]="quoteForm" (ngSubmit)="submitQuote()" class="mt-6 space-y-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Nombre Completo *</label>
                  <input type="text" formControlName="nombre" 
                         class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-2xs"
                         [class.border-red-400]="isQuoteFieldInvalid('nombre')" />
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Email *</label>
                    <input type="email" formControlName="email" 
                           class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-2xs"
                           [class.border-red-400]="isQuoteFieldInvalid('email')" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Teléfono / WhatsApp *</label>
                    <input type="tel" formControlName="telefono" 
                           class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-2xs"
                           [class.border-red-400]="isQuoteFieldInvalid('telefono')" />
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Mensaje (Opcional)</label>
                  <textarea formControlName="mensaje" rows="3" 
                            class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-2xs"></textarea>
                </div>
                <button type="submit" [disabled]="quoteForm.invalid"
                        class="w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-md cursor-pointer">
                  Enviar Solicitud
                </button>
              </form>
            }
          </div>
        </div>
      }

      <!-- MODAL: Reservar Unidad (Fondo 100% transparente) -->
      @if (isReserveModalOpen()) {
        <div class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-transparent pointer-events-none">
          <div class="fixed inset-0 bg-transparent pointer-events-auto" (click)="closeReserveModal()"></div>
          <div class="relative z-10 pointer-events-auto w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.22)] border border-slate-200 dark:border-slate-800 animate-fade-in">
            <button (click)="closeReserveModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 class="font-heading text-xl font-extrabold text-slate-900 dark:text-white">Reservar Unidad</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Separa este vehículo abonando un pago inicial simulado.</p>

            @if (reserveFinished()) {
              <div class="mt-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 p-4 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/50 flex gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <div>
                  <p class="font-bold text-sm">¡Unidad Reservada!</p>
                  <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">El estado del vehículo ha cambiado a 'Reservado' en el inventario.</p>
                </div>
              </div>
            } @else {
              <div class="mt-6 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/40 space-y-2 text-xs">
                <div class="flex justify-between font-medium">
                  <span class="text-slate-500 dark:text-slate-400">Modelo:</span>
                  <span class="text-slate-800 dark:text-white font-bold">{{ vehicle()?.nombre }}</span>
                </div>
                <div class="flex justify-between font-medium">
                  <span class="text-slate-500 dark:text-slate-400">Monto de Reserva:</span>
                  <span class="text-slate-900 dark:text-white font-extrabold text-sm">$500.00 USD</span>
                </div>
                <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-justify">Este pago inicial de $500 USD garantiza que la unidad sea bloqueada de la venta pública por 48 horas mientras se realiza el papeleo oficial.</p>
              </div>

              <!-- Payment Method Mock selection -->
              <div class="mt-6">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Selecciona Método de Pago</label>
                <div class="mt-2.5 space-y-2">
                  <label class="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <input type="radio" name="payment" value="visa" checked class="text-blue-600" />
                    <span class="font-semibold">Tarjeta de Crédito / Débito (Simulado)</span>
                  </label>
                  <label class="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <input type="radio" name="payment" value="transfer" class="text-blue-600" />
                    <span class="font-semibold">Transferencia Bancaria (Simulado)</span>
                  </label>
                </div>
              </div>

              <button (click)="confirmReservation()"
                      class="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white hover:bg-blue-500 transition-colors shadow-md cursor-pointer">
                Confirmar Reserva Simulada ($500)
              </button>
            }
          </div>
        </div>
      }

    </div>
  `
})
export class DetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly vehicleService = inject(VehicleService);
  private readonly favoriteService = inject(FavoriteService);
  private readonly comparisonService = inject(ComparisonService);
  private readonly quoteService = inject(QuoteService);
  private readonly reservationService = inject(ReservationService);
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly fb = inject(FormBuilder);
  protected readonly getCategoryLabel = getCategoryLabel;

  protected getColorHex(colorName?: string): string {
    const c = (colorName || '').trim().toLowerCase();
    if (c.includes('blanco perla')) return '#F1F5F9';
    if (c.includes('blanco')) return '#FFFFFF';
    if (c.includes('negro')) return '#111827';
    if (c.includes('rojo')) return '#DC2626';
    if (c.includes('azul marino')) return '#1E3A8A';
    if (c.includes('azul')) return '#2563EB';
    if (c.includes('grafito') || c.includes('plomo')) return '#475569';
    if (c.includes('gris') || c.includes('plata')) return '#94A3B8';
    if (c.includes('verde')) return '#16A34A';
    if (c.includes('amarillo')) return '#EAB308';
    if (c.includes('naranja')) return '#EA580C';
    if (c.includes('cafe') || c.includes('café') || c.includes('bronce')) return '#78350F';
    return '#94A3B8';
  }

  protected readonly isEV = computed(() => {
    const v = this.vehicle();
    return v ? (v.categoria === 'autos_electricos' || v.categoria === 'motos_electricos') : false;
  });

  protected readonly specPillClass = computed(() => {
    if (this.isEV()) {
      return 'flex items-center gap-2 p-2 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/40 border border-emerald-500/10 dark:border-emerald-900/30';
    }
    return 'flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100/80';
  });

  protected readonly detailContainerClass = computed(() => {
    if (this.isEV()) {
      return 'bg-emerald-50/70 dark:bg-emerald-950 border-slate-200 dark:border-emerald-700 shadow-xl shadow-emerald-100/30 dark:shadow-emerald-950/40 text-emerald-950 dark:text-emerald-50';
    }
    return 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800';
  });

  protected readonly priceBoxClass = computed(() => {
    if (this.isEV()) {
      return 'bg-emerald-100/80 dark:bg-emerald-900/60 border border-emerald-250 dark:border-emerald-800';
    }
    return 'bg-slate-100 dark:bg-slate-950/40';
  });

  protected readonly vehicleId = signal<string>('');

  protected readonly vehicle = computed(() =>
    this.vehicleService.vehicles().find(v => v.id === this.vehicleId())
  );

  protected readonly activeImage = signal<string>('');
  protected readonly isVideoActive = signal<boolean>(false);

  protected readonly hasVideo = computed(() => {
    const v = this.vehicle();
    return !!extractYouTubeId(v?.videoUrl);
  });

  protected readonly videoEmbedUrl = computed<SafeResourceUrl | null>(() => {
    const v = this.vehicle();
    const embedUrl = getYouTubeEmbedUrl(v?.videoUrl);
    if (!embedUrl) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(`${embedUrl}&autoplay=1`);
  });

  protected readonly videoThumbnailUrl = computed<string | null>(() => {
    const v = this.vehicle();
    return getYouTubeThumbnailUrl(v?.videoUrl);
  });

  protected readonly isFavorite = computed(() => this.favoriteService.isFavorite(this.vehicleId()));
  protected readonly isCompared = computed(() => this.comparisonService.isCompared(this.vehicleId()));

  protected readonly recommendedVehicles = computed(() => {
    const current = this.vehicle();
    if (!current) return [];
    
    const all = this.vehicleService.vehicles();
    const sameCategory = all.filter(v => v.categoria === current.categoria && v.id !== current.id && v.estado === 'disponible');
    
    if (sameCategory.length >= 4) {
      return sameCategory.slice(0, 4);
    }
    
    const sameCatIds = new Set(sameCategory.map(v => v.id));
    const others = all.filter(v => v.id !== current.id && !sameCatIds.has(v.id) && v.estado === 'disponible');
    
    return [...sameCategory, ...others].slice(0, 4);
  });

  protected readonly acceptedPrices = computed(() => {
    const v = this.vehicle();
    if (!v) return [];

    const nativeCurrency = v.moneda || 'USD';
    const nativePrice = v.precio;
    const usdAmount = nativeCurrency === 'BOB' ? Math.round(nativePrice / 6.96) : nativePrice;

    return [{
      amount: usdAmount,
      currency: 'USD' as const,
      label: 'Precio Contado ($ USD)'
    }];
  });

  // Modals controllers
  protected readonly isQuoteModalOpen = signal(false);
  protected readonly quoteFormSubmitted = signal(false);
  protected readonly quoteForm: FormGroup;

  protected readonly isReserveModalOpen = signal(false);
  protected readonly reserveFinished = signal(false);

  protected readonly allImages = computed(() => {
    const v = this.vehicle();
    if (!v) return [];
    const list = [v.imagenPrincipal, ...(v.imagenes || [])];
    return Array.from(new Set(list.filter(Boolean)));
  });

  constructor() {
    this.quoteForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      mensaje: ['']
    });

    effect(() => {
      const v = this.vehicle();
      if (v?.imagenPrincipal) {
        this.activeImage.set(v.imagenPrincipal);
        this.isVideoActive.set(false);
      }
    });
  }

  public ngOnInit(): void {
    this.vehicleService.refreshVehicles(false);
    this.route.paramMap.subscribe(params => {
      const id = params.get('id') || '';
      this.vehicleId.set(id);
      this.isVideoActive.set(false);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    });
  }

  protected setActiveImage(url: string): void {
    this.isVideoActive.set(false);
    this.activeImage.set(url);
  }

  protected activateVideo(): void {
    if (this.hasVideo()) {
      this.isVideoActive.set(true);
    }
  }

  protected deactivateVideo(): void {
    this.isVideoActive.set(false);
  }

  protected onThumbError(event: Event, fallbackUrl: string): void {
    const img = event.target as HTMLImageElement;
    if (img && !img.dataset['fallback']) {
      img.dataset['fallback'] = 'true';
      img.src = fallbackUrl || '/vehicles/auto-01.jpg';
    }
  }

  protected readonly formattedSpecs = computed(() => {
    const v = this.vehicle();
    if (!v || !v.especificaciones) return [];

    let specs = v.especificaciones as any;

    if (typeof specs === 'string') {
      try {
        specs = JSON.parse(specs);
      } catch {
        return [];
      }
    }

    if (Array.isArray(specs)) {
      return specs.map(item => {
        if (typeof item === 'string') return { label: item, value: '' };
        if (item && typeof item === 'object') {
          const label = item.nombre || item.label || item.key || item.name || '';
          const value = item.value || item.valor || '';
          return { label, value };
        }
        return { label: String(item), value: '' };
      }).filter(s => s.label);
    }

    if (typeof specs === 'object' && specs !== null) {
      return Object.entries(specs).map(([label, value]) => ({
        label,
        value: String(value)
      }));
    }

    return [];
  });

  protected readonly statusText = computed(() => {
    const estado = this.vehicle()?.estado;
    if (estado === 'disponible') return 'Disponible';
    if (estado === 'reservado') return 'Reservado';
    return 'Vendido';
  });

  protected readonly statusBadgeClass = computed(() => {
    const estado = this.vehicle()?.estado;
    if (estado === 'disponible') return 'bg-emerald-500';
    if (estado === 'reservado') return 'bg-amber-500';
    return 'bg-rose-500';
  });

  protected readonly whatsAppLink = computed(() => {
    const v = this.vehicle();
    if (!v) return '';
    const currencyStr = v.moneda || 'USD';
    const targetPhone = cleanPhoneNumber(v.telefonoContacto || COMPANY_CONTACT.adminPhone);
    const text = WHATSAPP_MESSAGES.vehicleInquiry(v.nombre, v.precio, currencyStr);
    return buildWhatsAppUrl(text, targetPhone);
  });

  protected getAdvisorLink(advisorKey: 'andres' | 'jonathan'): string {
    const v = this.vehicle();
    if (!v) return '';
    const currencyStr = v.moneda || 'USD';
    const text = WHATSAPP_MESSAGES.vehicleInquiry(v.nombre, v.precio, currencyStr);
    const phone = advisorKey === 'andres' ? '593986847543' : '593995828197';
    return buildWhatsAppUrl(text, phone);
  }


  protected toggleFavorite(): void {
    this.favoriteService.toggleFavorite(this.vehicleId());
  }

  protected toggleComparison(): void {
    const v = this.vehicle();
    if (v) {
      this.comparisonService.toggleComparison(v);
    }
  }

  // Modals operations
  protected openQuoteModal(): void {
    this.quoteFormSubmitted.set(false);
    this.isQuoteModalOpen.set(true);
  }

  protected closeQuoteModal(): void {
    this.isQuoteModalOpen.set(false);
  }

  protected async submitQuote(): Promise<void> {
    if (this.quoteForm.valid) {
      const success = await this.quoteService.submitQuote({
        nombre: this.quoteForm.value.nombre,
        email: this.quoteForm.value.email,
        telefono: this.quoteForm.value.telefono,
        mensaje: this.quoteForm.value.mensaje,
        vehicleId: this.vehicleId(),
      });
      if (success) {
        this.quoteFormSubmitted.set(true);
        setTimeout(() => {
          this.closeQuoteModal();
          this.quoteForm.reset();
        }, 3500);
      }
    }
  }

  protected isQuoteFieldInvalid(fieldName: string): boolean {
    const field = this.quoteForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  protected openReserveModal(): void {
    this.reserveFinished.set(false);
    this.isReserveModalOpen.set(true);
  }

  protected closeReserveModal(): void {
    this.isReserveModalOpen.set(false);
  }

  protected async confirmReservation(): Promise<void> {
    const success = await this.reservationService.createReservation(
      this.vehicleId(),
      'visa',
      500
    );

    if (success) {
      this.reserveFinished.set(true);
      await this.vehicleService.refreshVehicles(false);

      setTimeout(() => {
        this.closeReserveModal();
      }, 3500);
    }
  }
}
