import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export function EqualValidator(value: {password: string}): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = control.value === value.password;
      return !forbidden ? {equal: true} : null;
    };
  }
