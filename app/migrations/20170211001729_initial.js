
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('job', table => {
      table.increments('job_id').primary();
      table.timestamps();
    }),
    // knex.schema.createTable('log_entry', table => {
    //   table.integer('log_entry_id').primary();
    //   table.enum('level').values(['info', 'debug', 'warning', 'error']);
    //   table.char('message');
    //   table.json('meta');
    //   table.timestamps();
    // }),
    knex.schema.createTable('user', table => {
      table.integer('user_id').primary();
      table.json('data');
      table.integer('job_id').unsigned().notNull();
      table.foreign('job_id').references('job.job_id');
      table.boolean('is_following');
      table.boolean('is_follower');
      table.timestamps();
    }),
    knex.schema.createTable('relationship', table => {
      table.integer('job_id').unsigned().notNull();
      table.foreign('job_id').references('job.job_id');
      table.integer('from_user_id').unsigned().notNull();
      table.foreign('from_user_id').references('user.user_id');
      table.integer('to_user_id').unsigned().notNull();
      table.foreign('to_user_id').references('user.user_id');
      table.enum('type').options(['follow', 'unfollow']);
      table.timestamps();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  knex.schema.dropTableIfExists('job');
  // knex.schema.dropTableIfExists('log_entry');
  knex.schema.dropTableIfExists('user');
  knex.schema.dropTableIfExists('relationship');
};
