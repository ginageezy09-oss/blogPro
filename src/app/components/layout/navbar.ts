import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <nav class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-2">
          <a routerLink="/" class="flex items-center gap-2 font-serif text-2xl font-bold tracking-tight text-gray-900">
            <mat-icon class="text-indigo-600">article</mat-icon>
            <span>BlogPersonal</span>
          </a>
        </div>
        
        <div class="hidden md:flex md:items-center md:gap-8">
          <a routerLink="/" routerLinkActive="text-indigo-600" [routerLinkActiveOptions]="{exact: true}" class="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
            Inicio
          </a>
          <a routerLink="/about" routerLinkActive="text-indigo-600" class="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
            Sobre Mí
          </a>
          <a routerLink="/admin" routerLinkActive="text-indigo-600" class="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
            Admin
          </a>
        </div>

        <div class="flex items-center gap-4">
          <button class="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <mat-icon>search</mat-icon>
          </button>
          <a routerLink="/login" class="hidden rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors md:block">
            Login
          </a>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {}
