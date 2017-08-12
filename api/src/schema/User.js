/* @flow */
/* eslint-disable import/prefer-default-export */
import { GraphQLNonNull, GraphQLInt, GraphQLID, GraphQLString } from 'graphql';
import {
  connectionDefinitions,
  forwardConnectionArgs,
  connectionFromArraySlice,
  cursorToOffset,
} from 'graphql-relay';

import db from '../db';
import UserType from './UserType';

export const me = {
  type: UserType,
  resolve(root, args, { user, users }) {
    return user && users.load(user.id);
  },
};

export const user = {
  type: UserType,
  args: {
    id: {
      type: GraphQLID
    },
    username: {
      type: GraphQLString
    }
  },
  resolve(root, args, { users, userByUsername }) {
    if (args.id)
      return args.id && users.load(args.id);
    else if (args.username)
      return args.username && userByUsername.load(args.username);
  },
};

export const users = {
  type: connectionDefinitions({
    name: 'User',
    nodeType: UserType,
    connectionFields: {
      totalCount: { type: new GraphQLNonNull(GraphQLInt) },
    },
  }).connectionType,
  args: forwardConnectionArgs,
  async resolve(root, args) {
    const limit = typeof args.first === 'undefined' ? '10' : args.first;
    const offset = args.after ? cursorToOffset(args.after) + 1 : 0;

    const [data, totalCount] = await Promise.all([
      db.table('users')
        .orderBy('created_at', 'desc')
        .limit(limit).offset(offset)
        .then(rows => rows.map(x => Object.assign(x, { __type: 'User' }))),
      db.table('users')
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
