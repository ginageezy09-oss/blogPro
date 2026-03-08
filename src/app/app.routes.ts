import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { SupabaseService } from './services/supabase.service';
import { Router } from '@angular/router';

const configGuard = () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);
  
  if (!supabase.isConfigured) {
    return router.parseUrl('/setup');
  }
  return true;
};

const authGuard = async () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);
  const supabase = supabaseService.getClient();

  if (!supabase) return router.parseUrl('/setup');

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return router.parseUrl('/login');
  }
  return true;
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
    canActivate: [configGuard]
  },
  {
    path: 'setup',
    loadComponent: () => import('./pages/setup/setup').then(m => m.SetupComponent)
  },
  {
    path: 'article/:slug',
    loadComponent: () => import('./pages/article/article').then(m => m.ArticleComponent),
    canActivate: [configGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent),
    canActivate: [configGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin').then(m => m.AdminComponent),
    canActivate: [configGuard, authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
