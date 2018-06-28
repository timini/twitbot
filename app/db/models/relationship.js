import bookshelf from 'bookshelf';

const init = (knex, models) => bookshelf(knex).Model
.extend({
  tableName: 'relationship',
  job: () => this.hasOne(models.Job),
  fromUser: () => this.hasOne(models.User),
  toUser: () => this.hasOne(models.User),
});

export default init;
