import { createSafeActionClient } from 'next-safe-action';
import z from 'zod';
import * as Sentry from '@sentry/nextjs';

export const actionClient = createSafeActionClient({
    defineMetadataSchema() {
        return z.object({
            actionName: z.string(),
        })
    },
    handleServerError(error, ultis) {
        const { clientInput, metadata } = ultis;
        Sentry.captureException(error, (scope) => {
            scope.clear();
            scope.setContext('ServerError', { message: error.message });
            scope.setContext('metadata', { actionName: metadata?.actionName });
            scope.setContext('clientInput', { clientInput} );
            return scope;
        });
        if (error.constructor.name === 'DatabaseError') {
            // safe things todo, not to leak data in database
            return "Database Error: Your data did not save. Please try again later.";
        }
        return error.message || "An unexpected error occurred. Please try again later.";
    }
})