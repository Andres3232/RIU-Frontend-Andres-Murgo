import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { signal } from '@angular/core';
import HeroDetails from './hero-details';
import { SuperHeroService } from '../../services/super-hero.service';
import type { SuperHero } from '@models/super-hero.interface';

const MOCK_HERO: SuperHero = {
  id: 1,
  name: 'Superman',
  power: 'Flight',
  description: 'Man of Steel hero',
};

function buildActivatedRoute(id: string) {
  return {
    params: new BehaviorSubject({ id }),
    snapshot: { params: { id } },
  };
}

const mockSuperHeroService = {
  getById: jest.fn(),
  create: jest.fn(() => of({ ...MOCK_HERO, id: 99 })),
  update: jest.fn(() => of(undefined)),
};

describe('HeroDetails', () => {
  let fixture: ComponentFixture<HeroDetails>;
  let component: HeroDetails;
  let router: Router;

  async function setup(id: string) {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [HeroDetails],
      providers: [
        { provide: SuperHeroService, useValue: mockSuperHeroService },
        { provide: ActivatedRoute, useValue: buildActivatedRoute(id) },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroDetails);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    (component as any).heroId = signal(id);

    fixture.detectChanges();
    fixture.detectChanges();
  }

  describe('new hero mode (id = "new")', () => {
    beforeEach(() => setup('new'));

    it('should set isNew to true', () => {
      // Assert
      expect(component.isNew()).toBe(true);
    });

    it('should NOT pre-fill the form', () => {
      // Assert
      expect(component.heroForm.get('name')!.value).toBe('');
    });

    it('should call heroService.create and navigate to /home on valid submit', () => {
      // Arrange
      const navigateSpy = jest.spyOn(router, 'navigate');
      component.heroForm.setValue({
        name: 'Aquaman',
        power: 'Telepathy',
        description: 'King of Atlantis',
      });

      // Act
      component.onSubmit();

      // Assert
      expect(mockSuperHeroService.create).toHaveBeenCalledWith({
        name: 'Aquaman',
        power: 'Telepathy',
        description: 'King of Atlantis',
      });
      expect(navigateSpy).toHaveBeenCalledWith(['/home'], { queryParams: { saved: 'true' } });
    });

    it('should mark all fields as touched and NOT call create when form is invalid', () => {
      // Arrange
      component.heroForm.reset();

      // Act
      component.onSubmit();

      // Assert
      expect(component.heroForm.touched).toBe(true);
      expect(mockSuperHeroService.create).not.toHaveBeenCalled();
    });
  });

  describe('edit hero mode (existing id)', () => {
    beforeEach(() => {
      mockSuperHeroService.getById.mockReturnValue(MOCK_HERO);
      return setup('1');
    });

    it('should set isNew to false', () => {
      // Assert
      expect(component.isNew()).toBe(false);
    });

    it('should pre-fill the form with the hero data', () => {
      // Assert
      expect(component.heroForm.get('name')!.value).toBe(MOCK_HERO.name);
      expect(component.heroForm.get('power')!.value).toBe(MOCK_HERO.power);
      expect(component.heroForm.get('description')!.value).toBe(
        MOCK_HERO.description,
      );
    });

    it('should call heroService.update on valid submit', () => {
      // Arrange
      component.heroForm.patchValue({ name: 'Clark Kent' });

      // Act
      component.onSubmit();

      // Assert
      expect(mockSuperHeroService.update).toHaveBeenCalledWith(
        MOCK_HERO.id,
        expect.objectContaining({ name: 'Clark Kent' }),
      );
    });

    it('should navigate to /home with saved=true after successful update', () => {
      // Arrange
      const navigateSpy = jest.spyOn(router, 'navigate');
      component.heroForm.setValue({
        name: 'Superman',
        power: 'Flight',
        description: 'Man of Steel hero',
      });

      // Act
      component.onSubmit();

      // Assert
      expect(navigateSpy).toHaveBeenCalledWith(['/home'], { queryParams: { saved: 'true' } });
    });
  });

  describe('unknown hero id', () => {
    it('should redirect to /home when hero is not found', async () => {
      // Arrange
      mockSuperHeroService.getById.mockReturnValue(undefined);
      const navigateSpy = jest.fn();

      await TestBed.configureTestingModule({
        imports: [HeroDetails],
        providers: [
          { provide: SuperHeroService, useValue: mockSuperHeroService },
          { provide: ActivatedRoute, useValue: buildActivatedRoute('999') },
          { provide: Router, useValue: { navigate: navigateSpy } },
        ],
      })
        .overrideComponent(HeroDetails, { set: { providers: [] } })
        .compileComponents();

      const f = TestBed.createComponent(HeroDetails);
      const c = f.componentInstance;
      (c as any).heroId = signal('999');
      f.detectChanges();

      // Assert
      expect(navigateSpy).toHaveBeenCalledWith(['/home']);
    });
  });

  describe('goBack', () => {
    beforeEach(() => {
      mockSuperHeroService.getById.mockReturnValue(MOCK_HERO);
      return setup('1');
    });

    it('should navigate to /home', () => {
      // Arrange
      const navigateSpy = jest.spyOn(router, 'navigate');

      // Act
      component.goBack();

      // Assert
      expect(navigateSpy).toHaveBeenCalledWith(['/home']);
    });
  });
});
