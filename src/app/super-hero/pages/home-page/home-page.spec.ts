import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import HomePage from './home-page';
import { SuperHeroService } from '../../services/super-hero.service';
import type { SuperHero } from '../../models/super-hero.interface';
import { PaginationService } from '@shared/components/pagination/pagination.service';

const MOCK_HEROES: SuperHero[] = [
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
];

const mockSuperHeroService = {
  getAll: () => MOCK_HEROES,
  searchByName: (term: string) =>
    MOCK_HEROES.filter((h) =>
      h.name.toLowerCase().includes(term.toLowerCase()),
    ),
  delete: jest.fn(() => of(undefined)),
};

describe('HomePage', () => {
  let fixture: ComponentFixture<HomePage>;
  let component: HomePage;
  let router: Router;

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        { provide: SuperHeroService, useValue: mockSuperHeroService },
        PaginationService,
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  describe('filteredHeroes', () => {
    it('should return all heroes when searchTerm is empty', () => {
      // Arrange
      component.searchTerm.set('');

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.filteredHeroes()).toHaveLength(MOCK_HEROES.length);
    });

    it('should filter heroes by name when searchTerm is set', () => {
      // Arrange
      component.searchTerm.set('bat');

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.filteredHeroes()).toHaveLength(1);
      expect(component.filteredHeroes()[0].name).toBe('Batman');
    });

    it('should return empty array when no hero matches the search', () => {
      // Arrange
      component.searchTerm.set('kryptonite');

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.filteredHeroes()).toHaveLength(0);
    });
  });

  describe('paginatedHeroes', () => {
    it('should return at most itemsPerPage heroes on each page', () => {
      // Arrange
      const perPage = component.paginationService.itemsPerPage();

      // Act
      const paged = component.paginatedHeroes();

      // Assert
      expect(paged.length).toBeLessThanOrEqual(perPage);
    });

    it('should return correct slice for page 2', () => {
      // Arrange
      component.searchTerm.set('');
      fixture.detectChanges();
      component.paginationService.setPage(2);

      // Act
      fixture.detectChanges();
      const paged = component.paginatedHeroes();

      // Assert — itemsPerPage is 3, so page 2 starts at index 3
      expect(paged[0]).toEqual(MOCK_HEROES[3]);
    });
  });

  describe('onSearch', () => {
    it('should update searchTerm after debounce delay', fakeAsync(() => {
      // Arrange
      const inputEvent = { target: { value: 'super' } } as unknown as Event;

      // Act
      component.onSearch(inputEvent);
      tick(300);

      // Assert
      expect(component.searchTerm()).toBe('super');
    }));

    it('should reset pagination when search fires', fakeAsync(() => {
      // Arrange
      component.paginationService.setPage(2);
      const inputEvent = { target: { value: 'man' } } as unknown as Event;

      // Act
      component.onSearch(inputEvent);
      tick(300);

      // Assert
      expect(component.paginationService.currentPage()).toBe(1);
    }));
  });

  describe('onAdd', () => {
    it('should navigate to /hero/new', () => {
      // Arrange
      const navigateSpy = jest.spyOn(router, 'navigate');

      // Act
      component.onAdd();

      // Assert
      expect(navigateSpy).toHaveBeenCalledWith(['/hero/new']);
    });
  });

  describe('removeHero', () => {
    it('should call heroService.delete with the correct id', () => {
      // Arrange
      const hero = MOCK_HEROES[0];

      // Act
      component.removeHero(hero);

      // Assert
      expect(mockSuperHeroService.delete).toHaveBeenCalledWith(hero.id);
    });
  });
});
