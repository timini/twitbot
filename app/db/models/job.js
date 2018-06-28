const init = (knex, models) => bookshelf(knex).Model
.extend({
  tableName: 'follow',
  job: () => this.hasOne(models.Job),
  fromUser: () => this.hasOne(models.User),
  toUser: () => this.hasOne(models.User),
});
