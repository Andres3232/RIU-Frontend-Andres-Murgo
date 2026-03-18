import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import type { SuperHero } from '../../models/super-hero.interface';
import { SuperHeroService } from '../../services/super-hero.service';
import { FormErrorLabel } from '../../../shared/components/form-error-label/form-error-label';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'hero-details',
  imports: [ReactiveFormsModule, FormErrorLabel],
  templateUrl: './hero-details.html',
})
export default class HeroDetails implements OnInit {
  private heroService = inject(SuperHeroService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  activatedRoute = inject(ActivatedRoute);

  hero = signal<SuperHero | null>(null);
  isNew = signal(false);
  wasSaved = signal(false);

  heroForm = this.fb.group({
    name: ['', Validators.required],
    power: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(10)]],
  });

  heroId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id'])),
  );

  ngOnInit(): void {
    if (this.heroId() === 'new') {
      this.isNew.set(true);
      this.hero.set({ id: 0, name: '', power: '', description: '' });
    } else {
      const found = this.heroService.getById(+this.heroId());
      if (!found) {
        this.router.navigate(['/home']);
        return;
      }
      this.hero.set(found);
      this.heroForm.reset({
        name: found.name,
        power: found.power,
        description: found.description,
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.heroForm.invalid) {
      this.heroForm.markAllAsTouched();
      return;
    }

    const formValue = this.heroForm.value;
    const heroData = {
      name: formValue.name!,
      power: formValue.power!,
      description: formValue.description!,
    };

    if (this.isNew()) {
      this.heroService.create(heroData);

      this.router.navigate(['/home']);
    } else {
      this.heroService.update(this.hero()!.id, heroData);

      this.wasSaved.set(true);
      setTimeout(() => this.wasSaved.set(false), 3000);
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
