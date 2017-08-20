module.exports.up = async (db) => {
  await db.schema.table('lambdas', (t) => {
    t.string('language', 200).notNull().defaultTo('node');
  });
};

module.exports.down = async (db) => {
  await db.schema.table('lambdas', (t) => {
    t.dropColumn('language');
  });
};

module.exports.configuration = { transaction: true };
