import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogService, Post } from '../../services/blog.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <div class="bg-white shadow">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-900">Panel Administrativo</h1>
            <button (click)="logout()" class="text-gray-500 hover:text-red-600 flex items-center gap-1">
              <mat-icon>logout</mat-icon> Salir
            </button>
          </div>
        </div>
      </div>

      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <!-- Tabs -->
        <div class="border-b border-gray-200 mb-8">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button (click)="activeTab = 'posts'" 
                    [class.border-indigo-500]="activeTab === 'posts'"
                    [class.text-indigo-600]="activeTab === 'posts'"
                    class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700">
              Artículos
            </button>
            <button (click)="activeTab = 'ads'"
                    [class.border-indigo-500]="activeTab === 'ads'"
                    [class.text-indigo-600]="activeTab === 'ads'"
                    class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700">
              Anuncios
            </button>
          </nav>
        </div>

        @if (activeTab === 'posts') {
          <div class="bg-white shadow sm:rounded-lg p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-medium leading-6 text-gray-900">Gestionar Artículos</h2>
              <button (click)="createNewPost()" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Nuevo Artículo
              </button>
            </div>

            <!-- Post List -->
            @if (!editingPost) {
              <ul role="list" class="divide-y divide-gray-100">
                @for (post of blogService.posts(); track post.id) {
                  <li class="flex justify-between gap-x-6 py-5">
                    <div class="flex min-w-0 gap-x-4">
                      <img [src]="post.image_url || 'https://picsum.photos/seed/' + post.id + '/100/100'" [alt]="post.title" class="h-12 w-12 flex-none rounded-full bg-gray-50 object-cover">
                      <div class="min-w-0 flex-auto">
                        <p class="text-sm font-semibold leading-6 text-gray-900">{{ post.title }}</p>
                        <p class="mt-1 truncate text-xs leading-5 text-gray-500">{{ post.created_at | date }}</p>
                      </div>
                    </div>
                    <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                      <div class="flex gap-2">
                        <button (click)="editPost(post)" class="text-indigo-600 hover:text-indigo-900">Editar</button>
                        <button (click)="deletePost(post.id)" class="text-red-600 hover:text-red-900">Eliminar</button>
                      </div>
                      <p class="mt-1 text-xs leading-5 text-gray-500">
                        {{ post.published ? 'Publicado' : 'Borrador' }}
                      </p>
                    </div>
                  </li>
                }
              </ul>
            } @else {
              <!-- Post Editor -->
              <form (ngSubmit)="savePost()" class="space-y-6">
                <div>
                  <label for="post-title" class="block text-sm font-medium text-gray-700">Título</label>
                  <input type="text" id="post-title" [(ngModel)]="editingPost.title" name="title" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2">
                </div>
                <div>
                  <label for="post-slug" class="block text-sm font-medium text-gray-700">Slug</label>
                  <input type="text" id="post-slug" [(ngModel)]="editingPost.slug" name="slug" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2">
                </div>
                <div>
                  <label for="post-image" class="block text-sm font-medium text-gray-700">Imagen URL</label>
                  <input type="text" id="post-image" [(ngModel)]="editingPost.image_url" name="image_url" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2">
                </div>
                <div>
                  <label for="post-category" class="block text-sm font-medium text-gray-700">Categoría</label>
                  <input type="text" id="post-category" [(ngModel)]="editingPost.category" name="category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2">
                </div>
                <div>
                  <label for="post-excerpt" class="block text-sm font-medium text-gray-700">Extracto</label>
                  <textarea id="post-excerpt" [(ngModel)]="editingPost.excerpt" name="excerpt" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"></textarea>
                </div>
                <div>
                  <label for="post-content" class="block text-sm font-medium text-gray-700">Contenido (Markdown)</label>
                  <textarea id="post-content" [(ngModel)]="editingPost.content" name="content" rows="10" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2 font-mono text-sm"></textarea>
                </div>
                <div class="flex items-center">
                  <input type="checkbox" id="post-published" [(ngModel)]="editingPost.published" name="published" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                  <label for="post-published" class="ml-2 block text-sm text-gray-900">Publicar inmediatamente</label>
                </div>
                <div class="flex justify-end gap-4">
                  <button type="button" (click)="cancelEdit()" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                  <button type="submit" class="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700">Guardar</button>
                </div>
              </form>
            }
          </div>
        }

        @if (activeTab === 'ads') {
          <div class="bg-white shadow sm:rounded-lg p-6">
            <h2 class="text-lg font-medium leading-6 text-gray-900 mb-6">Gestionar Publicidad</h2>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              @for (ad of blogService.ads(); track ad.id) {
                <div class="relative flex flex-col overflow-hidden rounded-lg border border-gray-200">
                  <div class="aspect-h-3 aspect-w-4 bg-gray-200 sm:aspect-none sm:h-48">
                    <img [src]="ad.image_url" [alt]="ad.title" class="h-full w-full object-cover object-center sm:h-full sm:w-full">
                  </div>
                  <div class="flex flex-1 flex-col space-y-2 p-4">
                    <h3 class="text-sm font-medium text-gray-900">{{ ad.title }}</h3>
                    <p class="text-sm text-gray-500">Posición: {{ ad.position }}</p>
                    <div class="flex flex-1 justify-end items-end">
                      <button class="text-sm font-medium text-indigo-600 hover:text-indigo-500">Editar</button>
                    </div>
                  </div>
                </div>
              }
              <!-- Add New Ad Placeholder -->
              <button class="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <mat-icon class="mx-auto h-12 w-12 text-gray-400">add_circle</mat-icon>
                <span class="mt-2 block text-sm font-semibold text-gray-900">Crear nuevo anuncio</span>
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class AdminComponent implements OnInit {
  blogService = inject(BlogService);
  supabaseService = inject(SupabaseService);
  router = inject(Router);

  activeTab: 'posts' | 'ads' = 'posts';
  editingPost: Partial<Post> | null = null;

  ngOnInit() {
    this.blogService.loadPosts();
    this.blogService.loadAds();
  }

  createNewPost() {
    this.editingPost = {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      image_url: '',
      published: false,
      category: 'General'
    };
  }

  editPost(post: Post) {
    this.editingPost = { ...post };
  }

  cancelEdit() {
    this.editingPost = null;
  }

  async savePost() {
    if (!this.editingPost) return;
    
    const supabase = this.supabaseService.getClient();
    if (!supabase) return;

    try {
      if (this.editingPost.id) {
        // Update
        const { error } = await supabase
          .from('posts')
          .update(this.editingPost)
          .eq('id', this.editingPost.id);
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('posts')
          .insert(this.editingPost);
        if (error) throw error;
      }
      
      this.editingPost = null;
      this.blogService.loadPosts();
    } catch (err) {
      console.error('Error saving post:', err);
      alert('Error al guardar el artículo');
    }
  }

  async deletePost(id: string) {
    if (!confirm('¿Estás seguro de eliminar este artículo?')) return;
    
    const supabase = this.supabaseService.getClient();
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      this.blogService.loadPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Error al eliminar el artículo');
    }
  }

  async logout() {
    const supabase = this.supabaseService.getClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    this.router.navigate(['/login']);
  }
}
