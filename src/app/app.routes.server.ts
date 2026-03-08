import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'article/:slug',
    renderMode: RenderMode.Client // <--- Esto le dice a Angular: "No intentes pre-renderizar esto"
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];