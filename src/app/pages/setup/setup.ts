import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div class="text-center">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <mat-icon class="text-3xl text-indigo-600">settings</mat-icon>
          </div>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Configuración Requerida</h2>
          <p class="mt-2 text-sm text-gray-600">
            Para usar esta aplicación, necesitas conectar tu proyecto de Supabase.
          </p>
        </div>

        <div class="mt-8 space-y-6">
          <div class="rounded-md bg-blue-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <mat-icon class="text-blue-400">info</mat-icon>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">Instrucciones</h3>
                <div class="mt-2 text-sm text-blue-700">
                  <ol class="list-decimal list-inside space-y-1">
                    <li>Crea un proyecto en <a href="https://supabase.com" target="_blank" class="underline font-bold">Supabase</a>.</li>
                    <li>Obtén tu <strong>Project URL</strong> y <strong>Anon Key</strong>.</li>
                    <li>Agrégalos a tu archivo <code>.env</code> (o variables de entorno del sistema).</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code class="text-xs text-green-400 font-mono">
              SUPABASE_URL=https://tu-proyecto.supabase.co<br>
              SUPABASE_KEY=tu-anon-key-publica
            </code>
          </div>

          <div class="text-center text-xs text-gray-500">
            Una vez configurado, recarga la página.
          </div>
        </div>
      </div>
    </div>
  `
})
export class SetupComponent {}
