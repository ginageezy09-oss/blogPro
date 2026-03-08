import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <footer class="border-t border-gray-200 bg-white">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div class="flex items-center gap-2 font-serif text-xl font-bold text-gray-900">
              <mat-icon class="text-indigo-600">article</mat-icon>
              <span>BlogPersonal</span>
            </div>
            <p class="mt-4 text-sm text-gray-500 max-w-xs">
              Un espacio para compartir ideas, historias y conocimientos. 
              Explora nuestros artículos y únete a la conversación.
            </p>
          </div>
          
          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-900">Enlaces</h3>
            <ul class="mt-4 space-y-4">
              <li><a href="#" class="text-sm text-gray-500 hover:text-indigo-600">Inicio</a></li>
              <li><a href="#" class="text-sm text-gray-500 hover:text-indigo-600">Sobre Mí</a></li>
              <li><a href="#" class="text-sm text-gray-500 hover:text-indigo-600">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-900">Suscríbete</h3>
            <p class="mt-4 text-sm text-gray-500">Recibe las últimas noticias y artículos directamente en tu bandeja de entrada.</p>
            <form class="mt-4 flex gap-2">
              <input type="email" placeholder="tu@email.com" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <button type="submit" class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                OK
              </button>
            </form>
          </div>
        </div>
        <div class="mt-12 border-t border-gray-200 pt-8 text-center">
          <p class="text-sm text-gray-400">&copy; 2024 BlogPersonal. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
