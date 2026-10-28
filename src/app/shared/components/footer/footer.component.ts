import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COMPANY_CONTACT, WHATSAPP_MESSAGES, buildWhatsAppUrl } from '../../../core/constants/company-contact.constant';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-slate-950 text-slate-400 border-t border-slate-800/80 transition-colors">
      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        
        <!-- Main Footer Grid (Compact 3 Columns) -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          <!-- Col 1: Brand & Social (4/12) -->
          <div class="md:col-span-4 space-y-3">
            <a routerLink="/" class="inline-block group">
              <img src="/logo-goldreef-horizontal.png" alt="Goldreef Autos" class="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105" />
            </a>
            <p class="text-xs text-slate-400 leading-relaxed max-w-sm">
              Concesionaria boutique de autos de alta gama, multimarca y eléctricos. Certificación técnica, tasación inmediata y seguridad jurídica.
            </p>
            <!-- Compact Social Row -->
            <div class="flex items-center gap-3 pt-1">
              <a href="#" class="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors" title="Facebook">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
              </a>
              <a href="#" class="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors" title="Instagram">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <span class="text-[11px] text-slate-500">Cumbayá, Quito</span>
            </div>
          </div>

          <!-- Col 2: Navigation & Quick Links (4/12) -->
          <div class="md:col-span-4 grid grid-cols-2 gap-4">
            <div>
              <p class="font-heading text-xs font-bold uppercase tracking-wider text-white">Inventario</p>
              <nav class="mt-2.5 flex flex-col gap-1.5 text-xs">
                <a routerLink="/catalogo/gama-alta" class="hover:text-white transition-colors flex items-center gap-1">
                  <span>Gama Alta</span>
                  <span class="text-[9px] px-1 rounded bg-amber-500/10 text-amber-400 font-bold">LUJO</span>
                </a>
                <a routerLink="/catalogo/autos" class="hover:text-white transition-colors">Autos & SUV</a>
                <a routerLink="/catalogo/autos-electricos" class="hover:text-white transition-colors">Eléctricos</a>
                <a routerLink="/catalogo/motos" class="hover:text-white transition-colors">Motos</a>
                <a routerLink="/catalogo/transporte-pesado" class="hover:text-white transition-colors">Pesados</a>
              </nav>
            </div>
            <div>
              <p class="font-heading text-xs font-bold uppercase tracking-wider text-white">Servicios</p>
              <nav class="mt-2.5 flex flex-col gap-1.5 text-xs">
                <a routerLink="/taller-postventa" class="hover:text-white transition-colors text-amber-400 font-medium">Taller BenziMotor</a>
                <a routerLink="/catalogo" class="hover:text-white transition-colors">Catálogo Completo</a>
                <a routerLink="/comparador" class="hover:text-white transition-colors">Comparador</a>
                <a routerLink="/contacto" class="hover:text-white transition-colors">Ubicación & Sede</a>
                <a routerLink="/" fragment="vende-tu-vehiculo" class="hover:text-emerald-400 transition-colors font-semibold">Vender mi Auto</a>
              </nav>
            </div>
          </div>

          <!-- Col 3: Sede & Asesores Directos (4/12) -->
          <div class="md:col-span-4 space-y-2.5">
            <p class="font-heading text-xs font-bold uppercase tracking-wider text-white">Atención & WhatsApp</p>
            
            <div class="rounded-2xl bg-slate-900/80 border border-slate-800 p-3 space-y-2 text-xs">
              <!-- Asesores WhatsApp -->
              <div class="space-y-1.5">
                @for (adv of contact.advisors; track adv.id) {
                  <a [href]="adv.waUrl" target="_blank" 
                     class="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors group">
                    <span class="flex items-center gap-1.5 font-medium">
                      <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      <span>{{ adv.name }}</span>
                    </span>
                    <span class="text-[11px] font-mono text-emerald-400 group-hover:underline">{{ adv.phoneDisplay }}</span>
                  </a>
                }
              </div>

              <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span class="truncate" [title]="contact.address">📍 {{ contact.address }}</span>
              </div>
            </div>

            <p class="text-[11px] text-slate-500">
              Lun - Vie: 9:00 - 19:30 · Sáb: 10:00 - 14:00
            </p>
          </div>

        </div>

        <!-- Bottom Copyright & Developer Credit Bar -->
        <div class="mt-8 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>&copy; 2026 Goldreef Autos S.A. (goldreefautos.com)</p>
          
          <!-- Compact Developer Badge -->
          <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            <span>Desarrollado por <strong class="text-white font-bold">365 SOFT</strong></span>
          </div>

          <div class="flex items-center gap-4 text-xs">
            <a routerLink="/terminos" class="hover:text-slate-300 transition-colors">Términos</a>
            <span>•</span>
            <a routerLink="/privacidad" class="hover:text-slate-300 transition-colors">Privacidad</a>
          </div>
        </div>

      </div>
    </footer>
  `,
  styles: ``
})
export class FooterComponent {
  protected readonly contact = COMPANY_CONTACT;
  protected readonly whatsAppAdminUrl = buildWhatsAppUrl(WHATSAPP_MESSAGES.adminDirect(), COMPANY_CONTACT.adminPhone);
  protected readonly whatsAppSupportUrl = buildWhatsAppUrl('Hola soporte de Goldreef Autos, requiero asistencia técnica.', COMPANY_CONTACT.supportPhone);
}
