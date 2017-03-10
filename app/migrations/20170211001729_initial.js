
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('job', table => {
      table.integer('job_id').primary();
      table.timestamps();
    }),
    knex.schema.createTable('user', table => {
      table.integer('user_id').primary();
      table.json('data');
      table.integer('job_id').unsigned().notNull();
      table.foreign('job_id').references('job.job_id');
      table.timestamps();
    }),
    knex.schema.createTable('follow', table => {
      table.integer('job_id').unsigned().notNull();
      table.foreign('job_id').references('job.job_id');
      table.integer('from_user_id').unsigned().notNull();
      table.foreign('from_user_id').references('user.user_id');
      table.integer('to_user_id').unsigned().notNull();
      table.foreign('to_user_id').references('user.user_id');
      table.timestamps();
    }),
    knex.schema.createTable('unfollow', table => {
      table.integer('job_id').unsigned().notNull();
      table.foreign('job_id').references('job.job_id');
      table.integer('from_user_id').unsigned().notNull();
      table.foreign('from_user_id').references('user.user_id');
      table.integer('to_user_id').unsigned().notNull();
      table.foreign('to_user_id').references('user.user_id');
      table.timestamps();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  knex.schema.dropTableIfExists('user');
  knex.schema.dropTableIfExists('job');
  knex.schema.dropTableIfExists('follow');
  knex.schema.dropTableIfExists('unfollow');
};
