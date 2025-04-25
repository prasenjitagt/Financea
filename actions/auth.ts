// app/actions/auth.ts
'use server';

import { signIn } from 'next-auth/react';

export async function authenticate(formData: FormData) {
    try {
        await signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: false,
        });
    } catch (error: any) { // Type assertion
        if (error?.type === 'CredentialsSignin') {
            return 'Invalid credentials';
        }
        return 'Authentication failed';
    }
}