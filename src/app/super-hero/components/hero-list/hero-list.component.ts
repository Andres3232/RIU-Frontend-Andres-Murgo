import { UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import type { SuperHero } from '@models/super-hero.interface';
import { ModalComponent } from '@shared/components/modals/modal.component';

@Component({
  selector: 'hero-list',
  imports: [ModalComponent,RouterLink, UpperCasePipe],
  templateUrl: './hero-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroListComponent {
  @ViewChild('modal') modal!: ModalComponent;
  heroes = input.required<SuperHero[]>();
  hero = signal<SuperHero | null>(null);

  edit = output<SuperHero>();
  delete = output<SuperHero>();

  openModal(hero: SuperHero): void {
    this.hero.set(hero);
    console.log('Opening modal for hero ID:', hero.id);
    this.modal.open();
  }

  onDelete(confirmRemove: boolean): void {
    const hero = this.hero();
    console.log(hero)
    if (confirmRemove && hero) {
      this.delete.emit(hero);
    }
  }
}
