import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _isLoading = signal(false);
  private activeRequests = 0;

  isLoading = this._isLoading.asReadonly();

  show(): void {
    this.activeRequests++;
    this._isLoading.set(true);
  }

  hide(): void {
    this.activeRequests = Math.max(this.activeRequests - 1, 0);
    if (this.activeRequests === 0) {
      this._isLoading.set(false);
    }
  }
}
