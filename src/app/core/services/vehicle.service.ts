import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from '../models/vehicle.model';
import { SoldShowcaseData, SoldVehicleItem } from '../models/sold-showcase.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/vehicles';

  private readonly vehiclesSignal = signal<Vehicle[]>([]);
  public readonly vehicles = this.vehiclesSignal.asReadonly();

  private readonly storageKey = 'concesionaria_vehicles_cache';

  constructor() {
    this.loadFromCache();
    this.initVehicles();
  }

  private loadFromCache(): void {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(this.storageKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.vehiclesSignal.set(parsed);
          }
        }
      } catch {
        // Ignorar error de parsing
      }
    }
  }

  private saveToCache(data: Vehicle[]): void {
    if (typeof window !== 'undefined' && data && data.length > 0) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
      } catch {
        // Ignorar cuota excedida
      }
    }
  }

  private async initVehicles(): Promise<void> {
    await this.refreshVehicles();
  }

  public async refreshVehicles(includePending: boolean = false): Promise<void> {
    try {
      const url = includePending ? `${this.apiUrl}?includePending=true` : this.apiUrl;
      const data = await firstValueFrom(this.http.get<Vehicle[]>(url));
      if (data && data.length > 0) {
        this.vehiclesSignal.set(data);
        if (!includePending) {
          this.saveToCache(data);
        }
        return;
      }
    } catch (err) {
      console.warn('Backend aún iniciando o no accesible por el proxy. Usando caché local...', err);
    }

    // Fallback seguro: Si no hay vehículos en memoria ni caché, cargar catálogo mock
    if (this.vehiclesSignal().length === 0) {
      try {
        const localData = await firstValueFrom(this.http.get<Vehicle[]>('/mock-data/vehicles.json'));
        if (localData && localData.length > 0) {
          this.vehiclesSignal.set(localData);
          this.saveToCache(localData);
        }
      } catch (fallbackErr) {
        console.error('Error al cargar datos de respaldo:', fallbackErr);
      }
    }
  }


  public getVehicles(): Vehicle[] {
    return this.vehicles();
  }

  public async getVehicleById(id: string): Promise<Vehicle | undefined> {
    try {
      return await firstValueFrom(this.http.get<Vehicle>(`${this.apiUrl}/${id}`));
    } catch (err) {
      console.error('Error al obtener vehículo:', err);
      return undefined;
    }
  }

  public async getMyListings(): Promise<Vehicle[]> {
    try {
      return await firstValueFrom(this.http.get<Vehicle[]>(`${this.apiUrl}/my-listings`));
    } catch (err) {
      console.error('Error al obtener mis publicaciones:', err);
      return [];
    }
  }

  public async createVehicle(vehicle: Omit<Vehicle, 'id' | 'fechaIngreso'>): Promise<boolean> {
    try {
      await firstValueFrom(this.http.post<Vehicle>(this.apiUrl, vehicle));
      await this.refreshVehicles();
      return true;
    } catch (err: any) {
      console.error('Error al crear vehículo:', err);
      const message = err.error?.message ? (Array.isArray(err.error.message) ? err.error.message.join(', ') : err.error.message) : (err.message || 'Error del servidor');
      throw new Error(message);
    }
  }

  public async updateVehicle(id: string, vehicle: Partial<Vehicle>): Promise<boolean> {
    try {
      await firstValueFrom(this.http.patch<Vehicle>(`${this.apiUrl}/${id}`, vehicle));
      await this.refreshVehicles();
      return true;
    } catch (err: any) {
      console.error('Error al actualizar vehículo:', err);
      const message = err.error?.message ? (Array.isArray(err.error.message) ? err.error.message.join(', ') : err.error.message) : (err.message || 'Error del servidor');
      throw new Error(message);
    }
  }

  public async approveVehicle(id: string): Promise<boolean> {
    try {
      await firstValueFrom(this.http.patch<Vehicle>(`${this.apiUrl}/${id}`, { estado: 'disponible' }));
      await this.refreshVehicles(true);
      return true;
    } catch (err: any) {
      console.error('Error al dar el GO al vehículo:', err);
      const message = err.error?.message ? (Array.isArray(err.error.message) ? err.error.message.join(', ') : err.error.message) : (err.message || 'Error al aprobar vehículo');
      throw new Error(message);
    }
  }

  public async deleteVehicle(id: string): Promise<boolean> {
    try {
      await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
      await this.refreshVehicles();
      return true;
    } catch (err: any) {
      console.error('Error al eliminar vehículo:', err);
      const message = err.error?.message ? (Array.isArray(err.error.message) ? err.error.message.join(', ') : err.error.message) : (err.message || 'Error del servidor');
      throw new Error(message);
    }
  }

  public async getLiquidations(): Promise<Vehicle[]> {
    try {
      return await firstValueFrom(this.http.get<Vehicle[]>(`${this.apiUrl}/admin/liquidations`));
    } catch (err) {
      console.error('Error al obtener liquidaciones:', err);
      return [];
    }
  }

  public async updateCommissionPayment(id: string, comisionPagada: boolean, notasLiquidacion?: string): Promise<boolean> {
    try {
      await firstValueFrom(this.http.patch<Vehicle>(`${this.apiUrl}/${id}/pago-comision`, {
        comisionPagada,
        notasLiquidacion
      }));
      await this.refreshVehicles();
      return true;
    } catch (err) {
      console.error('Error al actualizar estado de pago de comisión:', err);
      return false;
    }
  }

  public async getSoldShowcase(): Promise<SoldShowcaseData> {
    const fallbackDeliveries: SoldVehicleItem[] = [
      {
        id: 'sold-01',
        nombre: 'Toyota Hilux 4x4 SRX',
        marca: 'Toyota',
        modelo: 'Hilux SRX',
        anio: 2023,
        precio: 46500,
        moneda: 'USD',
        imagenPrincipal: '/vehicles/auto-01.jpg',
        ubicacion: 'Cochabamba · Casa Matriz',
        fechaVenta: 'Octubre 2026',
        tiempoVenta: 'Vendido en 48 horas',
        testimonio: 'Excelente asesoramiento notarial y rapidez en el desembolso.',
        badge: 'ENTREGADO'
      },
      {
        id: 'sold-02',
        nombre: 'Ford Mustang GT V8 5.0L',
        marca: 'Ford',
        modelo: 'Mustang GT',
        anio: 2022,
        precio: 52000,
        moneda: 'USD',
        imagenPrincipal: '/vehicles/auto-03.jpg',
        ubicacion: 'Santa Cruz · Equipetrol',
        fechaVenta: 'Octubre 2026',
        tiempoVenta: 'Vendido en 72 horas',
        testimonio: 'Cero riesgos de estafa. Vendieron mi auto al precio justo.',
        badge: 'ENTREGADO'
      },
      {
        id: 'sold-03',
        nombre: 'Suzuki Jimny AllGrip 4x4',
        marca: 'Suzuki',
        modelo: 'Jimny Sierra',
        anio: 2023,
        precio: 24500,
        moneda: 'USD',
        imagenPrincipal: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
        ubicacion: 'La Paz · Calacoto',
        fechaVenta: 'Septiembre 2026',
        tiempoVenta: 'Vendido en 24 horas',
        testimonio: 'Muy satisfecho con la inspección y formalidad.',
        badge: 'ENTREGADO'
      },
      {
        id: 'sold-04',
        nombre: 'Tesla Model Y Dual Motor AWD',
        marca: 'Tesla',
        modelo: 'Model Y Long Range',
        anio: 2024,
        precio: 54900,
        moneda: 'USD',
        imagenPrincipal: '/vehicles/auto-ev-01.jpg',
        ubicacion: 'Cumbayá · Casa Matriz',
        fechaVenta: 'Septiembre 2026',
        tiempoVenta: 'Vendido en 5 días',
        testimonio: 'La plataforma más profesional para vehículos de última generación.',
        badge: 'ENTREGADO'
      },
      {
        id: 'sold-05',
        nombre: 'BMW Serie 3 330i M Sport',
        marca: 'BMW',
        modelo: 'Serie 3 330i',
        anio: 2023,
        precio: 59000,
        moneda: 'USD',
        imagenPrincipal: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
        ubicacion: 'Santa Cruz · Urubó',
        fechaVenta: 'Agosto 2026',
        tiempoVenta: 'Vendido en 3 días',
        testimonio: 'Proceso impecable de entrega e intermediación.',
        badge: 'ENTREGADO'
      }
    ];

    try {
      const res = await firstValueFrom(this.http.get<SoldShowcaseData>(`${this.apiUrl}/sold/showcase`));
      if (res) {
        const mergedVehicles = [
          ...(res.vehicles || []).map(v => ({
            ...v,
            badge: 'ENTREGADO',
            tiempoVenta: v.tiempoVenta || 'Venta Verificada'
          })),
          ...fallbackDeliveries
        ];
        const unique = Array.from(new Map(mergedVehicles.map(item => [item.id, item])).values());
        return {
          totalSold: Math.max(res.totalSold || 28, 28 + (res.realSoldCount || 0)),
          realSoldCount: res.realSoldCount || 0,
          baseCount: res.baseCount || 28,
          vehicles: unique.slice(0, 8)
        };
      }
    } catch (err) {
      console.warn('Endpoint /sold/showcase no disponible aún, usando catálogo local:', err);
    }

    return {
      totalSold: 28,
      realSoldCount: 0,
      baseCount: 28,
      vehicles: fallbackDeliveries
    };
  }
}

