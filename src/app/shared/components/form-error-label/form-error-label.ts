import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';

@Component({
  selector: 'form-error-label',
  imports: [],
  templateUrl: './form-error-label.html',
})
export class FormErrorLabel {
  control = input.required<AbstractControl>();

  getErrorMessage(): string | null {
    const control = this.control();
    const errors: ValidationErrors = control.errors || {};

    return control.touched && Object.keys(errors).length > 0
      ? FormUtils.getTextError(errors)
      : null;
  }
}
