/* @flow */

import { GraphQLObjectType, GraphQLList, GraphQLString, } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { nodeInterface } from './Node';

import LambdaType from './LambdaType';
import EmailType from './EmailType';

export default new GraphQLObjectType({
  name: 'User',
  interfaces: [nodeInterface],

  fields: () => ({
    id: globalIdField(),

    displayName: {
      type: GraphQLString,
      resolve(parent) {
        return parent.display_name;
      },
    },

    username: {
      type: GraphQLString,
    },

    emails: {
      type: new GraphQLList(EmailType),
      resolve(parent, args, { user }) {
        return user && parent.id === user.id ? parent.emails : null;
      },
    },

    imageUrl: {
      type: GraphQLString,
      resolve(parent) {
        return parent.image_url;
      },
    },

    lambdas: {
      type: new GraphQLList(LambdaType),
      resolve(parent, args, { lambdasByUserId }) {
        return lambdasByUserId.load(parent.id);
      },
    },
  }),
});
