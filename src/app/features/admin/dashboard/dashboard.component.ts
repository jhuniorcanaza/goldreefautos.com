import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle, getCategoryLabel } from '../../../core/models/vehicle.model';
import { SaleClosureModalComponent } from '../../../shared/components/sale-closure-modal/sale-closure-modal.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CurrencyPipe, SaleClosureModalComponent],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 fade-in">
      
      <!-- Admin Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 class="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">Panel de Administración</h1>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Moderación de publicaciones, control de inventario y visto bueno (GO) a vehículos de clientes</p>
        </div>
        
        <div class="flex flex-wrap gap-2 shrink-0">
          <a routerLink="/admin/usuarios" 
             class="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-1.5 h-4 w-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Usuarios
          </a>
          <a routerLink="/admin/carrusel" 
             class="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-1.5 h-4 w-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Portadas
          </a>
          <a routerLink="/admin/especificaciones" 
             class="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-1.5 h-4 w-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Características
          </a>
          <a routerLink="/admin/crear" 
             class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Vehículo
          </a>
        </div>
      </div>

      <!-- Filters & Stats Cards -->
      <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        <!-- Total -->
        <div (click)="setFilter('all')" 
             class="rounded-2xl border p-5 transition-all cursor-pointer shadow-sm"
             [class]="selectedFilter() === 'all' ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/30 dark:bg-blue-950/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Inventario</span>
          <p class="font-heading text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{{ totalCount() }} unidades</p>
          <span class="text-[11px] text-slate-500 dark:text-slate-400 mt-2 block">Ver todo el catálogo</span>
        </div>

        <!-- Pendientes de Aprobación (GO) -->
        <div (click)="setFilter('pendiente')" 
             class="rounded-2xl border p-5 transition-all cursor-pointer shadow-sm relative overflow-hidden"
             [class]="selectedFilter() === 'pendiente' ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-50/50 dark:bg-amber-950/30' : 'border-amber-200/80 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/10 hover:border-amber-400'">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Pendientes de Aprobación</span>
            @if (pendingCount() > 0) {
              <span class="inline-flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            }
          </div>
          <p class="font-heading text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            {{ pendingCount() }} pendientes
          </p>
          <span class="text-[11px] font-semibold text-amber-700/80 dark:text-amber-300/80 mt-2 block">
            {{ pendingCount() > 0 ? '⚠️ Requieren Dar el GO' : '✓ Todo al día' }}
          </span>
        </div>

        <!-- Destacados -->
        <div (click)="setFilter('disponible')" 
             class="rounded-2xl border p-5 transition-all cursor-pointer shadow-sm"
             [class]="selectedFilter() === 'disponible' ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Publicados / Activos</span>
          <p class="font-heading text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{{ activeCount() }} disponibles</p>
          <span class="text-[11px] text-slate-500 dark:text-slate-400 mt-2 block">{{ featuredCount() }} en portada Home</span>
        </div>

        <!-- Vendidos -->
        <div (click)="setFilter('vendido')" 
             class="rounded-2xl border p-5 transition-all cursor-pointer shadow-sm"
             [class]="selectedFilter() === 'vendido' ? 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-50/30 dark:bg-purple-950/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Cerrados / Vendidos</span>
          <p class="font-heading text-2xl font-extrabold text-slate-700 dark:text-slate-300 mt-1">{{ soldCount() }} unidades</p>
          <span class="text-[11px] text-slate-500 dark:text-slate-400 mt-2 block">Con comisiones liquidadas</span>
        </div>

      </div>

      <!-- Action & Filter Bar -->
      <div class="mt-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-100 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        
        <!-- Filter Tabs -->
        <div class="flex flex-wrap gap-1.5 w-full md:w-auto">
          <button (click)="setFilter('all')" 
                  class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  [class]="selectedFilter() === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'">
            Todos ({{ totalCount() }})
          </button>
          <button (click)="setFilter('pendiente')" 
                  class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  [class]="selectedFilter() === 'pendiente' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'">
            @if (pendingCount() > 0) {
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            }
            ⏳ Por Aprobar ({{ pendingCount() }})
          </button>
          <button (click)="setFilter('disponible')" 
                  class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  [class]="selectedFilter() === 'disponible' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'">
            Disponibles ({{ activeCount() }})
          </button>
          <button (click)="setFilter('vendido')" 
                  class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  [class]="selectedFilter() === 'vendido' ? 'bg-slate-700 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'">
            Vendidos ({{ soldCount() }})
          </button>
        </div>

        <!-- Search Bar -->
        <div class="relative w-full md:max-w-xs">
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" [(ngModel)]="searchQuery" placeholder="Buscar por marca, modelo..." 
                 class="w-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500" />
        </div>

      </div>

      <!-- Inventory Table -->
      <div class="mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
            <thead class="bg-slate-50 dark:bg-slate-950/60">
              <tr>
                <th scope="col" class="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vehículo</th>
                <th scope="col" class="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categoría</th>
                <th scope="col" class="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Precio (USD)</th>
                <th scope="col" class="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Destacado</th>
                <th scope="col" class="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                <th scope="col" class="relative px-6 py-3.5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Acciones / Moderación
                </th>
              </tr>
            </thead>
            
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              @for (v of filteredVehicles(); track v.id) {
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    [class.bg-amber-500/5]="v.estado === 'pendiente'">
                  
                  <!-- Product Identity -->
                  <td class="whitespace-nowrap px-6 py-4">
                    <div class="flex items-center gap-3">
                      <img [src]="v.imagenPrincipal || '/placeholder.jpg'" 
                           [alt]="v.nombre"
                           class="h-12 w-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0" />
                      <div>
                        <div class="font-bold text-sm text-slate-900 dark:text-white">{{ v.nombre }}</div>
                        <div class="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{{ v.marca }} {{ v.modelo }} ({{ v.anio }})</span>
                          <span>·</span>
                          <span class="capitalize">{{ v.condicion }}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Category -->
                  <td class="whitespace-nowrap px-6 py-4">
                    <span class="inline-flex items-center rounded-lg bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10">
                      {{ getCategoryLabel(v.categoria) }}
                    </span>
                  </td>
                  
                  <!-- Price -->
                  <td class="whitespace-nowrap px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                    {{ ((v.moneda === 'BOB') ? (v.precio / 6.96) : v.precio) | currency:'USD':'$ ':'1.0-0' }} USD
                  </td>
                  
                  <!-- Featured Checkbox -->
                  <td class="whitespace-nowrap px-6 py-4">
                    <button (click)="toggleFeatured(v.id, v.destacado)" 
                            class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                            [class.text-amber-500]="v.destacado"
                            [class.text-slate-300]="!v.destacado"
                            [class.dark:text-slate-600]="!v.destacado"
                            title="Alternar destacado en inicio">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" [attr.fill]="v.destacado ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.252.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.77-.558-.371-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>
                  </td>

                  <!-- Status Select & Commission -->
                  <td class="whitespace-nowrap px-6 py-4">
                    <select [ngModel]="v.estado" (ngModelChange)="changeStatus(v.id, $event)"
                            class="rounded-lg border px-2.5 py-1 text-xs font-semibold focus:outline-none transition-colors shadow-2xs cursor-pointer"
                            [class]="statusSelectClass(v.estado)">
                      <option value="pendiente">⏳ Pendiente</option>
                      <option value="disponible">🟢 Disponible</option>
                      <option value="reservado">Reservado</option>
                      <option value="vendido">Vendido</option>
                    </select>

                    @if (v.estado === 'vendido' && v.comisionTotal) {
                      <div class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                        Comisión 3%: {{ ((v.moneda === 'BOB') ? (v.comisionTotal / 6.96) : v.comisionTotal) | currency:'USD':'$ ':'1.0-0' }} USD
                      </div>
                    }
                  </td>

                  <!-- Actions buttons & GO workflow -->
                  <td class="whitespace-nowrap px-6 py-4 text-right text-xs font-medium space-x-2">
                    
                    <!-- BOTÓN PROMINENTE DAR EL GO (APROBAR) -->
                    @if (v.estado === 'pendiente') {
                      <button (click)="darElGo(v)" 
                              class="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 font-bold text-white shadow-md shadow-emerald-600/30 transition-all cursor-pointer animate-bounce hover:animate-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Dar el GO (Aprobar)</span>
                      </button>
                    }

                    <a [routerLink]="['/admin/editar', v.id]" 
                       class="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors">
                      Editar
                    </a>
                    
                    <button (click)="deleteItem(v.id, v.nombre)" 
                            class="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50/50 hover:border-red-200 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-950/20 dark:hover:border-red-900/50 shadow-sm transition-colors cursor-pointer">
                      Eliminar
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No se encontraron vehículos para el filtro seleccionado.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

    </div><!-- /fin del div fade-in -->

    <!-- Toast Feedback -->
    @if (toast()) {
      <div class="fixed bottom-6 right-6 z-[10000] flex items-center gap-3 rounded-2xl px-5 py-4 shadow-2xl border"
           [class.bg-emerald-950]="toast()?.type === 'success'"
           [class.border-emerald-800]="toast()?.type === 'success'"
           [class.text-emerald-200]="toast()?.type === 'success'"
           [class.bg-rose-950]="toast()?.type === 'error'"
           [class.border-rose-800]="toast()?.type === 'error'"
           [class.text-rose-200]="toast()?.type === 'error'">
        @if (toast()?.type === 'success') {
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        } @else {
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        <span class="text-sm font-semibold">{{ toast()?.message }}</span>
      </div>
    }

    <!-- MODAL CONFIRMACIÓN ELIMINACIÓN -->
    @if (deleteTarget()) {
      <div class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-transparent pointer-events-none">
        <div class="fixed inset-0 bg-transparent pointer-events-auto" (click)="cancelDelete()"></div>
        <div class="relative z-10 pointer-events-auto w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-[0_8px_40px_rgba(0,0,0,0.2)] border border-slate-200 dark:border-slate-800">
          <div class="flex items-start gap-3">
            <div class="h-9 w-9 rounded-full bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">¿Eliminar vehículo del inventario?</h3>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Se eliminará permanentemente <strong class="text-slate-700 dark:text-slate-200">"{{ deleteTarget()?.name }}"</strong>. Esta acción no se puede deshacer.
              </p>
            </div>
          </div>

          <div class="mt-4 flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button type="button" (click)="cancelDelete()" [disabled]="isDeleting()"
                    class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer">
              Cancelar
            </button>
            <button type="button" (click)="confirmDelete()" [disabled]="isDeleting()"
                    class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-60 cursor-pointer">
              @if (isDeleting()) {
                <span class="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Eliminando...</span>
              } @else {
                <span>Sí, Eliminar</span>
              }
            </button>
          </div>
        </div>
      </div>
    }

    <!-- MODAL DE CIERRE DE VENTA Y LIQUIDACIÓN -->
    <app-sale-closure-modal
      [isOpen]="saleTarget() !== null"
      [vehicle]="saleTarget()"
      [isSubmitting]="isSaleSubmitting()"
      (cancel)="closeSaleModal()"
      (confirmed)="handleSaleConfirmed($event)">
    </app-sale-closure-modal>
  `
})
export class AdminDashboardComponent implements OnInit {
  private readonly vehicleService = inject(VehicleService);
  protected readonly getCategoryLabel = getCategoryLabel;

  public async ngOnInit(): Promise<void> {
    // Carga inventario completo incluyendo pendientes para que el administrador los modere
    await this.vehicleService.refreshVehicles(true);
  }

  protected readonly searchQuery = signal('');
  protected readonly selectedFilter = signal<'all' | 'pendiente' | 'disponible' | 'vendido'>('all');

  protected readonly deleteTarget = signal<{ id: string; name: string } | null>(null);
  protected readonly isDeleting = signal(false);
  protected readonly toast = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sale Modal state
  protected readonly saleTarget = signal<Vehicle | null>(null);
  protected readonly isSaleSubmitting = signal(false);

  protected readonly allVehicles = this.vehicleService.vehicles;

  protected readonly totalCount = computed(() => this.allVehicles().length);
  protected readonly pendingCount = computed(() => this.allVehicles().filter(v => v.estado === 'pendiente').length);
  protected readonly activeCount = computed(() => this.allVehicles().filter(v => v.estado === 'disponible').length);
  protected readonly featuredCount = computed(() => this.allVehicles().filter(v => v.destacado).length);
  protected readonly soldCount = computed(() => this.allVehicles().filter(v => v.estado === 'vendido').length);

  protected readonly filteredVehicles = computed(() => {
    let list = this.allVehicles();
    const filter = this.selectedFilter();
    if (filter !== 'all') {
      list = list.filter(v => v.estado === filter);
    }

    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return list;
    
    return list.filter(v => 
      v.nombre.toLowerCase().includes(query) ||
      v.marca.toLowerCase().includes(query) ||
      v.modelo.toLowerCase().includes(query) ||
      v.categoria.toLowerCase().includes(query)
    );
  });

  protected setFilter(filter: 'all' | 'pendiente' | 'disponible' | 'vendido'): void {
    this.selectedFilter.set(filter);
  }

  protected async toggleFeatured(id: string, current: boolean): Promise<void> {
    try {
      await this.vehicleService.updateVehicle(id, { destacado: !current });
      this.showToast('success', 'Visibilidad destacada actualizada.');
    } catch (err: any) {
      this.showToast('error', err.message || 'Error al actualizar visibilidad.');
    }
  }

  // ACCIÓN "DAR EL GO": Aprueba directamente el vehículo haciéndolo disponible
  protected async darElGo(v: Vehicle): Promise<void> {
    try {
      await this.vehicleService.approveVehicle(v.id);
      this.showToast('success', `¡GO concedido! "${v.nombre}" ahora está publicado y visible en el catálogo de Goldreef Autos.`);
    } catch (err: any) {
      this.showToast('error', err.message || 'Error al otorgar el GO.');
    }
  }

  protected async changeStatus(id: string, newStatus: 'disponible' | 'reservado' | 'vendido' | 'pendiente'): Promise<void> {
    if (newStatus === 'vendido') {
      const v = this.allVehicles().find(x => x.id === id);
      if (v && !v.beneficioEntregado) {
        this.saleTarget.set(v);
        return;
      }
    }

    try {
      await this.vehicleService.updateVehicle(id, { estado: newStatus });
      this.showToast('success', `Estado cambiado a ${newStatus}.`);
    } catch (err: any) {
      this.showToast('error', err.message || 'Error al cambiar estado.');
    }
  }

  protected closeSaleModal(): void {
    if (!this.isSaleSubmitting()) {
      this.saleTarget.set(null);
    }
  }

  protected async handleSaleConfirmed(event: {
    vehicleId: string;
    precioVenta: number;
    vendedorId?: string;
    isShared: boolean;
  }): Promise<void> {
    this.isSaleSubmitting.set(true);
    try {
      const payload: any = {
        estado: 'vendido',
        precioVenta: event.precioVenta,
      };
      if (event.vendedorId) {
        payload.vendedorId = event.vendedorId;
      }
      await this.vehicleService.updateVehicle(event.vehicleId, payload);
      this.saleTarget.set(null);
      this.showToast('success', '¡Venta registrada con éxito y comisiones liquidadas!');
    } catch (err: any) {
      console.error('Error al registrar venta:', err);
      this.showToast('error', err.message || 'Error al procesar la venta.');
    } finally {
      this.isSaleSubmitting.set(false);
    }
  }

  protected deleteItem(id: string, name: string): void {
    this.deleteTarget.set({ id, name });
  }

  protected cancelDelete(): void {
    if (!this.isDeleting()) {
      this.deleteTarget.set(null);
    }
  }

  protected async confirmDelete(): Promise<void> {
    const target = this.deleteTarget();
    if (!target) return;

    this.isDeleting.set(true);
    try {
      await this.vehicleService.deleteVehicle(target.id);
      this.deleteTarget.set(null);
      this.showToast('success', `El vehículo "${target.name}" fue eliminado correctamente.`);
    } catch (err: any) {
      console.error('Error al eliminar vehículo:', err);
      this.showToast('error', err.message || 'No se pudo eliminar el vehículo.');
    } finally {
      this.isDeleting.set(false);
    }
  }

  private showToast(type: 'success' | 'error', message: string): void {
    this.toast.set({ type, message });
    setTimeout(() => {
      this.toast.set(null);
    }, 4500);
  }

  protected statusSelectClass(status: string): string {
    if (status === 'disponible') return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
    if (status === 'pendiente') return 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
    if (status === 'reservado') return 'text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800';
    return 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800';
  }
}
