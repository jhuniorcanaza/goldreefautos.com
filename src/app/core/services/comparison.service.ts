import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Router } from '@angular/router';
import { Vehicle } from '../models/vehicle.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ComparisonService {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly comparedSignal = signal<Vehicle[]>([]);
  public readonly comparedVehicles = this.comparedSignal.asReadonly();
  
  public readonly count = computed(() => this.comparedSignal().length);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.loadUserComparison(user.id);
      } else {
        // Al no haber usuario logueado, comparador está estrictamente vacío
        this.comparedSignal.set([]);
      }
    });
  }

  private getUserStorageKey(userId: string): string {
    return `concesionaria_compare_${userId}`;
  }

  private loadUserComparison(userId: string): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.getUserStorageKey(userId));
      if (stored) {
        try {
          this.comparedSignal.set(JSON.parse(stored));
        } catch {
          this.comparedSignal.set([]);
        }
      }
    }
  }

  private saveUserComparison(userId: string, vehicles: Vehicle[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getUserStorageKey(userId), JSON.stringify(vehicles));
    }
  }

  public addVehicle(vehicle: Vehicle): boolean {
    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/autenticacion']);
      return false;
    }

    const current = this.comparedSignal();
    
    // Validar si ya está agregado
    if (current.some(v => v.id === vehicle.id)) {
      return false;
    }
    
    // Limitar a máximo 3 vehículos
    if (current.length >= 3) {
      return false;
    }

    const updated = [...current, vehicle];
    this.comparedSignal.set(updated);
    this.saveUserComparison(user.id, updated);
    return true;
  }

  public removeVehicle(vehicleId: string): void {
    const user = this.authService.currentUser();
    const current = this.comparedSignal();
    const updated = current.filter(v => v.id !== vehicleId);
    this.comparedSignal.set(updated);
    if (user) {
      this.saveUserComparison(user.id, updated);
    }
  }

  public toggleComparison(vehicle: Vehicle): boolean {
    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/autenticacion']);
      return false;
    }

    const current = this.comparedSignal();
    if (current.some(v => v.id === vehicle.id)) {
      this.removeVehicle(vehicle.id);
      return true;
    } else {
      return this.addVehicle(vehicle);
    }
  }

  public isCompared(vehicleId: string): boolean {
    return this.comparedSignal().some(v => v.id === vehicleId);
  }

  public clear(): void {
    const user = this.authService.currentUser();
    this.comparedSignal.set([]);
    if (user && typeof window !== 'undefined') {
      localStorage.removeItem(this.getUserStorageKey(user.id));
    }
  }
}
