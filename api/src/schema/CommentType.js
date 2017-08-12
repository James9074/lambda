/* @flow */

import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { nodeInterface } from './Node';

import LambdaType from './LambdaType';

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  interfaces: [nodeInterface],
  fields: () => ({
    id: globalIdField(),

    lambda: {
      type: new GraphQLNonNull(LambdaType),
      resolve(parent, args, { lambdas }) {
        return lambdas.load(parent.lambda_id);
      },
    },

    parent: {
      type: new GraphQLNonNull(CommentType),
      resolve(parent, args, { comments }) {
        return comments.load(parent.parent_id);
      },
    },

    text: {
      type: GraphQLString,
    },

    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(parent) {
        return parent.created_at;
      },
    },

    updatedAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(parent) {
        return parent.updated_at;
      },
    },
  }),
});

export default CommentType;
