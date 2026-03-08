import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { NavbarComponent } from './components/layout/navbar';
import { FooterComponent } from './components/layout/footer';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
      <app-navbar />
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>
      <app-footer />
    </div>
  `,
  styleUrl: './app.css',
})
export class App {}
