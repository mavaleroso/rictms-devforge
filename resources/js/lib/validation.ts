import type { ReactElement, ReactNode } from 'react';
import { Children, cloneElement, isValidElement } from 'react';

import { Combobox } from '@/components/catalyst/combobox';
import { Input } from '@/components/catalyst/input';
import { Listbox } from '@/components/catalyst/listbox';
import { Select } from '@/components/catalyst/select';
import { Textarea } from '@/components/catalyst/textarea';

export type ValidationErrors = Record<string, string>;

const formControls = new Set([Input, Textarea, Select, Listbox, Combobox]);

export function hasValidationErrors(errors: ValidationErrors | undefined): boolean {
    return !!errors && Object.keys(errors).length > 0;
}

/** First Laravel validation message for toast title. */
export function primaryValidationMessage(errors: ValidationErrors): string {
    const first = Object.values(errors)[0];

    return first ?? 'Please fix the errors below.';
}

/** All Laravel validation messages combined for toast body. */
export function validationSummary(errors: ValidationErrors): string {
    return Object.values(errors).join(' ');
}


export function isFormControl(child: ReactNode): child is ReactElement<{ invalid?: boolean }> {
    return isValidElement(child) && formControls.has(child.type as typeof Input);
}

export function withInvalidState(children: ReactNode, invalid: boolean): ReactNode {
    return Children.map(children, (child) => {
        if (isFormControl(child)) {
            return cloneWithInvalid(child, invalid);
        }

        return child;
    });
}

function cloneWithInvalid(child: ReactElement<{ invalid?: boolean }>, invalid: boolean): ReactElement {
    return invalid ? cloneElement(child, { invalid: true }) : child;
}
