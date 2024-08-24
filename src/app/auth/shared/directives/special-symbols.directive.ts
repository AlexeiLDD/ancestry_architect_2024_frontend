import { AbstractControl, ValidationErrors } from "@angular/forms";

const specialSymbplsRegExp = /[!@#$%^&*?]/;
const dotRegExp = /[.]/;

export function specialSymbolsValidator(control: AbstractControl): ValidationErrors | null {
  const forbidden = specialSymbplsRegExp.test(control.value);
  return !forbidden ? {'specialSymbols': true} : null;
};

export function dotValidator(control: AbstractControl): ValidationErrors | null {
  const forbidden = dotRegExp.test(control.value);
  return !forbidden ? {'dot': true} : null;
};