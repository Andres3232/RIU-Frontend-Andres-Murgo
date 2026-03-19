import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { SuperHeroService } from '../../services/super-hero.service';
import { HeroListComponent } from '../../components/hero-list/hero-list.component';
import type { SuperHero } from '@models/super-hero.interface';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { ModalComponent } from '@shared/components/modals/modal.component';


@Component({
  selector: 'app-home-page',
  imports: [HeroListComponent, PaginationComponent],
  templateUrl: './home-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage {
  heroService = inject(SuperHeroService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  paginationService = inject(PaginationService);

  private deleteModal = viewChild.required<ModalComponent>('deleteModal');
  heroToDelete = signal<SuperHero | null>(null);
  wasSaved = signal(false);

  constructor() {
    const saved = this.activatedRoute.snapshot.queryParamMap.get('saved');
    if (saved === 'true') {
      this.wasSaved.set(true);
      this.router.navigate([], { queryParams: {}, replaceUrl: true });
      setTimeout(() => this.wasSaved.set(false), 3000);
    }
  }

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

  removeHero(hero: SuperHero): void {
    this.heroService.delete(hero.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
