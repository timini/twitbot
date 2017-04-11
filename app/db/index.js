import knex from 'knex';

export default class DB {
  constructor() {
    this.conn = knex({
      client: 'pg',
      connection: {
        host: process.env.PG_HOST,
        user: process.env.PG_USER,
        password: process.env.PG_PASS,
        database: process.env.PG_DATABASE,
      },
      searchPath: 'public',
      debug: process.env.DEBUG,
    });
  }
  init() {
    return this.conn.migrate
    .latest()
    .then(() => {
      if (process.env.DEBUG) console.info('db connected.');
      return true;
    })
    .catch(
      (err) => new Promise((resolve, reject) => {
        if (process.env.DEBUG) console.info('retrying connection..');
        setTimeout(() => {
          this.init()
          .then(resolve)
          .catch(reject);
        }, 500);
      })
    );
  }
}
