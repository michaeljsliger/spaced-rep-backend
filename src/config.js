module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DATABASE_URL
    || 'postgresql://postgres@localhost/spaced-repetition',
  JWT_SECRET: process.env.JWT_SECRET || 'bobby-boi',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
}
