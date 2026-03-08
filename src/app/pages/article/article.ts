import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogService, Post } from '../../services/blog.service';
import { MatIconModule } from '@angular/material/icon';
import { marked } from 'marked';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, FormsModule],
  template: `
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      @if (blogService.loading()) {
        <div class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      } @else if (post) {
        <article>
          <!-- Header -->
          <header class="mb-10 text-center">
            <div class="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
              <time [attr.datetime]="post.created_at">{{ post.created_at | date:'longDate' }}</time>
              <span>&bull;</span>
              <span class="uppercase tracking-wider font-medium text-indigo-600">{{ post.category || 'General' }}</span>
            </div>
            <h1 class="text-4xl font-serif font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
              {{ post.title }}
            </h1>
            @if (post.image_url) {
              <img [src]="post.image_url" [alt]="post.title" class="w-full h-auto rounded-2xl shadow-lg object-cover max-h-[500px]" referrerpolicy="no-referrer">
            }
          </header>

          <!-- Content -->
          <div class="prose prose-lg prose-indigo mx-auto text-gray-700" [innerHTML]="renderedContent"></div>

          <!-- Tags/Share -->
          <div class="mt-12 border-t border-gray-200 pt-8 flex justify-between items-center">
            <div class="flex gap-2">
              <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">#blog</span>
              <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">#tech</span>
            </div>
            <div class="flex gap-4">
              <button class="text-gray-400 hover:text-indigo-600 transition-colors">
                <mat-icon>share</mat-icon>
              </button>
              <button class="text-gray-400 hover:text-red-600 transition-colors">
                <mat-icon>favorite_border</mat-icon>
              </button>
            </div>
          </div>
        </article>

        <!-- Reviews Section -->
        <section class="mt-16 bg-gray-50 rounded-2xl p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <mat-icon class="text-indigo-600">chat_bubble_outline</mat-icon>
            Comentarios y Reseñas
          </h2>

          <!-- Comment Form -->
          <form (ngSubmit)="submitReview()" class="mb-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Deja tu opinión</h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
                <input type="text" id="name" [(ngModel)]="newReview.user_name" name="name" required
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
              </div>
              <div>
                <label for="rating" class="block text-sm font-medium text-gray-700">Calificación</label>
                <select id="rating" [(ngModel)]="newReview.rating" name="rating"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
                  <option [value]="5">⭐⭐⭐⭐⭐ Excelente</option>
                  <option [value]="4">⭐⭐⭐⭐ Muy bueno</option>
                  <option [value]="3">⭐⭐⭐ Bueno</option>
                  <option [value]="2">⭐⭐ Regular</option>
                  <option [value]="1">⭐ Malo</option>
                </select>
              </div>
            </div>
            <div class="mb-4">
              <label for="comment" class="block text-sm font-medium text-gray-700">Comentario</label>
              <textarea id="comment" rows="4" [(ngModel)]="newReview.comment" name="comment" required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"></textarea>
            </div>
            <button type="submit" [disabled]="submitting"
                    class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50">
              {{ submitting ? 'Enviando...' : 'Publicar Comentario' }}
            </button>
          </form>

          <!-- Reviews List -->
          <div class="space-y-6">
            @for (review of blogService.reviews(); track review.id) {
              <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                      {{ review.user_name.charAt(0).toUpperCase() }}
                    </div>
                    <span class="font-medium text-gray-900">{{ review.user_name }}</span>
                  </div>
                  <div class="flex text-yellow-400 text-sm">
                    @for (star of [1,2,3,4,5]; track star) {
                      <mat-icon class="text-[16px] w-4 h-4 leading-none">{{ star <= review.rating ? 'star' : 'star_border' }}</mat-icon>
                    }
                  </div>
                </div>
                <p class="text-gray-600 text-sm">{{ review.comment }}</p>
                <div class="mt-2 text-xs text-gray-400">
                  {{ review.created_at | date:'medium' }}
                </div>
              </div>
            } @empty {
              <p class="text-center text-gray-500 italic">Sé el primero en comentar.</p>
            }
          </div>
        </section>

      } @else {
        <div class="text-center py-20">
          <h2 class="text-2xl font-bold text-gray-900">Artículo no encontrado</h2>
          <a routerLink="/" class="mt-4 inline-block text-indigo-600 hover:text-indigo-500">Volver al inicio</a>
        </div>
      }
    </div>
  `
})
export class ArticleComponent implements OnInit {
  blogService = inject(BlogService);
  route = inject(ActivatedRoute);
  
  post: Post | null = null;
  renderedContent = '';
  
  newReview = {
    user_name: '',
    rating: 5,
    comment: ''
  };
  submitting = false;

  constructor() {
    // Effect to update local state when service state changes
    // In a real app, we might just use the signal directly in the template
    // but for marked rendering we need a derived value
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.blogService.getPostBySlug(slug).then(() => {
          this.post = this.blogService.currentPost();
          if (this.post) {
            this.renderedContent = marked.parse(this.post.content) as string;
          }
        });
      }
    });
  }

  async submitReview() {
    if (!this.post) return;
    
    this.submitting = true;
    try {
      await this.blogService.addReview({
        post_id: this.post.id,
        ...this.newReview
      });
      // Reset form
      this.newReview = { user_name: '', rating: 5, comment: '' };
    } catch (err) {
      console.error(err);
      alert('Error al enviar el comentario');
    } finally {
      this.submitting = false;
    }
  }
}
