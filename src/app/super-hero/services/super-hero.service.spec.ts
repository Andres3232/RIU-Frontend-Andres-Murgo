import { TestBed } from '@angular/core/testing';
import { SuperHeroService } from './super-hero.service';
import { firstValueFrom } from 'rxjs';

describe('SuperHeroService', () => {
  let service: SuperHeroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuperHeroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('getAll', () => {
    it('should return all heroes', () => {
      // Act
      const heroes = service.getAll();

      // Assert
      expect(heroes.length).toBe(10);
    });
  });
  describe('getById', () => {
    it('should return a hero when id exists', () => {
      // Arrange
      const targetId = 1;

      // Act
      const hero = service.getById(targetId);

      // Assert
      expect(hero).toBeDefined();
      expect(hero!.name).toBe('Superman');
      expect(hero!.id).toBe(1);
    });

    it('should return undefined when id does not exist', () => {
      // Arrange
      const nonExistentId = 999;

      // Act
      const hero = service.getById(nonExistentId);

      // Assert
      expect(hero).toBeUndefined();
    });
  });
  describe('searchByName', () => {
    it('should return heroes matching the search term', () => {
      // Arrange
      const searchTerm = 'man';

      // Act
      const results = service.searchByName(searchTerm);

      // Assert
      expect(results.length).toBeGreaterThan(0);
      results.forEach((hero) => {
        expect(hero.name.toLowerCase()).toContain('man');
      });
    });

    it('should be case insensitive', () => {
      // Arrange
      const lowerTerm = 'spider';
      const upperTerm = 'SPIDER';

      // Act
      const resultsLower = service.searchByName(lowerTerm);
      const resultsUpper = service.searchByName(upperTerm);

      // Assert
      expect(resultsLower).toEqual(resultsUpper);
    });

    it('should return empty array when no match', () => {
      // Arrange
      const searchTerm = 'xyznonexistent';

      // Act
      const results = service.searchByName(searchTerm);

      // Assert
      expect(results.length).toBe(0);
    });
  });
  describe('create', () => {
    it('should add a new hero with auto-generated id', async () => {
      // Arrange
      const initialCount = service.getAll().length;
      const newHero = {
        name: 'Aquaman',
        power: 'Underwater Breathing',
        description: 'King of Atlantis',
      };

      // Act
      await firstValueFrom(service.create(newHero));

      // Assert
      const heroes = service.getAll();
      expect(heroes.length).toBe(initialCount + 1);

      const created = heroes.find((h: any) => h.name === 'Aquaman');
      expect(created).toBeDefined();
      expect(created!.id).toBeDefined();
    });

    it('should generate an id greater than all existing ids', async () => {
      // Arrange
      const maxIdBefore = Math.max(...service.getAll().map((h: any) => h.id));
      const newHero = {
        name: 'Aquaman',
        power: 'Underwater Breathing',
        description: 'King of Atlantis',
      };

      // Act
      await firstValueFrom(service.create(newHero));

      // Assert
      const created = service.getAll().find((h: any) => h.name === 'Aquaman');
      expect(created!.id).toBe(maxIdBefore + 1);
    });
  });

  describe('update', () => {
    it('should update an existing hero', async () => {
      // Arrange
      const heroId = 1;

      // Act
      await firstValueFrom(service.update(heroId, { name: 'Superman Prime' }));

      // Assert
      const updated = service.getById(heroId);
      expect(updated!.name).toBe('Superman Prime');
    });

    it('should only update provided fields', async () => {
      // Arrange
      const heroId = 1;
      const originalHero = service.getById(heroId)!;
      const originalPower = originalHero.power;
      const originalDescription = originalHero.description;

      // Act
      await firstValueFrom(service.update(heroId, { name: 'Superman Prime' }));

      // Assert
      const updated = service.getById(heroId)!;
      expect(updated.name).toBe('Superman Prime');
      expect(updated.power).toBe(originalPower);
      expect(updated.description).toBe(originalDescription);
    });

    it('should not affect other heroes', async () => {
      // Arrange
      const heroId = 1;
      const batmanBefore = service.getById(2)!;

      // Act
      await firstValueFrom(service.update(heroId, { name: 'Superman Prime' }));

      // Assert
      const batmanAfter = service.getById(2)!;
      expect(batmanAfter).toEqual(batmanBefore);
    });
  });

  describe('delete', () => {
    it('should remove a hero by id', async () => {
      // Arrange
      const initialCount = service.getAll().length;
      const heroId = 1;

      // Act
      await firstValueFrom(service.delete(heroId));

      // Assert
      expect(service.getAll().length).toBe(initialCount - 1);
    });

    it('should no longer find the deleted hero', async () => {
      // Arrange
      const heroId = 1;

      // Act
      await firstValueFrom(service.delete(heroId));

      // Assert
      expect(service.getById(heroId)).toBeUndefined();
    });

    it('should not affect other heroes when deleting', async () => {
      // Arrange
      const heroIdToDelete = 1;
      const otherHeroId = 2;

      // Act
      await firstValueFrom(service.delete(heroIdToDelete));

      // Assert
      expect(service.getById(otherHeroId)).toBeDefined();
      expect(service.getById(otherHeroId)!.name).toBe('Batman');
    });
  });
});
