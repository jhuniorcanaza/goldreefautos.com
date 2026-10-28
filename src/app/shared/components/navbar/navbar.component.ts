import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FavoriteService } from '../../../core/services/favorite.service';
import { ComparisonService } from '../../../core/services/comparison.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div class="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 xl:px-8 gap-3 xl:gap-5">
        
        <!-- Logo -->
        <a routerLink="/" class="flex items-center gap-2 group shrink-0">
          <img src="/logo-goldreef-horizontal.png" alt="Goldreef Autos" class="h-9 sm:h-11 xl:h-12 w-auto object-contain transition-transform group-hover:scale-105" />
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden xl:flex items-center gap-2 xl:gap-3.5 2xl:gap-5">
          <a routerLink="/" routerLinkActive="text-blue-600 dark:text-blue-400 font-semibold" [routerLinkActiveOptions]="{exact: true}"
             class="text-xs xl:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap">Inicio</a>
          
          <!-- Dropdown Catálogo -->
          <div class="relative group py-2">
            <button class="inline-flex items-center gap-1 text-xs xl:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer focus:outline-none whitespace-nowrap">
              <span>Catálogo</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- Dropdown Menu Card -->
            <div class="absolute left-1/2 -translate-x-1/2 top-full z-50 w-56 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
              <a routerLink="/catalogo" routerLinkActive="bg-slate-50 dark:bg-slate-850 text-blue-600 dark:text-blue-400 font-semibold" [routerLinkActiveOptions]="{exact: true}"
                 class="block rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Todos los Vehículos
              </a>
              <div class="my-1 border-t border-slate-100 dark:border-slate-800"></div>
              <a routerLink="/catalogo/autos" routerLinkActive="bg-slate-50 dark:bg-slate-850 text-blue-600 dark:text-blue-400 font-semibold"
                 class="block rounded-xl px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Autos y Camionetas
              </a>
              <a routerLink="/catalogo/gama-alta" routerLinkActive="bg-slate-50 dark:bg-slate-850 text-blue-600 dark:text-blue-400 font-semibold"
                 class="block rounded-xl px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5">
                Autos de Gama Alta
                <span class="inline-flex rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1 py-0.2 text-[9px] font-bold">LUJO</span>
              </a>
              <a routerLink="/catalogo/autos-electricos" routerLinkActive="bg-slate-50 dark:bg-slate-850 text-blue-600 dark:text-blue-400 font-semibold"
                 class="block rounded-xl px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5">
                Autos Eléctricos
                <span class="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </a>
              <a routerLink="/catalogo/motos" routerLinkActive="bg-slate-50 dark:bg-slate-850 text-blue-600 dark:text-blue-400 font-semibold"
                 class="block rounded-xl px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Motocicletas
              </a>
              <a routerLink="/catalogo/motos-electricas" routerLinkActive="bg-slate-50 dark:bg-slate-850 text-blue-600 dark:text-blue-400 font-semibold"
                 class="block rounded-xl px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5">
                Motos Eléctricas
                <span class="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </a>
              <a routerLink="/catalogo/transporte-pesado" routerLinkActive="bg-slate-50 dark:bg-slate-850 text-blue-600 dark:text-blue-400 font-semibold"
                 class="block rounded-xl px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Transporte Pesado
              </a>
            </div>
          </div>

          <a routerLink="/taller-postventa" routerLinkActive="text-blue-600 dark:text-blue-400 font-semibold"
             class="text-xs xl:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 whitespace-nowrap">
            <span class="hidden xl:inline">Taller & Repuestos</span>
            <span class="xl:hidden">Taller</span>
          </a>

          <button (click)="navigateToSell()" type="button"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 xl:px-3 xl:py-1.5 rounded-full text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 shrink-0 whitespace-nowrap">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Vender mi Auto</span>
          </button>

          <a routerLink="/comparador" routerLinkActive="text-blue-600 dark:text-blue-400 font-semibold"
             class="text-xs xl:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 whitespace-nowrap"
             title="Comparador de Vehículos">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span class="hidden 2xl:inline">Comparar</span>
            @if (comparisonCount() > 0) {
              <span class="flex h-4 w-4 xl:h-5 xl:w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">{{ comparisonCount() }}</span>
            }
          </a>

          <a routerLink="/favoritos" routerLinkActive="text-blue-600 dark:text-blue-400 font-semibold"
             class="text-xs xl:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 whitespace-nowrap"
             title="Mis Favoritos">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span class="hidden 2xl:inline">Favoritos</span>
            @if (favoriteCount() > 0) {
              <span class="flex h-4 w-4 xl:h-5 xl:w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">{{ favoriteCount() }}</span>
            }
          </a>

          <a routerLink="/contacto" routerLinkActive="text-blue-600 dark:text-blue-400 font-semibold"
             class="text-xs xl:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap">Contacto</a>

          @if (authService.currentUser() && !authService.isAdmin()) {
            <a routerLink="/mis-publicaciones" routerLinkActive="text-blue-600 dark:text-blue-400 font-semibold"
                class="text-xs xl:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap">Mis Publicaciones</a>
          }
        </nav>

        <!-- Desktop CTA / User Profile / Admin Panel -->
        <div class="hidden xl:flex items-center gap-2 xl:gap-3 shrink-0">
          @if (authService.currentUser()) {
            <!-- Admin Panel Button -->
            @if (authService.isAdmin()) {
              <a routerLink="/admin"
                 class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 xl:px-4 xl:py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/25 border border-blue-400/30 transition-all hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Panel Admin</span>
              </a>
            } @else {
              <a routerLink="/mis-publicaciones" class="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap">
                Mis Publicaciones
              </a>
              <a routerLink="/admin/crear" class="text-xs font-semibold text-white bg-blue-600 px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-xl hover:bg-blue-500 transition-colors shadow-sm whitespace-nowrap">
                + Publicar
              </a>
            }

            <!-- User Menu -->
            <div class="flex items-center gap-2 xl:gap-2.5 border-l border-slate-200 dark:border-slate-800 pl-2 xl:pl-3 shrink-0">
              <div class="flex flex-col text-right">
                <span class="text-xs font-semibold text-slate-900 dark:text-white max-w-[90px] xl:max-w-[130px] truncate" [title]="authService.currentUser()?.nombre">
                  {{ authService.currentUser()?.nombre }}
                </span>
                <span class="text-[10px] text-blue-500 dark:text-blue-400 capitalize font-medium">
                  {{ authService.currentUser()?.rol }}
                </span>
              </div>
              <button (click)="logout()" class="p-1.5 xl:p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-950 hover:bg-red-500/10 transition-all shrink-0 cursor-pointer" title="Cerrar Sesión">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 xl:h-5 xl:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          } @else {
            <a routerLink="/autenticacion" class="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 px-3.5 py-2 xl:px-4 xl:py-2.5 text-xs xl:text-sm font-semibold text-white shadow-sm transition-colors whitespace-nowrap">
              Iniciar Sesión
            </a>
          }
        </div>

        <!-- Mobile Controls & Menu Toggle Button (Screens < lg) -->
        <div class="flex xl:hidden items-center gap-2">
          <button (click)="navigateToSell()" type="button"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 shrink-0">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Vender</span>
          </button>

          @if (favoriteCount() > 0) {
            <a routerLink="/favoritos" class="relative p-2 text-slate-500 dark:text-slate-400">
              <span class="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">{{ favoriteCount() }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </a>
          }
          
          <button (click)="toggleMenu()" class="rounded-xl p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none cursor-pointer" aria-label="Abrir menú de navegación">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              @if (isMenuOpen()) {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              } @else {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

      </div>

      <!-- Mobile Menu Panel -->
      @if (isMenuOpen()) {
        <div class="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 xl:hidden space-y-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          
          @if (authService.currentUser() && authService.isAdmin()) {
            <!-- Admin Featured Access Card in Mobile -->
            <a routerLink="/admin" (click)="closeMenu()"
               class="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 shadow-lg shadow-blue-500/25 border border-blue-400/40 hover:brightness-110 transition-all">
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div class="text-sm font-bold">Panel de Administración</div>
                  <div class="text-[11px] text-blue-200 font-normal">Gestionar inventario, carrusel y usuarios</div>
                </div>
              </div>
              <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-white/20 tracking-wider">ADMIN</span>
            </a>
          }

          <a routerLink="/" (click)="closeMenu()" class="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900">Inicio</a>
          
          <!-- Catálogo con sub-items en móvil -->
          <div class="space-y-1">
            <div class="flex items-center justify-between px-3 py-2 text-base font-semibold text-slate-700 dark:text-slate-200">
              <span>Catálogo</span>
              <a routerLink="/catalogo" (click)="closeMenu()" class="text-xs text-blue-600 hover:underline">Ver Todo</a>
            </div>
            <div class="pl-4 border-l-2 border-slate-100 dark:border-slate-800 ml-3 space-y-1.5">
              <a routerLink="/catalogo/autos" (click)="closeMenu()" class="block py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600">Autos y Camionetas</a>
              <a routerLink="/catalogo/gama-alta" (click)="closeMenu()" class="block py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600">Autos de Gama Alta</a>
              <a routerLink="/catalogo/autos-electricos" (click)="closeMenu()" class="block py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 flex items-center gap-1.5">
                Autos Eléctricos
                <span class="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              </a>
              <a routerLink="/catalogo/motos" (click)="closeMenu()" class="block py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600">Motocicletas</a>
              <a routerLink="/catalogo/motos-electricas" (click)="closeMenu()" class="block py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 flex items-center gap-1.5">
                Motos Eléctricas
                <span class="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              </a>
              <a routerLink="/catalogo/transporte-pesado" (click)="closeMenu()" class="block py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600">Transporte Pesado</a>
            </div>
          </div>

          <a routerLink="/taller-postventa" (click)="closeMenu()" class="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900">Taller & Repuestos (BenziMotor)</a>

          <button (click)="navigateToSell()" type="button"
                  class="w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 text-left transition-colors cursor-pointer">
            <span class="flex items-center gap-2">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Vender mi Auto (Tasación)
            </span>
            <span class="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-emerald-500 text-white shadow-sm">Tasación $0</span>
          </button>

          <a routerLink="/comparador" (click)="closeMenu()" class="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900">Comparar ({{ comparisonCount() }})</a>
          <a routerLink="/favoritos" (click)="closeMenu()" class="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900">Favoritos ({{ favoriteCount() }})</a>
          <a routerLink="/contacto" (click)="closeMenu()" class="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900">Contacto</a>

          @if (authService.currentUser() && !authService.isAdmin()) {
            <a routerLink="/mis-publicaciones" (click)="closeMenu()" class="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900">Mis Publicaciones</a>
            <a routerLink="/admin/crear" (click)="closeMenu()" class="block rounded-lg px-3 py-2 text-base font-medium text-white bg-blue-600 text-center hover:bg-blue-500">Publicar Vehículo</a>
          }

          <hr class="border-slate-100 dark:border-slate-800">

          @if (authService.currentUser()) {
            <div class="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
              <div>
                <div class="text-sm font-semibold text-slate-900 dark:text-white">{{ authService.currentUser()?.nombre }}</div>
                <div class="text-xs text-slate-500 dark:text-slate-400">{{ authService.currentUser()?.email }}</div>
              </div>
              <button (click)="logout()" class="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 px-3 py-1.5 rounded-lg cursor-pointer transition-colors">Cerrar Sesión</button>
            </div>
          } @else {
            <a routerLink="/autenticacion" (click)="closeMenu()" class="block text-center rounded-xl bg-blue-600 px-4 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-blue-500">
              Iniciar Sesión
            </a>
          }
        </div>
      }
    </header>
  `
})
export class NavbarComponent {
  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
  private readonly favoriteService = inject(FavoriteService);
  private readonly comparisonService = inject(ComparisonService);
  private readonly router = inject(Router);

  protected readonly isMenuOpen = signal(false);
  protected readonly favoriteCount = this.favoriteService.favoritesCount;
  protected readonly comparisonCount = this.comparisonService.count;

  protected toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected navigateToSell(): void {
    this.closeMenu();
    const currentUrl = this.router.url.split('?')[0].split('#')[0];
    if (currentUrl === '' || currentUrl === '/') {
      const el = typeof document !== 'undefined' ? document.getElementById('vende-tu-vehiculo') : null;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('ring-4', 'ring-emerald-500/50', 'transition-all');
        setTimeout(() => {
          el.classList.remove('ring-4', 'ring-emerald-500/50');
        }, 2200);
      }
    } else {
      this.router.navigate(['/'], { fragment: 'vende-tu-vehiculo' });
    }
  }

  protected logout(): void {
    this.authService.logout();
    this.comparisonService.clear();
    this.closeMenu();
    this.router.navigate(['/']);
  }
}
