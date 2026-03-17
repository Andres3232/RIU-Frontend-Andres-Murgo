import { computed, Injectable, signal } from '@angular/core';
import type { SuperHero } from '../models/super-hero.interface';

@Injectable({ providedIn: 'root' })
export class SuperHeroService {
  private superHeros = signal<SuperHero[]>([
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


  getAll = computed(() => this.superHeros());

  getById(id: number) {
    return this.superHeros().find((hero) => hero.id === id);
  }

  searchByName(name: string) {
    return this.superHeros().filter((hero) =>
      hero.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  create(superHero: Omit<SuperHero, 'id'>): void {
    const nextId = Math.max(...this.superHeros().map(h => h.id), 0) + 1;
    this.superHeros.update(heroes => [...heroes, { ...superHero, id: nextId }]);
  }

  update(id: number, superHero: Partial<Omit<SuperHero, 'id'>>): void {
    this.superHeros.update(heroes =>
      heroes.map(hero => hero.id === id ? { ...hero, ...superHero } : hero)
    );
  }

  delete(id: number) {
    this.superHeros.update((heroes) => heroes.filter((hero) => hero.id !== id));
  }
}
