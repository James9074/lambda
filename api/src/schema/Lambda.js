/* @flow */

import validator from 'validator';
import shortid from 'shortid';
import { GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt } from 'graphql';
import {
  fromGlobalId,
  connectionDefinitions,
  forwardConnectionArgs,
  connectionFromArraySlice,
  cursorToOffset,
  mutationWithClientMutationId,
} from 'graphql-relay';

import db from '../db';
import LambdaType from './LambdaType';
import ValidationError from './ValidationError';

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

export const lambda = {
  type: LambdaType,
  args: {
    id: {
      type: GraphQLID
    },
    slug: {
      type: GraphQLString
    }
  },
  resolve(root, args, { lambdas, lambdaBySlug }) {
    if (args.id)
      return args.id && lambdas.load(args.id);
    else if (args.slug){
      return args.slug && lambdaBySlug.load(args.slug);
    }
  },
};

export const lambdas = {
  type: connectionDefinitions({
    name: 'Lambda',
    nodeType: LambdaType,
    connectionFields: {
      totalCount: { type: new GraphQLNonNull(GraphQLInt) },
    },
  }).connectionType,
  args: {
    username: { type: GraphQLString },
    search: { type: GraphQLString },
    ...forwardConnectionArgs },
  async resolve(root, args) {
    const limit = typeof args.first === 'undefined' ? '10' : args.first;
    const offset = args.after ? cursorToOffset(args.after) + 1 : 0;

    let user = null;
    if (args.username){
      const [aUser] = await Promise.all([
        db.table('users')
          .limit(1)
          .where('username', args.username)
          .then(rows => rows.map(x => Object.assign(x, { __type: 'User' })))
      ]);
      if (aUser.length > 0)
        user = aUser[0];
    }

    let query = db.table('lambdas')
      .orderBy('created_at', 'desc')
      .limit(limit).offset(offset)
    if (user)
      query.where('owner_id', user.id);

    let searchString = args.search && args.search.replace(/[^a-z\d ]+/gi, '').replace(/ +(?= )/g, '').trim().replaceAll(' ', ' & ')
    if (searchString && searchString.length > 0){
      query = db.raw(`
        SELECT id, name, owner_id, slug, description
        FROM (SELECT lambdas.id as id,
            lambdas.name as name,
            lambdas.description as description,
            lambdas.slug as slug,
            lambdas.owner_id as owner_id,
            to_tsvector(lambdas.name) || ' ' ||
            to_tsvector(coalesce((string_agg(lambdas.description, ' ')), '')) || ' ' ||
            to_tsvector(users.username) || ' ' ||
            to_tsvector(users.display_name) as document
          FROM lambdas JOIN users ON users.id = lambdas.owner_id
          GROUP BY lambdas.id, users.id) p_search
        WHERE p_search.document @@ to_tsquery(?)
        LIMIT 10
      `, `${searchString}:*`).then(rows => rows.rows.map(x => Object.assign(x, { __type: 'Lambda' })))
    } else
      query.then(rows => rows.map(x => Object.assign(x, { __type: 'Lambda' })))

    const [data, totalCount] = await Promise.all([
      query,
      db.table('lambdas')
        .count().then(x => x[0].count),
    ]);

    return {
      ...connectionFromArraySlice(data, args, {
        sliceStart: offset,
        arrayLength: totalCount,
      }),
      totalCount,
    };
  },
};

const inputFields = {
  name: {
    type: GraphQLString
  },

  slug: {
    type: GraphQLString
  },

  description: {
    type: GraphQLString
  },

  public: {
    type: new GraphQLNonNull(GraphQLInt)
  },

  inputs: {
    type: GraphQLString
  },

  code: {
    type: GraphQLString
  },

  owner_id: {
    type: GraphQLString
  },
};

const outputFields = {
  lambda: {
    type: LambdaType,
  },
};

