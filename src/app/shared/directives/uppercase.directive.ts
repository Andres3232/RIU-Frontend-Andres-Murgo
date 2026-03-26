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
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const uppercased = input.value.toUpperCase();

    if (this.ngControl.control && input.value !== uppercased) {
      this.ngControl.control.setValue(uppercased, { emitEvent: false });
      input.setSelectionRange(start, end);
    }
  }
}