import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { WhatsAppFloatingComponent } from './shared/components/whatsapp-floating/whatsapp-floating.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, WhatsAppFloatingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App implements OnInit {
  protected readonly title = signal('ConcesionariaApp');
  /**
   * Estado de suspensión del servidor.
   * Por defecto en true (suspendido). También consulta /service-status.json en tiempo real
   * para poder reactivar o suspender desde la VPS en 1 segundo sin recompilar.
   */
  protected readonly isServiceSuspended = signal<boolean>(true);

  public ngOnInit(): void {
    if (typeof window !== 'undefined') {
      fetch(`/service-status.json?t=${Date.now()}`, { cache: 'no-store' })
        .then(res => (res.ok ? res.json() : null))
        .then(data => {
          if (data && typeof data.suspended === 'boolean') {
            this.isServiceSuspended.set(data.suspended);
          }
        })
        .catch(() => {
          // Mantiene el valor por defecto
        });
    }
  }
}