function validate(input, { t, user }) {
  const errors = [];
  const data = {};

  if (!user) {
    throw new ValidationError([{ key: '', message: t('Only authenticated users can create lambdas.') }]);
  }

  /* Validations for name */
  if (typeof input.name === 'undefined' || input.name.trim() === '') {
    errors.push({ key: 'name', message: t('The name field cannot be empty.') });
  } else if (!validator.isLength(input.name, { min: 3, max: 80 })) {
    errors.push({ key: 'name', message: t('The name field must be between 3 and 80 characters long.') });
  } else {
    data.name = input.name;
  }

  /* Validations for slug */
  if (typeof input.slug !== 'undefined' && input.slug.trim() !== '') {
    if (!validator.isLength(input.slug, { min: 3, max: 15 })) {
      errors.push({ key: 'slug', message: t('The slug field must be between 3 and 15 characters long.') });
    } else {
      data.slug = input.slug;
    }
  } else {
    data.slug = shortid.generate();
  }

  /* Validations for description */
  if (typeof input.description !== 'undefined') {
    if (!validator.isLength(input.description, { max: 400 })) {
      errors.push({ key: 'description', message: t('The description field cannot be longer than 400 characters long.') });
    } else {
      data.description = input.description;
    }
  } else data.description = '';

  /* Validations for public */
  if (typeof input.public !== 'undefined') {
    if (!validator.isInt(input.public.toString())) {
      errors.push({ key: 'public', message: t('The public field must be an integer.') });
    } else {
      data.public = input.public;
    }
  } else data.public = 0;

  /* Validations for inputs */
  try {
    let inputs = JSON.parse(input.inputs)
    let inputArray = inputs.map(x => x.name)
    let sortedInputs = inputArray.slice().sort()
    for (let i = 0; i < sortedInputs.length; i += 1) {
      if (i > 0 && sortedInputs[i].toLowerCase() === sortedInputs[i - 1].toLowerCase())
        errors.push({ key: 'inputs', message: t('The inputs must have unique names') })
    }
  } catch (e) { errors.push({ key: 'inputs', message: t('The inputs must be a valid JSON object with unique names') }); }

  if (typeof input.inputs !== 'undefined') {
    if (!validator.isLength(input.inputs, { max: 400 })) {
      errors.push({ key: 'inputs', message: t('The inputs field cannot be longer than 400 characters long.') });
    } else if (!validator.isJSON(input.inputs)) {
      errors.push({ key: 'inputs', message: t('The inputs must be a valid JSON object.') });
    } else {
      data.inputs = input.inputs;
    }
  } else data.inputs = '{}';

  /* Validations for code */
  if (typeof input.code === 'undefined' || !validator.isLength(input.code, { min: 5, max: 10000 })) {
    errors.push({ key: 'code', message: t('The code field must be between 5 and 10000 characters long.') });
  } else {
    data.code = input.code;
  }

  return { data, errors };
}

export const createLambda = mutationWithClientMutationId({
  name: 'CreateLambda',
  inputFields,
  outputFields,
  async mutateAndGetPayload(input, context) {
    const { data, errors } = validate(input, context);

    // Ensure our lambda owner is the current user
    if (!context.user || context.user === undefined)
      return null;

    data.owner_id = context.user.id;

    if (errors.length) {
      throw new ValidationError(errors);
    }

    const rows = await db.table('lambdas').insert(data).returning('id');
    return context.lambdas.load(rows[0]).then(x => ({ lambda: x }));
  },
});

export const deleteLambda = mutationWithClientMutationId({
  name: 'DeleteLambda',
  inputFields: {
    slug: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    result: { type: GraphQLString },
  },
  async mutateAndGetPayload(input, context) {
    const { slug } = input

    let errors = []
    const lambdaToDelete = await db.table('lambdas').where('slug', '=', slug).first('*');

    if (!lambdaToDelete) {
      errors.push({ key: '', message: 'That lambda was not found. Please make sure that it exists.' });
    } else if (lambdaToDelete.owner_id !== context.user.id){
      errors.push({ key: '', message: 'Only the lambda owner can delete this lambda' });
    }

    if (errors.length) {
      throw new ValidationError(errors);
    }


    await db.table('lambdas').where('slug', '=', slug).delete();
    return { result: 'Succesfully deleted Lambda' }
  },
});

export const updateLambda = mutationWithClientMutationId({
  name: 'UpdateLambda',
  inputFields: {
    id: { type: GraphQLID },
    slug: { type: GraphQLString },
    ...inputFields
  },
  outputFields,
  async mutateAndGetPayload(input, context) {
    const { t } = context;

    let lambdaToUpdate = db.table('lambdas');

    if (input.id !== undefined) {
      const { type, id } = fromGlobalId(input.id);
      if (type !== 'Lambda') {
        throw new Error(t('The lambda ID is invalid.'));
      }
      lambdaToUpdate = lambdaToUpdate.where('id', '=', id)
    } else if (input.slug !== undefined){
      lambdaToUpdate = lambdaToUpdate.where('slug', '=', input.slug)
    }
    const { data, errors } = validate(input, context);
    lambdaToUpdate = await lambdaToUpdate.first('*');

    if (!lambdaToUpdate) {
      errors.push({ key: '', message: 'That lambda was not found. Please make sure that it exists.' });
    } else if (lambdaToUpdate.owner_id !== context.user.id){
      errors.push({ key: '', message: 'Only the lambda owner can update this lambda' });
    }

    if (errors.length) {
      throw new ValidationError(errors);
    }

    data.updated_at = db.raw('CURRENT_TIMESTAMP');

    await db.table('lambdas').where('id', '=', lambdaToUpdate.id).update(data);
    await context.lambdas.clear(lambdaToUpdate.id);
    return context.lambdas.load(lambdaToUpdate.id).then(x => ({ lambda: x }));
  },
});

// Util
String.prototype.replaceAll = function(search, replacement) {
  let target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};
