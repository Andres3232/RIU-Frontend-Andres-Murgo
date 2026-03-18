import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]',
  standalone: true,
})
export class UppercaseDirective {
  private ngControl = inject(NgControl);

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const uppercased = input.value.toUpperCase();
    input.value = uppercased;
    if (this.ngControl.control) {
      this.ngControl.control.setValue(uppercased, { emitEvent: false });
    }
  }
}