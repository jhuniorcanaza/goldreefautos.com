import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../core/services/favorite.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { AuthService } from '../../core/services/auth.service';
import { VehicleCardComponent } from '../../shared/components/vehicle-card/vehicle-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, VehicleCardComponent],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 fade-in">
      
      <!-- Header -->
      <div class="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 class="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">Mis Vehículos Favoritos</h1>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Tus vehículos guardados de forma segura en tu cuenta personal</p>
      </div>

      @if (!authService.isLoggedIn()) {
        <!-- Unauthenticated State -->
        <div class="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl mt-8 bg-white dark:bg-slate-900 max-w-xl mx-auto px-6">
          <div class="h-16 w-16 mx-auto rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 class="font-heading text-xl font-bold text-slate-900 dark:text-white mt-5">Inicia sesión para ver tus favoritos</h2>
          <p class="text-slate-500 dark:text-slate-400 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
            Los favoritos están asociados a tu cuenta de cliente de forma privada para que nunca se mezclen con otros dispositivos o usuarios.
          </p>
          <div class="mt-6 flex justify-center gap-3">
            <a routerLink="/autenticacion" class="inline-flex items-center rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition-colors">
              Iniciar Sesión / Registrarme
            </a>
          </div>
        </div>
      } @else if (favoriteVehicles().length > 0) {
        <!-- Grid list of favorites -->
        <div class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          @for (vehicle of favoriteVehicles(); track vehicle.id) {
            <app-vehicle-card [vehicle]="vehicle"></app-vehicle-card>
          }
        </div>
      } @else {
        <!-- Empty State -->
        <div class="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl mt-8 bg-white dark:bg-slate-900 max-w-xl mx-auto px-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 class="font-heading text-xl font-bold text-slate-900 dark:text-white mt-5">Sin favoritos guardados</h2>
          <p class="text-slate-500 dark:text-slate-400 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
            Aún no has guardado ningún vehículo en tu cuenta. Explora nuestro catálogo y presiona el botón de corazón para guardarlos aquí.
          </p>
          <a routerLink="/catalogo" class="mt-6 inline-flex items-center rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-500 transition-colors">
            Explorar Catálogo
          </a>
        </div>
      }

    </div>
  `
})
export class FavoritesComponent {
  protected readonly authService = inject(AuthService);
  private readonly favoriteService = inject(FavoriteService);
  private readonly vehicleService = inject(VehicleService);

  // Cross reference IDs with full objects reactively
  protected readonly favoriteVehicles = computed(() => {
    const ids = this.favoriteService.favorites();
    const all = this.vehicleService.vehicles();
    return all.filter(v => ids.includes(v.id));
  });
}
