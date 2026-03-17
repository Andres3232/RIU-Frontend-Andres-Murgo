import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import type { SuperHero } from '../../models/super-hero.interface';

@Component({
  selector: 'hero-list',
  imports: [],
  templateUrl: './hero-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroListComponent {
  heroes = input.required<SuperHero[]>();

  edit = output<SuperHero>();
  delete = output<SuperHero>();
}
