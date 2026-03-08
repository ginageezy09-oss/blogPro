import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Acceso al panel administrativo
          </p>
        </div>
        <form class="mt-8 space-y-6" (ngSubmit)="handleLogin()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email-address" class="sr-only">Email</label>
              <input id="email-address" name="email" type="email" autocomplete="email" required [(ngModel)]="email"
                     class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                     placeholder="Email address">
            </div>
            <div>
              <label for="password" class="sr-only">Contraseña</label>
              <input id="password" name="password" type="password" autocomplete="current-password" required [(ngModel)]="password"
                     class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                     placeholder="Password">
            </div>
          </div>

          <div>
            <button type="submit" [disabled]="loading"
                    class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              {{ loading ? 'Cargando...' : 'Entrar' }}
            </button>
          </div>
          
          @if (error) {
            <div class="text-red-500 text-sm text-center">{{ error }}</div>
          }
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  supabaseService = inject(SupabaseService);
  router = inject(Router);
  
  email = '';
  password = '';
  loading = false;
  error = '';

  async handleLogin() {
    this.loading = true;
    this.error = '';
    
    const supabase = this.supabaseService.getClient();
    if (!supabase) {
      this.error = 'Supabase no está configurado';
      this.loading = false;
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: this.email,
      password: this.password
    });

    if (error) {
      this.error = error.message;
    } else {
      this.router.navigate(['/admin']);
    }
    this.loading = false;
  }
}
