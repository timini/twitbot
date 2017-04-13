import knex from 'knex';

export default class DB {
  constructor() {
    this.conn = knex(SETTINGS.DB);
    this.logger = console;
  }
  init() {
    return this.conn.migrate
    .latest()
    .then(() => {
      if (process.env.DEBUG) this.logger.info('db connected.');
      return true;
    })
    .catch(
      (err) => new Promise((resolve, reject) => {
        if (process.env.DEBUG) this.logger.info('retrying connection..');
        setTimeout(() => {
          this.init()
          .then(resolve)
          .catch(reject);
        }, 500);
      })
    );
  }
}
