module.exports.up = async (db) => {
  await db.table('lambdas', (t) => {
    t.string('language').notNull().defaultTo('node');
  });
};

module.exports.down = async (db) => {
  db.schema.table('lambdas', (t) => {
    t.dropColumn('language');
  });
};

module.exports.configuration = { transaction: true };
