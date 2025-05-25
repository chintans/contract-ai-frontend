import { createClient } from '@hey-api/openapi-ts';

createClient({
    input: 'http://localhost:3000/docs',
    output: 'src/app/services/api-client',
    plugins: ['@hey-api/client-fetch', '@tanstack/angular-query-experimental' ],
});