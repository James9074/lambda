// Create the most basic database schema for storing user accounts,
// logins, lambdas, and comments

module.exports.up = async (db) => {
  // User accounts
  await db.schema.createTable('users', (table) => {
    // UUID v1mc reduces the negative side effect of using random primary keys
    // with respect to keyspace fragmentation on disk for the tables because it's time based
    // https://www.postgresql.org/docs/current/static/uuid-ossp.html
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.string('display_name', 100);
    table.string('username', 100);
    table.string('image_url', 200);
    table.jsonb('emails').notNullable().defaultTo('[]');
    table.timestamps(false, true);
  });

  // External logins with security tokens (SSO)
  await db.schema.createTable('logins', (table) => {
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.string('provider', 16).notNullable();
    table.string('id', 36).notNullable();
    table.string('username', 100);
    table.jsonb('tokens').notNullable();
    table.jsonb('profile').notNullable();
    table.timestamps(false, true);
    table.primary(['provider', 'id']);
  });

  await db.schema.createTable('lambdas', (table) => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.uuid('owner_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.string('name', 100).notNullable();
    table.string('slug', 100).notNullable().unique();
    table.string('description', 400);
    table.integer('public').notNullable().defaultTo(0);
    table.jsonb('inputs').notNullable().defaultTo('[]');
    table.string('code', 10000).notNullable();
    table.timestamps(false, true);
  });

  await db.schema.createTable('comments', (table) => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.uuid('lambda_id').notNullable().references('id').inTable('lambdas').onDelete('CASCADE').onUpdate('CASCADE');
    table.uuid('parent_id').references('id').inTable('comments').onDelete('CASCADE').onUpdate('CASCADE');
    table.uuid('author_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.text('text');
    table.timestamps(false, true);
  });
};

module.exports.down = async (db) => {
  await db.schema.dropTableIfExists('comments');
  await db.schema.dropTableIfExists('lambdas');
  await db.schema.dropTableIfExists('logins');
  await db.schema.dropTableIfExists('users');
};

module.exports.configuration = { transaction: true };
