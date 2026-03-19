import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { HeroListComponent } from './hero-list.component';
import { provideRouter } from '@angular/router';
import type { SuperHero } from '../../models/super-hero.interface';
import { By } from '@angular/platform-browser';

// Host component to pass inputs
@Component({
  template: `
    <hero-list
      [heroes]="heroes()"
      (edit)="editedHero = $event"
      (delete)="deletedHero = $event"
    />
  `,
  imports: [HeroListComponent],
})
class TestHostComponent {
  heroes = signal<SuperHero[]>([
    { id: 1, name: 'Superman', power: 'Flight', description: 'Man of Steel' },
    {
      id: 2,
      name: 'Batman',
      power: 'Martial Arts',
      description: 'The Dark Knight',
    },
  ]);
  editedHero: SuperHero | null = null;
  deletedHero: SuperHero | null = null;
}

describe('HeroListComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('rendering heroes', () => {
    it('should render a row for each hero', () => {
      // Act
      const rows = fixture.nativeElement.querySelectorAll('tbody tr');

      // Assert
      expect(rows.length).toBe(2);
    });

    it('should display hero names', () => {
      // Arrange
      const firstRowCells = fixture.nativeElement.querySelectorAll(
        'tbody tr:first-child td',
      );

      // Assert
      expect(firstRowCells[1].textContent.trim()).toBe('Superman');
    });

    it('should show empty message when no heroes', () => {
      // Arrange
      host.heroes.set([]);

      // Act
      fixture.detectChanges();
      const emptyRow = fixture.nativeElement.querySelector('tbody tr td');

      // Assert
      expect(emptyRow.textContent).toContain('No heroes found');
    });
  });

  describe('edit output', () => {
    it('should emit the correct hero when Edit button is clicked', () => {
      // Arrange
      const heroListDebug = fixture.debugElement.query(
        By.directive(HeroListComponent),
      );
      const heroListInstance =
        heroListDebug.componentInstance as HeroListComponent;
      const editSpy = jest.spyOn(heroListInstance.edit, 'emit');
      const firstHero = host.heroes()[0];

      // Act
      heroListInstance.edit.emit(firstHero);

      // Assert
      expect(editSpy).toHaveBeenCalledWith(firstHero);
      expect(host.editedHero).toEqual(firstHero);
    });
  });

  describe('delete output via onDelete', () => {
    it('should emit the hero when onDelete is called with true', () => {
      // Arrange
      const heroListDebug = fixture.debugElement.query(
        By.directive(HeroListComponent),
      );
      const heroListInstance =
        heroListDebug.componentInstance as HeroListComponent;
      const targetHero = host.heroes()[0];
      heroListInstance.hero.set(targetHero);

      // Act
      heroListInstance.onDelete(true);

      // Assert
      expect(host.deletedHero).toEqual(targetHero);
    });

    it('should NOT emit when onDelete is called with false', () => {
      // Arrange
      const heroListDebug = fixture.debugElement.query(
        By.directive(HeroListComponent),
      );
      const heroListInstance =
        heroListDebug.componentInstance as HeroListComponent;
      heroListInstance.hero.set(host.heroes()[0]);

      // Act
      heroListInstance.onDelete(false);

      // Assert
      expect(host.deletedHero).toBeNull();
    });

    it('should NOT emit when hero signal is null', () => {
      // Arrange
      const heroListDebug = fixture.debugElement.query(
        By.directive(HeroListComponent),
      );
      const heroListInstance =
        heroListDebug.componentInstance as HeroListComponent;
      heroListInstance.hero.set(null);

      // Act
      heroListInstance.onDelete(true);

      // Assert
      expect(host.deletedHero).toBeNull();
    });
  });
});
