import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly apiUrl = '/api/favorites';
  
  private readonly favoritesSignal = signal<string[]>([]);
  public readonly favorites = this.favoritesSignal.asReadonly();
  
  public readonly favoritesCount = computed(() => this.favorites().length);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.loadFavoritesFromApi(user.id);
      } else {
        // Al no haber usuario logueado, favoritos está estrictamente vacío
        this.favoritesSignal.set([]);
      }
    });
  }

  private getUserStorageKey(userId: string): string {
    return `concesionaria_favorites_${userId}`;
  }

  private loadFavoritesFromLocalStorage(userId: string): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.getUserStorageKey(userId));
      if (stored) {
        try {
          this.favoritesSignal.set(JSON.parse(stored));
        } catch (e) {
          console.error('Error al cargar favoritos locales del usuario', e);
        }
      } else {
        this.favoritesSignal.set([]);
      }
    }
  }

  private async loadFavoritesFromApi(userId: string): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<string[]>(this.apiUrl));
      this.favoritesSignal.set(data || []);
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.getUserStorageKey(userId), JSON.stringify(data || []));
      }
    } catch (err) {
      console.warn('API de favoritos no disponible temporalmente, cargando caché local del usuario:', err);
      this.loadFavoritesFromLocalStorage(userId);
    }
  }

  public isFavorite(vehicleId: string): boolean {
    return this.favorites().includes(vehicleId);
  }

  public async toggleFavorite(vehicleId: string): Promise<boolean> {
    const user = this.authService.currentUser();
    
    // Si no está logueado, prohibir agregar a favoritos y redirigir al login
    if (!user) {
      this.router.navigate(['/autenticacion']);
      return false;
    }

    try {
      const response = await firstValueFrom(
        this.http.post<{ favorited: boolean }>(`${this.apiUrl}/${vehicleId}`, {})
      );
      
      const current = this.favorites();
      const updated = response.favorited
        ? [...current, vehicleId]
        : current.filter(id => id !== vehicleId);
        
      this.favoritesSignal.set(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.getUserStorageKey(user.id), JSON.stringify(updated));
      }
      return true;
    } catch (err) {
      console.error('Error al alternar favorito en API:', err);
      return false;
    }
  }

  public async removeFavorite(vehicleId: string): Promise<void> {
    const user = this.authService.currentUser();
    if (!user) {
      this.favoritesSignal.set([]);
      return;
    }

    try {
      const current = this.favorites();
      if (current.includes(vehicleId)) {
        await this.toggleFavorite(vehicleId);
      }
    } catch (err) {
      console.error('Error al remover favorito:', err);
    }
  }
}
