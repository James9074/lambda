/* @flow */

/*
 * Data loaders to be used with GraphQL resolve() functions. For example:
 *
 *   resolve(post, args, { users }) {
 *     return users.load(post.author_id);
 *   }
 *
 * For more information visit https://github.com/facebook/dataloader
 */

import DataLoader from 'dataloader';

import db from './db';

// Appends type information to an object, e.g. { id: 1 } => { __type: 'User', id: 1 };
function assignType(obj: any, type: string) {
  // eslint-disable-next-line no-param-reassign, no-underscore-dangle
  obj.__type = type;
  return obj;
}

function mapTo(keys, keyFn, type, rows) {
  if (!rows) return mapTo.bind(null, keys, keyFn, type);
  const group = new Map(keys.map(key => [key, null]));
  rows.forEach(row => group.set(keyFn(row), assignType(row, type)));
  return Array.from(group.values());
}

// These are for the future, to be used just like mapTo()
function mapToMany(keys, keyFn, type, rows) {
  if (!rows) return mapToMany.bind(null, keys, keyFn, type);
  const group = new Map(keys.map(key => [key, []]));
  rows.forEach(row => group.get(keyFn(row)).push(assignType(row, type)));
  return Array.from(group.values());
}

function mapToValues(keys, keyFn, valueFn, rows) {
  if (!rows) return mapToValues.bind(null, keys, keyFn, valueFn);
  const group = new Map(keys.map(key => [key, null]));
  rows.forEach(row => group.set(keyFn(row), valueFn(row)));
  return Array.from(group.values());
}


export default {
  create: () => ({
    users: new DataLoader(keys => db.table('users')
      .whereIn('id', keys).select()
      .then(mapTo(keys, x => x.id, 'User'))),

    lambdas: new DataLoader(keys => db.table('lambdas').select()
      .whereIn('id', keys).select()
      .then(mapTo(keys, x => x.id, 'Lambda'))),


    lambdasByUserId: new DataLoader(keys =>
      db
        .table('lambdas')
        .whereIn('owner_id', keys)
        .select()
        .then(mapToMany(keys, x => x.owner_id, 'Owner')),
      ),

    lambdaBySlug: new DataLoader(keys =>
      db
        .table('lambdas')
        .whereIn('slug', keys)
        .select()
        .then(mapTo(keys, x => x.slug, 'Lambda')),
      ),

    userByLambdaId: new DataLoader(keys =>
      db
        .table('users')
        .whereIn('owner_id', keys)
        .select()
        .then(mapTo(keys, x => x.id, 'User')),
    ),

    userByUsername: new DataLoader(keys =>
      db
        .table('users')
        .whereIn('username', keys)
        .select()
        .then(mapTo(keys, x => x.username, 'User')),
    ),

    /* Example of selecting a lambda's employees/users
    lambdaUsersCount: new DataLoader(keys => db.table('lambdas')
      .leftJoin('people', 'lambdas.id', 'people.lambda_id')
      .whereIn('lambdas.id', keys)
      .groupBy('lambdas.id')
      .select('lambdas.id', db.raw('count(comments.lambda_id)'))
      .then(mapToValues(keys, x => x.id, x => x.count))),
    */
  })
};
