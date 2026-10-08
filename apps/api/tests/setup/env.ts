export const TEST_DATABASE_URL = 'file:./test.db';

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = TEST_DATABASE_URL;
