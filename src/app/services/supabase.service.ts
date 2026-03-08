import { Injectable, inject, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { isPlatformServer } from '@angular/common';

const SUPABASE_CONFIG_KEY = makeStateKey<{url: string, key: string}>('SUPABASE_CONFIG');

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;
  private platformId = inject(PLATFORM_ID);
  private transferState = inject(TransferState);

  constructor() {
    this.initClient();
  }

  private initClient() {
    let url: string | undefined;
    let key: string | undefined;

    if (isPlatformServer(this.platformId)) {
      // Server-side: Read from process.env
      url = process.env['SUPABASE_URL'];
      key = process.env['SUPABASE_KEY'];

      if (url && key) {
        this.transferState.set(SUPABASE_CONFIG_KEY, { url, key });
      }
    } else {
      // Client-side: Read from TransferState
      const config = this.transferState.get(SUPABASE_CONFIG_KEY, null);
      if (config) {
        url = config.url;
        key = config.key;
      } else {
        // Fallback: Check if we can find them in a global variable or just fail gracefully
        // We could also check localStorage if we implemented a manual entry form
      }
    }

    if (url && key) {
      this.supabase = createClient(url, key);
    }
  }

  getClient(): SupabaseClient | null {
    return this.supabase;
  }

  get isConfigured(): boolean {
    return !!this.supabase;
  }
}
