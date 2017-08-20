#!/usr/bin/env node
const fs = require('fs');
const knex = require('knex');
const knexfile = require('../knexfile')
const task = require('./task');

// The list of available commands, e.g. node tools/db.js rollback
const commands = ['version', 'migrate', 'rollback', 'migration', 'seed', 'reset'];
const command = process.argv[2];

const config = knexfile.development;

// The template for database migration files (see templates/*.js)
const version = new Date().toISOString().substr(0, 16).replace(/\D/g, '');
const template = `module.exports.up = async (db) => {\n  \n};\n
module.exports.down = async (db) => {\n  \n};\n
module.exports.configuration = { transaction: true };\n`;

module.exports = task('db', async () => {
  let db;

  if (!commands.includes(command)) {
    throw new Error(`Unknown command: ${command}`);
  }

  try {
    switch (command) {
      case 'version':
        db = knex(config);
        await db.migrate.currentVersion(config).then(console.log);
        break;
      case 'migration':
        fs.writeFileSync(`migrations/${version}_${process.argv[3] || 'new'}.js`, template, 'utf8');
        break;
      case 'seed':
        db = knex(config);
        await db.seed.run(config);
        break;
      default:
        break;
    }
  } finally {
    if (db) {
      await db.destroy();
    }
  }
});
