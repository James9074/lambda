/* eslint-disable no-restricted-syntax, no-await-in-loop, prefer-template*/

const faker = require('faker');

module.exports.seed = async (db) => {
  // Create 10 random website users (as an example)
  const users = Array.from({ length: 10 }).map(() => ({
    display_name: faker.name.findName(),
    username: faker.internet.userName(),
    image_url: `https://robohash.org/${faker.internet.userName()}.png?size=300x300`,
    emails: JSON.stringify([{ email: faker.internet.email().toLowerCase(), verified: true }]),
  }));

  await Promise.all(users.map(user =>
    db.table('users').insert(user).returning('id')
      .then(rows => db.table('users').where('id', '=', rows[0]).first('*'))
      .then(row => Object.assign(user, row))));

  // Create 10 lambdas
  const lambdas = Array.from({ length: 50 }).map(() => Object.assign(
    {
      owner_id: users[Math.floor(Math.random() * users.length)].id,
      name: faker.lorem.words(),
      slug: faker.lorem.slug(),
      description: faker.lorem.sentence() + faker.lorem.words() + faker.lorem.sentence() + faker.lorem.sentence(),
      public: 1,
      inputs: '[{"id":0,"name":"number_one","type":"","example":"2"},{"id":1,"name":"number_two","type":"","test":"","example":"5"},{"id":2,"name":"operation","type":"","test":"","example":"add"}]',
      code: `
/* Here's your Lambda playground
 * Access variables from the input section like so: */

// Prints the first input above (an empty string by default)
function entryPoint(inputs){
  var n1 = parseInt(inputs[0])
  var n2 = parseInt(inputs[1])
  var operation = inputs[2]

  switch(operation){
    case 'add':
      return n1+n2;
      break;
    case 'multiply':
      return n1*n2;
      break;
    case 'subtract':
      return n1-n2;
      break;
    case 'divide':
      return n1/n2;
      break;
    default:
      return 'Please use one of ["add","multiply","subtract","divide"] for the operation field'
  }
}`
    },
    (date => ({ created_at: date, updated_at: date }))(faker.date.past())));

  await Promise.all(lambdas.map(lambda =>
    db.table('lambdas').insert(lambda).returning('id')
      .then(rows => db.table('lambdas').where('id', '=', rows[0]).first('*'))
      .then(row => Object.assign(lambda, row))));
};



   /* table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.uuid('owner_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.string('name', 100).notNullable();
    table.string('slug', 100).notNullable().unique();
    table.string('description', 400);
    table.integer('public').notNullable().defaultTo(0);
    table.string('inputs', 1000); // Stored as JSON
    table.string('code', 10000).notNullable();*/
