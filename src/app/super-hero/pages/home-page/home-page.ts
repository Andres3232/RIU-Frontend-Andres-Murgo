import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';



import { HeroListComponent } from '../../components/hero-list/hero-list.component';
import type { SuperHero } from '../../models/super-hero.interface';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { SuperHeroService } from '../../services/super-hero.service';

@Component({
  selector: 'app-home-page',
  imports: [HeroListComponent, PaginationComponent],
  templateUrl: './home-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage {
  heroService = inject(SuperHeroService);

  onEdit(hero: SuperHero): void {
    //TODO: implementarlo
  }

  onDelete(hero: SuperHero): void {
    //TODO: implementarlo
  }
}
