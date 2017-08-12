/* @flow */

import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { me, user, users } from './User';
import { node, nodes } from './Node';
import { lambdas, createLambda, updateLambda, lambda } from './Lambda';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      me,
      user,
      users,
      node,
      nodes,
      lambda,
      lambdas
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createLambda,
      updateLambda,
    },
  }),
});
