import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function mustMatchValidator(first: string, second: string): ValidatorFn {
    return (control: FormGroup): ValidationErrors | null => {
        const firstControl = control.get(first);
        const secondControl = control.get(second);

        if (firstControl && secondControl) {
            if (firstControl.value !== secondControl.value && firstControl.value && secondControl.value) {
                const errors = secondControl.errors || {};

                secondControl.setErrors(Object.assign({}, errors, {mustMatch: true}));
            } else if (secondControl.errors) {
                const errors = Object.assign({}, secondControl.errors);

                delete errors.mustMatch;

                if (Object.keys(errors).length > 0) {
                    secondControl.setErrors(errors);
                } else {
                    secondControl.setErrors(null);
                }
            }
        }

        return null;
    };
}
