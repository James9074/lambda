/* @flow */

import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';

export default new GraphQLObjectType({
  name: 'Email',
  fields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },

    verified: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve(parent) {
        return !!parent.verified;
      },
    },
  },
});
