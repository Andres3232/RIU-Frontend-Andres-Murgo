import { Injectable, signal, computed } from '@angular/core';

@Injectable()
export class PaginationService {
  private _currentPage = signal(1);
  private _totalItems = signal(0);
  private _itemsPerPage = signal(3);

  currentPage = this._currentPage.asReadonly();
  totalItems = this._totalItems.asReadonly();
  itemsPerPage = this._itemsPerPage.asReadonly();

  totalPages = computed(() =>
    Math.ceil(this._totalItems() / this._itemsPerPage()),
  );

  setTotalItems(total: number): void {
    this._totalItems.set(total);
    if (this._currentPage() > this.totalPages() && this.totalPages() > 0) {
      this._currentPage.set(this.totalPages());
    }
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this._currentPage.set(page);
    }
  }

  nextPage(): void {
    this.setPage(this._currentPage() + 1);
  }

  prevPage(): void {
    this.setPage(this._currentPage() - 1);
  }

  reset(): void {
    this._currentPage.set(1);
  }
}
