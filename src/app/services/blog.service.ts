import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string;
  published: boolean;
  created_at: string;
  category?: string;
}

export interface Ad {
  id: string;
  image_url: string;
  link_url: string;
  position: 'sidebar' | 'banner' | 'footer';
  active: boolean;
  title: string;
}

export interface Review {
  id: string;
  post_id: string;
  user_name: string;
  rating: number; // 1-5
  comment: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private supabaseService = inject(SupabaseService);

  // Signals for state
  posts = signal<Post[]>([]);
  ads = signal<Ad[]>([]);
  currentPost = signal<Post | null>(null);
  reviews = signal<Review[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  private get supabase() {
    return this.supabaseService.getClient();
  }

  async loadPosts() {
    if (!this.supabase) return;
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      this.posts.set(data || []);
    } catch (err: unknown) {
      this.error.set((err as Error).message);
    } finally {
      this.loading.set(false);
    }
  }

  async getPostBySlug(slug: string) {
    if (!this.supabase) return;
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      this.currentPost.set(data);
      // Load reviews for this post
      if (data) this.loadReviews(data.id);
    } catch (err: unknown) {
      this.error.set((err as Error).message);
    } finally {
      this.loading.set(false);
    }
  }

  async loadReviews(postId: string) {
    if (!this.supabase) return;
    try {
      const { data, error } = await this.supabase
        .from('reviews')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      this.reviews.set(data || []);
    } catch (err: unknown) {
      console.error('Error loading reviews:', err);
    }
  }

  async addReview(review: Omit<Review, 'id' | 'created_at'>) {
    if (!this.supabase) return;
    try {
      const { data, error } = await this.supabase
        .from('reviews')
        .insert(review)
        .select()
        .single();
        
      if (error) throw error;
      this.reviews.update(current => [data, ...current]);
      return data;
    } catch (err: unknown) {
      this.error.set((err as Error).message);
      throw err;
    }
  }

  async loadAds() {
    if (!this.supabase) return;
    try {
      const { data, error } = await this.supabase
        .from('ads')
        .select('*')
        .eq('active', true);
        
      if (error) throw error;
      this.ads.set(data || []);
    } catch (err: unknown) {
      console.error('Error loading ads:', err);
    }
  }
}
