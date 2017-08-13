/* @flow */

import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { nodeInterface } from './Node';
import CommentType from './CommentType';
import UserType from './UserType';


export default new GraphQLObjectType({
  name: 'Lambda',
  description: 'A lambda object',
  interfaces: [nodeInterface],

  fields: () => ({
    id: globalIdField(),

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
      type: GraphQLString,
      resolve(parent) {
        return JSON.stringify(parent.inputs);
      },
    },

    code: {
      type: GraphQLString
    },

    owner_id: {
      type: GraphQLString
    },

    owner: {
      type: new GraphQLNonNull(UserType),
      resolve(parent, args, { users }) {
        return users.load(parent.owner_id);
      },
    },

    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent, args, { commentsByLambdaId }) {
        return commentsByLambdaId.load(parent.id);
      },
    },

    commentsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve(parent, args, { lambdaCommentsCount }) {
        return lambdaCommentsCount.load(parent.id);
      },
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
