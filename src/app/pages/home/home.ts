import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-serif font-bold tracking-tight text-gray-900 sm:text-6xl">
          Bienvenido a mi Blog
        </h1>
        <p class="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          Descubre historias, tutoriales y opiniones sobre tecnología, diseño y desarrollo web.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-3 space-y-12">
          @if (blogService.loading()) {
            <div class="flex justify-center py-20">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          } @else if (blogService.posts().length === 0) {
            <div class="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <mat-icon class="text-4xl text-gray-400 mb-4">article</mat-icon>
              <h3 class="text-lg font-medium text-gray-900">No hay artículos aún</h3>
              <p class="mt-1 text-sm text-gray-500">Vuelve pronto para ver nuevo contenido.</p>
            </div>
          } @else {
            @for (post of blogService.posts(); track post.id) {
              <article class="flex flex-col gap-8 md:flex-row bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div class="md:w-1/3 shrink-0">
                  <img [src]="post.image_url || 'https://picsum.photos/seed/' + post.id + '/800/600'" 
                       [alt]="post.title" 
                       class="h-48 w-full rounded-xl object-cover md:h-full"
                       referrerpolicy="no-referrer">
                </div>
                <div class="flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-x-4 text-xs">
                      <time [attr.datetime]="post.created_at" class="text-gray-500">
                        {{ post.created_at | date:'mediumDate' }}
                      </time>
                      <span class="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                        {{ post.category || 'General' }}
                      </span>
                    </div>
                    <div class="group relative">
                      <h3 class="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                        <a [routerLink]="['/article', post.slug]">
                          <span class="absolute inset-0"></span>
                          {{ post.title }}
                        </a>
                      </h3>
                      <p class="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                        {{ post.excerpt }}
                      </p>
                    </div>
                  </div>
                  <div class="mt-6 flex items-center gap-x-4">
                     <a [routerLink]="['/article', post.slug]" class="text-sm font-semibold text-indigo-600 hover:text-indigo-500 flex items-center gap-1">
                       Leer más <mat-icon class="text-sm !w-4 !h-4 !text-[16px] leading-none">arrow_forward</mat-icon>
                     </a>
                  </div>
                </div>
              </article>
            }
          }
        </div>

        <!-- Sidebar / Ads -->
        <div class="lg:col-span-1 space-y-8">
          <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 class="font-serif text-lg font-bold text-gray-900 mb-4">Sobre Mí</h3>
            <img src="https://picsum.photos/seed/avatar/200/200" alt="Avatar" class="w-20 h-20 rounded-full mb-4 object-cover">
            <p class="text-sm text-gray-600 mb-4">
              Soy un desarrollador apasionado por crear experiencias web increíbles.
            </p>
            <a routerLink="/about" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">Más información &rarr;</a>
          </div>

          <!-- Ads Section -->
          @for (ad of blogService.ads(); track ad.id) {
            @if (ad.position === 'sidebar') {
              <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <a [href]="ad.link_url" target="_blank" rel="noopener noreferrer" class="block relative group">
                  <span class="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">Ad</span>
                  <img [src]="ad.image_url" [alt]="ad.title" class="w-full h-auto object-cover group-hover:opacity-90 transition-opacity">
                </a>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  blogService = inject(BlogService);

  ngOnInit() {
    this.blogService.loadPosts();
    this.blogService.loadAds();
  }
}
