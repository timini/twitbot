// Update with your config settings.

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'twitbot',
      user: 'postgres',
      password: 'letmein',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
