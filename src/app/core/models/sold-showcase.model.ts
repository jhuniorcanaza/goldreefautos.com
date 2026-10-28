export interface SoldVehicleItem {
  id: string;
  nombre: string;
  marca: string;
  modelo: string;
  anio: number;
  precio?: number | string;
  moneda?: string;
  imagenPrincipal: string;
  ubicacion?: string;
  fechaVenta?: string;
  tiempoVenta?: string;
  testimonio?: string;
  badge?: string;
}

export interface SoldShowcaseData {
  totalSold: number;
  realSoldCount: number;
  baseCount: number;
  vehicles: SoldVehicleItem[];
}
