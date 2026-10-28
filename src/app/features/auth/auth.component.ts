import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex items-center justify-center fade-in">
      <div class="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-xl transition-colors">
        
        <!-- Header Toggle tabs -->
        <div class="flex border-b border-slate-100 dark:border-slate-800 pb-4">
          <button (click)="setMode(true)" 
                  class="w-1/2 text-center pb-2.5 font-heading text-base font-bold transition-all border-b-2 focus:outline-none cursor-pointer"
                  [class.border-blue-600]="isLoginMode()"
                  [class.text-blue-600]="isLoginMode()"
                  [class.dark:text-blue-400]="isLoginMode()"
                  [class.border-transparent]="!isLoginMode()"
                  [class.text-slate-400]="!isLoginMode()"
                  [class.dark:text-slate-500]="!isLoginMode()">
            Iniciar Sesión
          </button>
          <button (click)="setMode(false)" 
                  class="w-1/2 text-center pb-2.5 font-heading text-base font-bold transition-all border-b-2 focus:outline-none cursor-pointer"
                  [class.border-blue-600]="!isLoginMode()"
                  [class.text-blue-600]="!isLoginMode()"
                  [class.dark:text-blue-400]="!isLoginMode()"
                  [class.border-transparent]="isLoginMode()"
                  [class.text-slate-400]="isLoginMode()"
                  [class.dark:text-slate-500]="isLoginMode()">
            Registrarse
          </button>
        </div>
 
        <!-- Alert Error -->
        @if (errorMessage()) {
          <div class="mt-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-3.5 text-rose-800 dark:text-rose-300 text-xs flex gap-2.5 items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span class="leading-relaxed">{{ errorMessage() }}</span>
          </div>
        }
 
        <!-- Forms Area -->
        @if (isLoginMode()) {
          
          <!-- LOGIN FORM (Para todos los 4 roles) -->
          <form [formGroup]="loginForm" (ngSubmit)="onLoginSubmit()" class="mt-6 space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Correo Electrónico</label>
              <input type="email" formControlName="email" placeholder="ejemplo@correo.com"
                     class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none transition-colors" />
            </div>
            
            <div>
              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Contraseña</label>
              <input type="password" formControlName="contrasenia" placeholder="••••••••"
                     class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none transition-colors" />
            </div>

            <p class="text-[11px] text-slate-400 dark:text-slate-500">
              Acceso unificado para Clientes, Agentes, Concesionarias y Administradores.
            </p>
 
            <button type="submit" [disabled]="loginForm.invalid"
                    class="w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-500 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed">
              Ingresar a la Plataforma
            </button>
          </form>
 
        } @else {
          
          <!-- REGISTER FORM (Solo Clientes) -->
          <form [formGroup]="registerForm" (ngSubmit)="onRegisterSubmit()" class="mt-6 space-y-4">
            <div class="rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 p-3 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <span class="inline-flex h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
              <span class="font-medium">Registro de Cuenta de Cliente (Gratis)</span>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Nombre Completo</label>
              <input type="text" formControlName="nombre" placeholder="Tu nombre y apellido"
                     class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none transition-colors" />
            </div>
 
            <div>
              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Correo Electrónico</label>
              <input type="email" formControlName="email" placeholder="tu@correo.com"
                     class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none transition-colors" />
            </div>
 
            <div>
              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Contraseña (Mínimo 6 caracteres)</label>
              <input type="password" formControlName="contrasenia" placeholder="Crea una contraseña segura"
                     class="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none transition-colors" />
            </div>

            <p class="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
              💡 Con tu cuenta podrás guardar favoritos, comparar modelos y publicar tus vehículos a la venta en Goldreef Autos.
            </p>
 
            <button type="submit" [disabled]="registerForm.invalid"
                    class="w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-500 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed">
              Crear Cuenta Gratis
            </button>
          </form>
          
        }
 
      </div>
    </div>
  `
})
export class AuthComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
 
  protected readonly isLoginMode = signal(true);
  protected readonly errorMessage = signal<string>('');
 
  protected readonly loginForm: FormGroup;
  protected readonly registerForm: FormGroup;
 
  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasenia: ['', [Validators.required]]
    });
 
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contrasenia: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
 
  protected setMode(login: boolean): void {
    this.isLoginMode.set(login);
    this.errorMessage.set('');
    this.loginForm.reset();
    this.registerForm.reset();
  }
 
  protected async onLoginSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      const { email, contrasenia } = this.loginForm.value;
      const success = await this.authService.login(email, contrasenia);
      if (success) {
        this.errorMessage.set('');
        const user = this.authService.currentUser();
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else if (user?.rol === 'cliente') {
          this.router.navigate(['/mis-publicaciones']);
        } else {
          this.router.navigate(['/mis-publicaciones']);
        }
      } else {
        this.errorMessage.set('Credenciales inválidas. Por favor intenta de nuevo.');
      }
    }
  }
 
  protected async onRegisterSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      const { nombre, email, contrasenia } = this.registerForm.value;
      // Registro público crea exclusivamente cuentas de rol 'cliente'
      const success = await this.authService.register(nombre, email, contrasenia, 'cliente');
      if (success) {
        this.errorMessage.set('');
        this.router.navigate(['/mis-publicaciones']);
      } else {
        this.errorMessage.set('Error en el registro. Verifica los datos ingresados o el correo ya registrado.');
      }
    }
  }
}
