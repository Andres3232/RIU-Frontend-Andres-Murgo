import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { SuperHeroService } from '../../services/super-hero.service';
import { PaginationService } from '../../../shared/components/pagination/pagination.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { HeroListComponent } from '../../components/hero-list/hero-list.component';
import type { SuperHero } from '../../models/super-hero.interface';
import { ModalComponent } from '../../../shared/components/modals/modal.component';

@Component({
  selector: 'app-home-page',
  imports: [HeroListComponent, PaginationComponent],
  templateUrl: './home-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage {
  heroService = inject(SuperHeroService);
  private router = inject(Router);

  paginationService = inject(PaginationService);

  private deleteModal = viewChild.required<ModalComponent>('deleteModal');
  heroToDelete = signal<SuperHero | null>(null);

  private rawSearch = signal('');
  searchTerm = signal('');

  private debounceRef: ReturnType<typeof setTimeout> | null = null;

  filteredHeroes = computed(() => {
    const term = this.searchTerm();
    return term
      ? this.heroService.searchByName(term)
      : this.heroService.getAll();
  });

  syncPagination = effect(() => {
    this.paginationService.setTotalItems(this.filteredHeroes().length);
  });

  paginatedHeroes = computed(() => {
    const heroes = this.filteredHeroes();
    const page = this.paginationService.currentPage();
    const perPage = this.paginationService.itemsPerPage();

    const start = (page - 1) * perPage;
    return heroes.slice(start, start + perPage);
  });

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.rawSearch.set(value);

    if (this.debounceRef) clearTimeout(this.debounceRef);
    this.debounceRef = setTimeout(() => {
      this.searchTerm.set(value);
      this.paginationService.reset();
    }, 300);
  }

  onPageChange(page: number): void {
    this.paginationService.setPage(page);
  }

  onAdd(): void {
    this.router.navigate(['/hero/new']);
  }

  onEdit(hero: SuperHero): void {
    this.router.navigate(['/hero', hero.id, 'edit']);
  }

  removeHero(hero: SuperHero): void {
    console.log('on delete ejecutando')
    this.heroService.delete(hero.id);
  }
}
