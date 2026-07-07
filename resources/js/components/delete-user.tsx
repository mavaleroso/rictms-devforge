import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/catalyst/button';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog';
import { ErrorMessage, Field, Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({ password: '' });

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setIsOpen(false);
        clearErrors();
        reset();
    };

    return (
        <div className="space-y-6">
            <HeadingSmall title="Delete account" description="Delete your account and all of its resources" />
            <div className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
                <div className="space-y-1 text-red-700 dark:text-red-200">
                    <p className="font-medium">Warning</p>
                    <p className="text-sm">Please proceed with caution, this cannot be undone.</p>
                </div>

                <Button color="red" onClick={() => setIsOpen(true)}>
                    Delete account
                </Button>

                <Dialog open={isOpen} onClose={closeModal}>
                    <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
                    <DialogDescription>
                        Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password
                        to confirm you would like to permanently delete your account.
                    </DialogDescription>
                    <DialogBody>
                        <form className="space-y-6" onSubmit={deleteUser} id="delete-user-form">
                            <Field>
                                <Label className="sr-only">Password</Label>
                                <Input
                                    ref={passwordInput}
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password"
                                    autoComplete="current-password"
                                />
                                {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                            </Field>
                        </form>
                    </DialogBody>
                    <DialogActions>
                        <Button plain onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button color="red" type="submit" form="delete-user-form" disabled={processing}>
                            Delete account
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}
