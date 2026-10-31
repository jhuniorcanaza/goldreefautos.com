import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VehicleService } from '../../core/services/vehicle.service';
import { CarouselService } from '../../core/services/carousel.service';
import { VehicleCardComponent } from '../../shared/components/vehicle-card/vehicle-card.component';
import { CarouselSlide } from '../../core/models/carousel.model';
import { CommonModule } from '@angular/common';
import { COMPANY_CONTACT, WHATSAPP_MESSAGES, openWhatsAppDirect, buildWhatsAppUrl } from '../../core/constants/company-contact.constant';
import { SoldShowcaseData, SoldVehicleItem } from '../../core/models/sold-showcase.model';

const DEFAULT_HERO_SLIDES: CarouselSlide[] = [
  {
    id: 1,
    image: '/hero-vehicles-banner.jpg',
    badge: 'Exclusividad & Potencia',
    title: 'Autos, Motos y Maquinaria Pesada en un Solo Lugar',
    description: 'Encuentra tu próximo vehículo premium o equipo de alto rendimiento con garantía, certificación y entrega inmediata.',
    link: '/catalogo',
    alineacion: 'izquierda'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1000',
    badge: 'Pasión en Dos Ruedas',
    title: 'Siente la adrenalina en su máxima expresión',
    description: 'Motocicletas deportivas, urbanas y de aventura seleccionadas con los más altos estándares de rendimiento y seguridad.',
    link: '/catalogo',
    alineacion: 'izquierda'
  },
  {
    id: 3,
    image: '/maquinaria_pesada.png',
    badge: 'Maquinaria de Alto Poder',
    title: 'Soluciones robustas para tu negocio o industria',
    description: 'Excavadoras, grúas y tractores de potencia garantizada para impulsar la productividad de tus grandes obras.',
    link: '/catalogo',
    alineacion: 'izquierda'
  }
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormsModule, VehicleCardComponent, CommonModule],
  styles: [`
    @keyframes featuredSlideRight {
      0% { transform: translateX(120px); opacity: 0; }
      40% { opacity: 1; }
      100% { transform: translateX(0); opacity: 1; }
    }
    .featured-card-animate {
      animation: featuredSlideRight 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
  `],
  template: `
    <div class="fade-in">
      
      <!-- HERO CAROUSEL (Pantalla Completa) -->
      <section class="relative bg-slate-950 text-white overflow-hidden h-[calc(100vh-80px)] min-h-[600px] w-full">
        
        @if (loadingSlides()) {
          <div class="absolute inset-0 flex items-center justify-center bg-slate-950/60 z-30">
            <span class="animate-spin h-8 w-8 border-3 border-blue-500 border-t-transparent rounded-full"></span>
          </div>
        }

        <!-- Floating CTA de Captación Rápida "Vende tu Auto" (Esquina Superior Derecha) -->
        <div class="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
          <button (click)="scrollToSellSection()" type="button"
                  class="group flex items-center gap-3 rounded-2xl bg-slate-950/80 hover:bg-slate-900 backdrop-blur-md border border-emerald-500/40 hover:border-emerald-400 p-2 sm:p-2.5 pr-3.5 sm:pr-4 shadow-2xl shadow-black/70 hover:shadow-emerald-500/20 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer text-left">
            <span class="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30 text-lg group-hover:rotate-6 transition-transform">
              🚗💰
            </span>
            <div>
              <div class="flex items-center gap-1.5">
                <span class="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-emerald-400">Tasación Inmediata</span>
                <span class="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <p class="text-xs sm:text-sm font-extrabold text-white group-hover:text-emerald-300 transition-colors leading-tight">
                ¿Quieres vender tu auto?
              </p>
              <span class="text-[10px] text-slate-300 flex items-center gap-1 mt-0.5">
                Véndelo con nosotros aquí
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-emerald-400 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </span>
            </div>
          </button>
        </div>

        <!-- Slides Wrapper -->
        @for (slide of slides(); track slide.id) {
          <div class="absolute inset-0 transition-opacity duration-700 ease-in-out z-0"
               [class.opacity-100]="activeSlide() === $index"
               [class.opacity-0]="activeSlide() !== $index">
            
            <!-- Fotografía de Fondo (Clara y Nítida sin Opacar) -->
            <img [src]="slide.image" class="h-full w-full object-cover" [alt]="slide.title" />
            
            <!-- Degradado Sutil de Fondo (Solo en la base) -->
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>
            
            <!-- Slide Content Box (Compacto, Flotante y No Invasivo) -->
            <div class="absolute inset-x-0 bottom-0 z-10 pb-12 sm:pb-14">
              <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex"
                   [class.justify-start]="!slide.alineacion || slide.alineacion === 'izquierda'"
                   [class.justify-center]="slide.alineacion === 'centro'"
                   [class.justify-end]="slide.alineacion === 'derecho'">
                
                <div class="max-w-sm sm:max-w-md bg-slate-950/60 backdrop-blur-md border border-white/15 p-5 rounded-lg shadow-xl transition-all duration-500"
                     [class.text-left]="!slide.alineacion || slide.alineacion === 'izquierda'"
                     [class.text-center]="slide.alineacion === 'centro'"
                     [class.text-right]="slide.alineacion === 'derecho'"
                     [class.translate-y-0]="activeSlide() === $index"
                     [class.opacity-100]="activeSlide() === $index"
                     [class.translate-y-3]="activeSlide() !== $index"
                     [class.opacity-0]="activeSlide() !== $index">
                  
                  <!-- Badge -->
                  <div class="flex"
                       [class.justify-start]="!slide.alineacion || slide.alineacion === 'izquierda'"
                       [class.justify-center]="slide.alineacion === 'centro'"
                       [class.justify-end]="slide.alineacion === 'derecho'">
                    <span class="inline-flex items-center gap-1.5 rounded-md bg-gray-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                      {{ slide.badge }}
                    </span>
                  </div>

                  <!-- Title -->
                  <h1 class="mt-2 font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-snug drop-shadow-sm">
                    {{ slide.title }}
                  </h1>

                  <!-- Description -->
                  <p class="mt-1.5 text-xs text-slate-200 leading-relaxed font-normal line-clamp-2">
                    {{ slide.description }}
                  </p>

                  <!-- Actions inside slide -->
                  <div class="mt-3.5 flex flex-wrap items-center gap-2"
                       [class.justify-start]="!slide.alineacion || slide.alineacion === 'izquierda'"
                       [class.justify-center]="slide.alineacion === 'centro'"
                       [class.justify-end]="slide.alineacion === 'derecho'">
                    <a [routerLink]="slide.link || '/catalogo'"
                       class="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-colors">
                      Ver Catálogo
                    </a>
                    <button (click)="scrollToSellSection()" type="button"
                            class="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-emerald-600/80 border border-white/20 hover:border-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition-all cursor-pointer">
                      <span>Vender mi Auto</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </button>
                  </div>

                </div>
              </div>
            </div>
            
          </div>
        }

        <!-- Carousel Indicators (Navegación minimalista) -->
        @if (slides().length > 1) {
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 p-1 rounded-full bg-slate-950/40 backdrop-blur-sm border border-white/10">
            @for (slide of slides(); track slide.id) {
              <button (click)="setSlide($index)" 
                      class="h-1.5 rounded-full transition-all duration-300 focus:outline-none"
                      [class.w-6]="activeSlide() === $index"
                      [class.bg-blue-500]="activeSlide() === $index"
                      [class.w-2]="activeSlide() !== $index"
                      [class.bg-white/40]="activeSlide() !== $index">
              </button>
            }
          </div>
        }

        <!-- Carousel Navigation Arrows -->
        @if (slides().length > 1) {
          <button (click)="prevSlide()" class="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-xl bg-slate-950/30 hover:bg-slate-950/60 backdrop-blur-sm border border-white/10 text-white focus:outline-none hidden sm:flex items-center justify-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button (click)="nextSlide()" class="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-xl bg-slate-950/30 hover:bg-slate-950/60 backdrop-blur-sm border border-white/10 text-white focus:outline-none hidden sm:flex items-center justify-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        }

      </section>

      <!-- Category Navigation Grid -->
      <section class="relative bg-slate-950 py-20 overflow-hidden border-t border-slate-900">
        <!-- Subtle ambient radial lighting -->
        <div class="absolute inset-0 pointer-events-none opacity-20">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[900px] rounded-full bg-blue-600/20 blur-[130px]"></div>
        </div>

        <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-2xl mx-auto">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-400 ring-1 ring-blue-500/20 uppercase tracking-wider">
              Explora por Categorías
            </span>
            <h2 class="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl mt-3">¿Qué estás buscando hoy?</h2>
            <p class="mt-3 text-sm text-slate-400">Explora nuestro stock completo segmentado por tipo de vehículo</p>
          </div>

          <div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
          <!-- 1. Autos y Camionetas -->
          <a routerLink="/catalogo/autos"
             class="group relative flex h-72 flex-col justify-end overflow-hidden rounded-3xl bg-slate-900 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div class="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600" 
                   class="h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105" alt="Categoría Autos y Camionetas" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
            </div>
            <div class="relative z-10 text-white">
              <span class="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-1">Combustión & Familiar</span>
              <h3 class="font-heading text-2xl font-bold">Autos y Camionetas</h3>
              <p class="mt-1 text-xs text-slate-300">Sedanes, SUV, Pick-ups y vehículos familiares seleccionados.</p>
            </div>
          </a>

          <!-- 2. Autos de Gama Alta (NUEVO) -->
          <a routerLink="/catalogo/gama-alta"
             class="group relative flex h-72 flex-col justify-end overflow-hidden rounded-3xl bg-slate-900 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-amber-500/30">
            <div class="absolute inset-0 z-0">
              <img src="/categories/gama-alta.jpg" 
                   class="h-full w-full object-cover opacity-65 transition-transform duration-500 group-hover:scale-105" alt="Categoría Autos de Gama Alta" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            </div>
            <div class="relative z-10 text-white">
              <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-300 border border-amber-400/30 mb-1.5">
                ⭐ Exclusivos & Deportivos
              </span>
              <h3 class="font-heading text-2xl font-bold text-white flex items-center gap-2">
                Autos de Gama Alta
              </h3>
              <p class="mt-1 text-xs text-slate-200">Marcas premium, coupés de lujo, deportivos y superautos.</p>
            </div>
          </a>

          <!-- 3. Autos Eléctricos -->
          <a routerLink="/catalogo/autos-electricos"
             class="group relative flex h-72 flex-col justify-end overflow-hidden rounded-3xl bg-slate-900 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div class="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=600" 
                   class="h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105" alt="Categoría Autos Eléctricos" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
            </div>
            <div class="relative z-10 text-white">
              <span class="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1">Cero Emisiones</span>
              <h3 class="font-heading text-2xl font-bold flex items-center gap-2">
                Autos Eléctricos
                <span class="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </h3>
              <p class="mt-1 text-xs text-slate-300">Vehículos 100% eléctricos, híbridos y de tecnología limpia.</p>
            </div>
          </a>

          <!-- 4. Motocicletas -->
          <a routerLink="/catalogo/motos"
             class="group relative flex h-72 flex-col justify-end overflow-hidden rounded-3xl bg-slate-900 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div class="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=600" 
                   class="h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105" alt="Categoría Motos" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
            </div>
            <div class="relative z-10 text-white">
              <span class="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-1">Dos Ruedas</span>
              <h3 class="font-heading text-2xl font-bold">Motocicletas</h3>
              <p class="mt-1 text-xs text-slate-300">Deportivas, doble propósito, urbanas y eléctricas.</p>
            </div>
          </a>

          <!-- 5. Transporte Pesado -->
          <a routerLink="/catalogo/transporte-pesado"
             class="group relative flex h-72 flex-col justify-end overflow-hidden rounded-3xl bg-slate-900 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div class="absolute inset-0 z-0">
              <img src="/categories/transporte-pesado.jpg" 
                   class="h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105" alt="Categoría Transporte Pesado" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
            </div>
            <div class="relative z-10 text-white">
              <span class="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-1">Logística & Carga</span>
              <h3 class="font-heading text-2xl font-bold">Transporte Pesado</h3>
              <p class="mt-1 text-xs text-slate-300">Camiones de carga, tractocamiones, volquetas y chasis.</p>
            </div>
          </a>

          <!-- 6. Servicio de Taller y Repuestos (BenziMotor) -->
          <a routerLink="/taller-postventa"
             class="group relative flex h-72 flex-col justify-end overflow-hidden rounded-3xl bg-slate-900 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-amber-500/40">
            <div class="absolute inset-0 z-0">
              <img src="/categories/taller-postventa.jpg" 
                   class="h-full w-full object-cover opacity-65 transition-transform duration-500 group-hover:scale-105" alt="BenziMotor Taller y Repuestos" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            </div>
            <div class="relative z-10 text-white">
              <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-300 border border-amber-400/30 mb-1.5">
                🔧 BenziMotor
              </span>
              <h3 class="font-heading text-2xl font-bold text-white flex items-center justify-between">
                <span>Taller & Repuestos</span>
                <span class="text-xs bg-amber-400 text-slate-950 font-bold px-2.5 py-0.5 rounded-full">Cotizar</span>
              </h3>
              <p class="mt-1 text-xs text-slate-200">Venta de repuestos para vehículos y servicio técnico especializado.</p>
            </div>
          </a>

          </div>
        </div>
      </section>

      <!-- Featured Vehicles Slideshow Carousel (DARK STUDIO STAGE) -->
      <section class="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20 border-t border-slate-800/80 overflow-hidden">
        <!-- Ambient Stage Glow -->
        <div class="absolute inset-0 pointer-events-none opacity-20">
          <div class="absolute top-1/3 left-1/2 -translate-x-1/2 h-80 w-[700px] rounded-full bg-blue-500/15 blur-[120px]"></div>
        </div>

        <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-slate-800 pb-5">
            <div>
              <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-400 ring-1 ring-blue-500/20 uppercase tracking-wider">
                Modelos Recomendados
              </span>
              <h2 class="font-heading text-3xl font-extrabold tracking-tight text-white mt-2">Vehículos Destacados</h2>
              <p class="mt-1 text-sm text-slate-400">Nuestras recomendaciones exclusivas para ti esta semana</p>
            </div>
            <a routerLink="/catalogo" class="mt-4 sm:mt-0 inline-flex items-center gap-1 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">
              Ver catálogo completo
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <!-- Slideshow Carousel Container (4 vehicles side-by-side) -->
          <div class="mt-10 relative flex justify-center items-center w-full px-6 md:px-10 overflow-hidden">
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-7xl mx-auto">
              @for (item of visibleFeaturedVehicles(); track item.trackKey) {
                <div class="w-full transform hover:-translate-y-1 transition-transform duration-300 featured-card-animate"
                     [style.animation-delay]="($index * 0.12) + 's'"
                     [class.hidden]="$index > 0"
                     [class.sm:block]="$index === 1"
                     [class.lg:block]="$index >= 2">
                  <app-vehicle-card [vehicle]="item.vehicle"></app-vehicle-card>
                </div>
              } @empty {
                <div class="col-span-full py-12 text-center text-slate-400">
                  Cargando recomendaciones premium...
                </div>
              }
            </div>

            <!-- Navigation Buttons (Prev / Next) -->
            @if (featuredVehicles().length > 4) {
              <button (click)="prevFeaturedSlide()" 
                      class="absolute left-[-20px] sm:left-[-10px] md:left-0 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-800/90 text-white shadow-xl border border-slate-700/80 hover:bg-slate-700 focus:outline-none flex items-center justify-center transition-all cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button (click)="nextFeaturedSlide()" 
                      class="absolute right-[-20px] sm:right-[-10px] md:right-0 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-800/90 text-white shadow-xl border border-slate-700/80 hover:bg-slate-700 focus:outline-none flex items-center justify-center transition-all cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            }

          </div>

          <!-- Carousel Dots Indicators -->
          @if (featuredVehicles().length > 4) {
            <div class="mt-8 flex justify-center gap-2">
              @for (vehicle of featuredVehicles(); track vehicle.id) {
                <button (click)="setFeaturedSlide($index)" 
                        class="h-1.5 rounded-full transition-all duration-300 focus:outline-none cursor-pointer"
                        [class.w-6]="activeFeaturedSlide() === $index"
                        [class.bg-blue-500]="activeFeaturedSlide() === $index"
                        [class.w-2]="activeFeaturedSlide() !== $index"
                        [class.bg-white/20]="activeFeaturedSlide() !== $index">
                </button>
              }
            </div>
          }

        </div>
      </section>

      <!-- TRUST & SOLD VEHICLES SHOWCASE (MARKETING DE CONFIANZA & RESULTADOS) -->
      <section class="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-20 overflow-hidden border-t border-slate-800/80">
        <!-- Background subtle glow & decor -->
        <div class="absolute inset-0 pointer-events-none opacity-20">
          <div class="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl"></div>
          <div class="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/25 blur-3xl"></div>
        </div>

        <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <!-- Header de Sección -->
          <div class="text-center max-w-3xl mx-auto space-y-3">
            <span class="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-400 border border-emerald-500/25">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Resultados Verificados · Concesionaria Oficial
            </span>

            <h2 class="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Más de <span class="text-emerald-400">+{{ totalSoldCount() }} Vehículos</span> Vendidos y Entregados
            </h2>

            <p class="text-base sm:text-lg text-slate-300 leading-relaxed">
              Transparencia legal, tasación justa y la mayor velocidad de venta. Descubre por qué cientos de familias e inversionistas confían en nuestra gestión comercial.
            </p>
          </div>

          <!-- 4 Métricas de Impacto (Contadores en Banda) -->
          <div class="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <div class="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-md shadow-lg hover:border-emerald-500/40 transition-colors">
              <div class="flex items-center justify-between">
                <span class="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-400 tracking-tight">
                  +{{ totalSoldCount() }}
                </span>
                <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 text-xl">
                  🚗
                </span>
              </div>
              <h3 class="mt-3 text-sm font-bold text-white uppercase tracking-wider">Unidades Entregadas</h3>
              <p class="mt-1 text-xs text-slate-400">100% transferencias notariales concluidas y clientes satisfechos.</p>
            </div>

            <div class="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-md shadow-lg hover:border-blue-500/40 transition-colors">
              <div class="flex items-center justify-between">
                <span class="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-400 tracking-tight">
                  100%
                </span>
                <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300 text-xl">
                  🛡️
                </span>
              </div>
              <h3 class="mt-3 text-sm font-bold text-white uppercase tracking-wider">Seguridad Legal</h3>
              <p class="mt-1 text-xs text-slate-400">Cero prendas, gravámenes ni multas pendientes garantizados.</p>
            </div>

            <div class="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-md shadow-lg hover:border-amber-500/40 transition-colors">
              <div class="flex items-center justify-between">
                <span class="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-400 tracking-tight">
                  48h
                </span>
                <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 text-xl">
                  ⚡
                </span>
              </div>
              <h3 class="mt-3 text-sm font-bold text-white uppercase tracking-wider">Promedio de Cierre</h3>
              <p class="mt-1 text-xs text-slate-400">Máxima liquidez y rotación comercial de autos en consignación.</p>
            </div>

            <div class="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-md shadow-lg hover:border-purple-500/40 transition-colors">
              <div class="flex items-center justify-between">
                <span class="text-3xl sm:text-4xl lg:text-5xl font-black text-purple-400 tracking-tight">
                  4.9★
                </span>
                <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300 text-xl">
                  ⭐
                </span>
              </div>
              <h3 class="mt-3 text-sm font-bold text-white uppercase tracking-wider">Calificación Cliente</h3>
              <p class="mt-1 text-xs text-slate-400">Evaluaciones 5 estrellas por trato directo y cumplimiento.</p>
            </div>

          </div>

          <!-- Muro / Carrusel Visual de Vehículos Vendidos -->
          <div class="mt-14">
            <div class="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 class="text-xl font-bold text-white flex items-center gap-2">
                  <span>Galería de Entregas Recientes</span>
                  <span class="rounded-full bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 font-bold">Verificadas</span>
                </h3>
                <p class="text-xs text-slate-400 mt-0.5">Vehículos recientemente entregados a sus nuevos propietarios</p>
              </div>

              <!-- Flechas de navegación -->
              @if (soldVehicles().length > 3) {
                <div class="flex items-center gap-2">
                  <button (click)="prevSoldSlide()" 
                          class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                          title="Anterior entrega">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button (click)="nextSoldSlide()" 
                          class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                          title="Siguiente entrega">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              }
            </div>

            <!-- Grid de Tarjetas de Entregas -->
            <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              @for (item of visibleSoldVehicles(); track item.id) {
                <div class="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 shadow-xl transition-all duration-300 hover:border-emerald-500/50 hover:-translate-y-1">
                  
                  <!-- Imagen con Sello de Vendido -->
                  <div class="relative h-56 w-full overflow-hidden bg-slate-900">
                    <img [src]="item.imagenPrincipal" [alt]="item.nombre" 
                         class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    
                    <!-- Sello de Vendido en Esquina -->
                    <div class="absolute top-3 right-3">
                      <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-950/80 ring-2 ring-emerald-400/30">
                        <svg class="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                        Vendido & Entregado
                      </span>
                    </div>

                    <!-- Tiempo de Venta -->
                    @if (item.tiempoVenta) {
                      <div class="absolute bottom-3 left-3">
                        <span class="inline-flex items-center gap-1 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-amber-300 border border-white/10">
                          ⚡ {{ item.tiempoVenta }}
                        </span>
                      </div>
                    }
                  </div>

                  <!-- Contenido de la Tarjeta -->
                  <div class="p-5 space-y-3">
                    <div>
                      <h4 class="font-heading text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {{ item.nombre }}
                      </h4>
                      <div class="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span>📅 {{ item.anio }}</span>
                        <span>•</span>
                        <span>📍 {{ item.ubicacion || 'Cumbayá, Ecuador' }}</span>
                      </div>
                    </div>

                    <!-- Testimonio del Cliente -->
                    @if (item.testimonio) {
                      <div class="rounded-xl bg-white/5 border border-white/5 p-3 text-xs text-slate-300 italic leading-relaxed">
                        “{{ item.testimonio }}”
                      </div>
                    }

                    <div class="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                      <span class="text-slate-400 font-medium">Transacción Concluida</span>
                      <span class="font-bold text-emerald-400 flex items-center gap-1">
                        <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                        Verificado 100%
                      </span>
                    </div>
                  </div>

                </div>
              }
            </div>

            <!-- Dots Indicator -->
            @if (soldVehicles().length > 3) {
              <div class="mt-6 flex justify-center gap-2">
                @for (v of soldVehicles(); track v.id) {
                  <button (click)="setSoldSlide($index)" 
                          class="h-1.5 rounded-full transition-all duration-300 focus:outline-none cursor-pointer"
                          [class.w-6]="activeSoldIndex() === $index"
                          [class.bg-emerald-500]="activeSoldIndex() === $index"
                          [class.w-1.5]="activeSoldIndex() !== $index"
                          [class.bg-white/20]="activeSoldIndex() !== $index">
                  </button>
                }
              </div>
            }

          </div>

        </div>
      </section>

      <!-- SELL YOUR CAR (CTA DE CAPTACIÓN DE AUTOS USADOS) -->
      <section id="vende-tu-vehiculo" class="relative overflow-hidden bg-slate-950 py-20 text-white border-t border-slate-800 scroll-mt-20 transition-all duration-500">
        <!-- Background Image with Gradient Overlay -->
        <div class="absolute inset-0 z-0">
          <img src="/banners/sell-car-banner.jpg" 
               alt="Vende tu vehículo con Goldreef Autos" 
               class="h-full w-full object-cover opacity-50 sm:opacity-55 transition-opacity" />
          <div class="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40"></div>
          <div class="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950/85"></div>
          <div class="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl"></div>
          <div class="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl"></div>
        </div>

        <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <!-- Left Column: Copy & Value Proposition -->
            <div class="lg:col-span-7 space-y-6">
              <span class="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-emerald-400 ring-1 ring-emerald-500/25">
                <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Consignación & Compra Directa
              </span>

              <h2 class="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                ¿Estás pensando vender tu vehículo usado? <span class="text-emerald-400">Véndelo con nosotros.</span>
              </h2>

              <p class="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Obtén la mejor cotización con tasación inmediata, máxima seguridad legal y la rapidez que mereces. Olvídate de lidiar con desconocidos, riesgos de estafas o trámites engorrosos.
              </p>

              <!-- 4 Value Pillars Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div class="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs">
                  <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 text-lg">⚡</span>
                  <div>
                    <h4 class="text-xs font-bold text-white uppercase tracking-wider">Tasación Justa & Rápida</h4>
                    <p class="text-[11px] text-slate-400 mt-0.5">Evaluamos tu auto según el valor real de mercado.</p>
                  </div>
                </div>

                <div class="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs">
                  <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 text-lg">🛡️</span>
                  <div>
                    <h4 class="text-xs font-bold text-white uppercase tracking-wider">Seguridad Total 100%</h4>
                    <p class="text-[11px] text-slate-400 mt-0.5">Cero riesgos de estafas o cheques sin fondos.</p>
                  </div>
                </div>

                <div class="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs">
                  <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 text-lg">📢</span>
                  <div>
                    <h4 class="text-xs font-bold text-white uppercase tracking-wider">Máxima Exposición</h4>
                    <p class="text-[11px] text-slate-400 mt-0.5">Miles de compradores calificados en todo el país.</p>
                  </div>
                </div>

                <div class="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs">
                  <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 text-lg">💵</span>
                  <div>
                    <h4 class="text-xs font-bold text-white uppercase tracking-wider">Pago o Consignación</h4>
                    <p class="text-[11px] text-slate-400 mt-0.5">Compra inmediata de tu unidad o consignación flexible.</p>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap items-center gap-4 pt-4">
                <a [href]="getWhatsAppSellLink()" target="_blank"
                   class="inline-flex items-center gap-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 px-6 py-4 text-sm font-extrabold text-white shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer">
                  <svg class="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  Vender por WhatsApp Directo
                </a>

                <button (click)="openSellModal()" type="button"
                        class="inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-4 text-sm font-bold text-white transition-all cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Llenar Ficha de Tasación
                </button>
              </div>
            </div>

            <!-- Right Column: Quick Sell Card Form -->
            <div class="lg:col-span-5">
              <div class="rounded-3xl border border-white/15 bg-white/10 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
                <div class="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h3 class="text-lg font-bold text-white">Tasación Rápida</h3>
                    <p class="text-xs text-slate-300">Recibe una estimación en menos de 24 horas</p>
                  </div>
                  <span class="flex h-9 px-2.5 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold text-xs">
                    GRATIS
                  </span>
                </div>

                <form (submit)="onQuickAppraisalSubmit($event)" class="mt-6 space-y-3.5">
                  <div>
                    <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-300">Marca y Modelo *</label>
                    <input type="text" [(ngModel)]="sellVehicle" name="quickVehicle" required placeholder="Ej. Toyota Hilux o Suzuki Swift"
                           class="mt-1 w-full rounded-xl bg-slate-900/80 border border-white/15 px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400" />
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-300">Año *</label>
                      <input type="number" [(ngModel)]="sellYear" name="quickYear" required placeholder="Ej. 2021"
                             class="mt-1 w-full rounded-xl bg-slate-900/80 border border-white/15 px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400" />
                    </div>
                    <div>
                      <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-300">Kilometraje *</label>
                      <input type="text" [(ngModel)]="sellKm" name="quickKm" required placeholder="Ej. 35,000 km"
                             class="mt-1 w-full rounded-xl bg-slate-900/80 border border-white/15 px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400" />
                    </div>
                  </div>

                  <div>
                    <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-300">Tu WhatsApp de Contacto *</label>
                    <input type="tel" [(ngModel)]="sellPhone" name="quickPhone" required placeholder="Ej. +593 98 684 7543"
                           class="mt-1 w-full rounded-xl bg-slate-900/80 border border-white/15 px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400" />
                  </div>

                  <button type="submit" 
                          class="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-500/30 transition-all cursor-pointer">
                    Solicitar Cotización de Venta →
                  </button>
                  <p class="text-[10px] text-center text-slate-400">Sin compromiso · Trato directo con la concesionaria</p>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div><!-- /fin del contenedor fade-in -->

    <!-- Modal de Tasación Completa (Fuera del fade-in para que position: fixed responda exactamente al viewport visible) -->
    @if (isSellModalOpen()) {
      <div (click)="closeSellModal()"
           class="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
        <div (click)="$event.stopPropagation()"
             class="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 my-auto">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span class="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Vende Seguro</span>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Ficha de Tasación de Vehículo Usado</h3>
            </div>
            <button (click)="closeSellModal()" type="button" class="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form (submit)="onModalAppraisalSubmit($event)" class="mt-4 space-y-3.5">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400">Tu Nombre *</label>
                <input type="text" [(ngModel)]="modalName" name="mName" required placeholder="Nombre completo"
                       class="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400">WhatsApp / Teléfono *</label>
                <input type="tel" [(ngModel)]="modalPhone" name="mPhone" required placeholder="+593 98 684 7543"
                       class="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400">Marca y Modelo *</label>
                <input type="text" [(ngModel)]="modalVehicle" name="mVehicle" required placeholder="Ej. Toyota RAV4"
                       class="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400">Año *</label>
                <input type="number" [(ngModel)]="modalYear" name="mYear" required placeholder="Ej. 2022"
                       class="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400">Kilometraje *</label>
                <input type="text" [(ngModel)]="modalKm" name="mKm" required placeholder="Ej. 42,000 km"
                       class="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400">Precio Pretendido (USD)</label>
                <input type="text" [(ngModel)]="modalPrice" name="mPrice" placeholder="Ej. 25,000 USD"
                       class="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400">Detalles adicionales (Estado, mantenimientos, ciudad)</label>
              <textarea [(ngModel)]="modalNotes" name="mNotes" rows="2" placeholder="Ej. Único dueño, papeles al día, matriculado en Quito..."
                        class="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"></textarea>
            </div>

            <div class="pt-2 flex gap-3">
              <button type="button" (click)="closeSellModal()"
                      class="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                Cancelar
              </button>
              <button type="submit"
                      class="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/30 cursor-pointer">
                Enviar a Tasador →
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly vehicleService = inject(VehicleService);
  private readonly carouselService = inject(CarouselService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  // Carousel Signals
  protected readonly slides = signal<CarouselSlide[]>(DEFAULT_HERO_SLIDES);
  protected readonly activeSlide = signal(0);
  protected readonly loadingSlides = signal(false);
  private carouselIntervalId: any = null;

  // Featured Vehicles Carousel Signals
  protected readonly activeFeaturedSlide = signal(0);
  private featuredIntervalId: any = null;

  // Featured Vehicles
  protected readonly featuredVehicles = computed(() =>
    this.vehicleService.vehicles().filter(v => v.destacado)
  );

  protected readonly visibleFeaturedVehicles = computed(() => {
    const list = this.featuredVehicles();
    if (list.length === 0) return [];

    const index = this.activeFeaturedSlide();
    const count = list.length;

    const items = count <= 4 ? list : [
      list[index % count],
      list[(index + 1) % count],
      list[(index + 2) % count],
      list[(index + 3) % count]
    ];

    // Unique key per rotation so Angular re-creates the DOM elements
    return items.map((v, i) => ({ vehicle: v, trackKey: `${index}-${i}` }));
  });

  // Sold Vehicles Showcase Signals
  protected readonly soldData = signal<SoldShowcaseData | null>(null);
  protected readonly activeSoldIndex = signal(0);
  private soldIntervalId: any = null;

  protected readonly totalSoldCount = computed(() => this.soldData()?.totalSold || 28);
  protected readonly soldVehicles = computed(() => this.soldData()?.vehicles || []);

  protected readonly visibleSoldVehicles = computed(() => {
    const list = this.soldVehicles();
    if (list.length === 0) return [];
    const count = list.length;
    if (count <= 3) return list;

    const idx = this.activeSoldIndex();
    return [
      list[idx % count],
      list[(idx + 1) % count],
      list[(idx + 2) % count]
    ];
  });

  protected readonly contactForm: FormGroup;
  protected readonly formEnviado = signal(false);

  constructor() {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  public async ngOnInit(): Promise<void> {
    await Promise.all([
      this.loadCarouselData(),
      this.vehicleService.refreshVehicles(false),
      this.loadSoldData()
    ]);
    this.startCarousel();
    this.startFeaturedCarousel();
    this.startSoldCarousel();

    this.route.fragment.subscribe(fragment => {
      if (fragment === 'vende-tu-vehiculo' || fragment === 'tasacion') {
        setTimeout(() => this.scrollToSellSection(), 450);
      }
    });
  }

  protected scrollToSellSection(): void {
    if (typeof window !== 'undefined') {
      const el = document.getElementById('vende-tu-vehiculo');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('ring-4', 'ring-emerald-500/50', 'transition-all');
        setTimeout(() => {
          el.classList.remove('ring-4', 'ring-emerald-500/50');
        }, 2200);
      }
    }
  }

  public ngOnDestroy(): void {
    this.stopCarousel();
    this.stopFeaturedCarousel();
    this.stopSoldCarousel();
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  private async loadSoldData(): Promise<void> {
    try {
      const data = await this.vehicleService.getSoldShowcase();
      this.soldData.set(data);
    } catch (err) {
      console.error('Error al cargar datos de vehículos vendidos:', err);
    }
  }

  private startSoldCarousel(): void {
    if (typeof window !== 'undefined') {
      this.soldIntervalId = setInterval(() => {
        this.nextSoldSlide();
      }, 6000);
    }
  }

  private stopSoldCarousel(): void {
    if (this.soldIntervalId) {
      clearInterval(this.soldIntervalId);
    }
  }

  protected setSoldSlide(index: number): void {
    this.activeSoldIndex.set(index);
    this.stopSoldCarousel();
    this.startSoldCarousel();
  }

  protected prevSoldSlide(): void {
    const count = this.soldVehicles().length;
    if (count <= 1) return;
    const current = this.activeSoldIndex();
    const prev = current === 0 ? count - 1 : current - 1;
    this.activeSoldIndex.set(prev);
    this.stopSoldCarousel();
    this.startSoldCarousel();
  }

  protected nextSoldSlide(): void {
    const count = this.soldVehicles().length;
    if (count <= 1) return;
    const current = this.activeSoldIndex();
    const next = current === count - 1 ? 0 : current + 1;
    this.activeSoldIndex.set(next);
    this.stopSoldCarousel();
    this.startSoldCarousel();
  }

  private async loadCarouselData(): Promise<void> {
    try {
      const data = await this.carouselService.getSlides();
      if (data && data.length > 0) {
        this.slides.set(data);
      }
    } catch (err) {
      console.warn('Backend aún conectándose, utilizando portadas base:', err);
    } finally {
      this.loadingSlides.set(false);
    }
  }

  // Carousel Methods
  private startCarousel(): void {
    if (typeof window !== 'undefined') {
      this.carouselIntervalId = setInterval(() => {
        this.nextSlide();
      }, 7000);
    }
  }

  private stopCarousel(): void {
    if (this.carouselIntervalId) {
      clearInterval(this.carouselIntervalId);
    }
  }

  protected setSlide(index: number): void {
    this.activeSlide.set(index);
    this.stopCarousel();
    this.startCarousel();
  }

  protected prevSlide(): void {
    const current = this.activeSlide();
    const prev = current === 0 ? this.slides().length - 1 : current - 1;
    this.activeSlide.set(prev);
    this.stopCarousel();
    this.startCarousel();
  }

  protected nextSlide(): void {
    const current = this.activeSlide();
    if (this.slides().length > 0) {
      const next = current === this.slides().length - 1 ? 0 : current + 1;
      this.activeSlide.set(next);
    }
  }

  // Featured Carousel Slideshow Helper Methods
  private startFeaturedCarousel(): void {
    if (typeof window !== 'undefined') {
      this.featuredIntervalId = setInterval(() => {
        this.nextFeaturedSlide();
      }, 5000);
    }
  }

  private stopFeaturedCarousel(): void {
    if (this.featuredIntervalId) {
      clearInterval(this.featuredIntervalId);
    }
  }

  protected setFeaturedSlide(index: number): void {
    this.activeFeaturedSlide.set(index);
    this.stopFeaturedCarousel();
    this.startFeaturedCarousel();
  }

  protected prevFeaturedSlide(): void {
    const current = this.activeFeaturedSlide();
    const count = this.featuredVehicles().length;
    if (count === 0) return;
    const prev = current === 0 ? count - 1 : current - 1;
    this.activeFeaturedSlide.set(prev);
    this.stopFeaturedCarousel();
    this.startFeaturedCarousel();
  }

  protected nextFeaturedSlide(): void {
    const current = this.activeFeaturedSlide();
    const count = this.featuredVehicles().length;
    if (count === 0) return;
    const next = current === count - 1 ? 0 : current + 1;
    this.activeFeaturedSlide.set(next);
    this.stopFeaturedCarousel();
    this.startFeaturedCarousel();
  }

  // Search Submit
  protected onSearch(event: Event, query: string): void {
    event.preventDefault();
    const cleanQuery = query.trim();
    if (cleanQuery) {
      this.router.navigate(['/catalogo'], { queryParams: { buscar: cleanQuery } });
    } else {
      this.router.navigate(['/catalogo']);
    }
  }

  // Contact Form Submit
  protected onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Mensaje de contacto enviado:', this.contactForm.value);
      this.formEnviado.set(true);
      setTimeout(() => {
        this.contactForm.reset();
        this.formEnviado.set(false);
      }, 5000);
    }
  }

  protected isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  // Captación y Venta de Vehículos Usados
  protected readonly contact = COMPANY_CONTACT;
  protected sellVehicle = '';
  protected sellYear = '';
  protected sellKm = '';
  protected sellPhone = '';

  protected readonly isSellModalOpen = signal(false);
  protected modalName = '';
  protected modalPhone = '';
  protected modalVehicle = '';
  protected modalYear = '';
  protected modalKm = '';
  protected modalPrice = '';
  protected modalNotes = '';

  protected openSellModal(): void {
    this.isSellModalOpen.set(true);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  protected closeSellModal(): void {
    this.isSellModalOpen.set(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  protected getWhatsAppSellLink(): string {
    return buildWhatsAppUrl(WHATSAPP_MESSAGES.sellUsedInitial(), this.contact.adminPhone);
  }

  protected onQuickAppraisalSubmit(event: Event): void {
    event.preventDefault();
    const text = WHATSAPP_MESSAGES.sellUsedQuick({
      vehicle: this.sellVehicle,
      year: this.sellYear,
      km: this.sellKm,
      phone: this.sellPhone
    });
    openWhatsAppDirect(text, this.contact.adminPhone);
  }

  protected onModalAppraisalSubmit(event: Event): void {
    event.preventDefault();
    const text = WHATSAPP_MESSAGES.sellUsedFull({
      name: this.modalName,
      phone: this.modalPhone,
      vehicle: this.modalVehicle,
      year: this.modalYear,
      km: this.modalKm,
      price: this.modalPrice,
      notes: this.modalNotes
    });

    openWhatsAppDirect(text, this.contact.adminPhone);
    this.closeSellModal();
  }
}

