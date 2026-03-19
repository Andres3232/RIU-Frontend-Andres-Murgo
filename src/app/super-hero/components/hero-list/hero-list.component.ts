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
  imports: [ModalComponent,RouterLink],
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
    this.modal.open();
  }

  onDelete(confirmRemove: boolean): void {
    const hero = this.hero();
    if (confirmRemove && hero) {
      this.delete.emit(hero);
    }
  }
}
