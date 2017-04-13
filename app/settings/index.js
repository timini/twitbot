const SETTINGS = {
  debug: process.env.DEBUG ? true : false,
  environment: process.env.ENVIRONMENT || 'development',
  DB: {
    client: 'pg',
    connection: {
      host: process.env.PG_HOST,
      user: process.env.PG_USER,
      password: process.env.PG_PASS,
      database: process.env.PG_DATABASE,
    },
    searchPath: process.env.searchPath || 'public',
    debug: process.env.DEBUG ? true : false,
  },
};

SETTINGS.ENV = {
  dev: settings.environment === 'development',
  production: settings.environment === 'production',
}

export default SETTINGS;
