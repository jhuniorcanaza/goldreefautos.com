import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public readonly isDarkMode = signal<boolean>(true);

  constructor() {
    if (typeof window !== 'undefined') {
      // La página siempre inicia en modo oscuro
      this.isDarkMode.set(true);
      this.applyTheme(true);
      localStorage.setItem('theme', 'dark');
    } else {
      this.isDarkMode.set(true);
    }
  }

  public toggleTheme(): void {
    const nextState = !this.isDarkMode();
    this.isDarkMode.set(nextState);
    this.applyTheme(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', nextState ? 'dark' : 'light');
    }
  }

  private applyTheme(isDark: boolean): void {
    if (typeof document !== 'undefined') {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
}
