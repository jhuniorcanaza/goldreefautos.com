import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

const loadCatalog = () => import('./features/catalog/catalog.component').then(m => m.CatalogComponent);
const loadAdminForm = () => import('./features/admin/form/form.component').then(m => m.AdminFormComponent);

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent 
  },
  { 
    path: 'catalogo', 
    loadComponent: loadCatalog
  },
  { 
    path: 'catalogo/autos', 
    loadComponent: loadCatalog,
    data: { category: 'autos', title: 'Autos y Camionetas' }
  },
  { 
    path: 'catalogo/gama-alta', 
    loadComponent: loadCatalog,
    data: { category: 'autos_gama_alta', title: 'Autos de Gama Alta' }
  },
  { 
    path: 'catalogo/autos-electricos', 
    loadComponent: loadCatalog,
    data: { category: 'autos_electricos', title: 'Autos Eléctricos' }
  },
  { 
    path: 'catalogo/motos', 
    loadComponent: loadCatalog,
    data: { category: 'motos', title: 'Motocicletas' }
  },
  { 
    path: 'catalogo/motos-electricas', 
    loadComponent: loadCatalog,
    data: { category: 'motos_electricos', title: 'Motos Eléctricas' }
  },
  { 
    path: 'catalogo/transporte-pesado', 
    loadComponent: loadCatalog,
    data: { category: 'transporte_pesado', title: 'Transporte Pesado' }
  },
  { 
    path: 'catalogo/maquinaria-agricola', 
    loadComponent: loadCatalog,
    data: { category: 'maquinaria_agricola', title: 'Maquinaria Pesada' }
  },
  {
    path: 'taller-postventa',
    loadComponent: () => import('./features/workshop/workshop.component').then(m => m.WorkshopComponent),
    title: 'Servicio de Taller y Postventa'
  },
  { 
    path: 'vehiculo/:id', 
    loadComponent: () => import('./features/detail/detail.component').then(m => m.DetailComponent)
  },
  { 
    path: 'comparador', 
    loadComponent: () => import('./features/comparison/comparison.component').then(m => m.ComparisonComponent)
  },
  { 
    path: 'favoritos', 
    loadComponent: () => import('./features/favorites/favorites.component').then(m => m.FavoritesComponent)
  },
  { 
    path: 'contacto', 
    loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent)
  },
  { 
    path: 'autenticacion', 
    loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent)
  },
  // Rutas de administración protegidas por autenticación y roles de admin
  { 
    path: 'admin', 
    loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard, roleGuard] 
  },
  { 
    path: 'admin/crear', 
    loadComponent: loadAdminForm,
    canActivate: [authGuard] 
  },
  { 
    path: 'admin/editar/:id', 
    loadComponent: loadAdminForm,
    canActivate: [authGuard] 
  },
  { 
    path: 'admin/especificaciones', 
    loadComponent: () => import('./features/admin/specifications/specifications-admin.component').then(m => m.SpecificationsAdminComponent),
    canActivate: [authGuard, roleGuard] 
  },
  { 
    path: 'admin/usuarios', 
    loadComponent: () => import('./features/admin/users/users-admin.component').then(m => m.UsersAdminComponent),
    canActivate: [authGuard, roleGuard] 
  },
  { 
    path: 'admin/carrusel', 
    loadComponent: () => import('./features/admin/carousel/carousel-admin.component').then(m => m.CarouselAdminComponent),
    canActivate: [authGuard, roleGuard] 
  },
  { 
    path: 'planes', 
    redirectTo: '' 
  },
  { 
    path: 'mis-publicaciones', 
    loadComponent: () => import('./features/my-listings/my-listings.component').then(m => m.MyListingsComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'terminos', 
    loadComponent: () => import('./features/legal/terms.component').then(m => m.TermsComponent)
  },
  { 
    path: 'privacidad', 
    loadComponent: () => import('./features/legal/privacy.component').then(m => m.PrivacyComponent)
  },
  // Comodín para redirigir rutas no encontradas al inicio
  { 
    path: '**', 
    redirectTo: '' 
  }
];
