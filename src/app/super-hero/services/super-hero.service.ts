import { computed, inject, Injectable, signal } from '@angular/core';
import { delay, Observable, of, tap } from 'rxjs';
import type { SuperHero } from '@models/super-hero.interface';
import { LoadingService } from '@shared/services/loading.service';

const SIMULATED_DELAY = 600;

@Injectable({ providedIn: 'root' })
export class SuperHeroService {
  private loadingService = inject(LoadingService);

  private superHeroes = signal<SuperHero[]>([
    { id: 1, name: 'Superman', power: 'Flight', description: 'Man of Steel' },
    {
      id: 2,
      name: 'Batman',
      power: 'Martial Arts',
      description: 'The Dark Knight',
    },
    {
      id: 3,
      name: 'Wonder Woman',
      power: 'Super Strength',
      description: 'Amazonian Warrior',
    },
    {
      id: 4,
      name: 'Flash',
      power: 'Super Speed',
      description: 'The Fastest Man Alive',
    },
    {
      id: 5,
      name: 'Green Lantern',
      power: 'Energy Manipulation',
      description: 'Intergalactic Peacekeeper',
    },
    {
      id: 6,
      name: 'Spider-Man',
      power: 'Wall-Crawling',
      description: 'Friendly Neighborhood Spider-Man',
    },
    {
      id: 7,
      name: 'Iron Man',
      power: 'Genius-level Intellect',
      description: 'Billionaire Industrialist',
    },
    {
      id: 8,
      name: 'Captain America',
      power: 'Super Soldier',
      description: 'Leader of the Avengers',
    },
    {
      id: 9,
      name: 'Thor',
      power: 'God of Thunder',
      description: 'Asgardian Warrior',
    },
    {
      id: 10,
      name: 'Hulk',
      power: 'Super Strength',
      description: 'The Incredible Hulk',
    },
  ]);

  getAll = computed(() => this.superHeroes());

  getById(id: number): SuperHero | undefined {
    return this.superHeroes().find((hero) => hero.id === id);
  }

  searchByName(name: string): SuperHero[] {
    return this.superHeroes().filter((hero) =>
      hero.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  create(superHero: Omit<SuperHero, 'id'>): Observable<SuperHero> {
    const nextId = Math.max(...this.superHeroes().map((h) => h.id), 0) + 1;
    const newHero: SuperHero = { ...superHero, id: nextId };

    return this.withSimulatedDelay(newHero, () => {
      this.superHeroes.update((heroes) => [...heroes, newHero]);
    });
  }

  update(id: number, superHero: Partial<Omit<SuperHero, 'id'>>): Observable<void> {
    return this.withSimulatedDelay(undefined as void, () => {
      this.superHeroes.update((heroes) =>
        heroes.map((hero) => (hero.id === id ? { ...hero, ...superHero } : hero)),
      );
    });
  }

  delete(id: number): Observable<void> {
    return this.withSimulatedDelay(undefined as void, () => {
      this.superHeroes.update((heroes) => heroes.filter((hero) => hero.id !== id));
    });
  }

  private withSimulatedDelay<T>(value: T, operation: () => void): Observable<T> {
    this.loadingService.show();
    return of(value).pipe(
      delay(SIMULATED_DELAY),
      tap(() => operation()),
      tap({ finalize: () => this.loadingService.hide() }),
    );
  }
}
