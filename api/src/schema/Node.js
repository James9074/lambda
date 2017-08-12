/* @flow */
/* eslint-disable global-require, no-underscore-dangle */

import { nodeDefinitions, fromGlobalId } from 'graphql-relay';

const { nodeInterface, nodeField: node, nodesField: nodes } = nodeDefinitions(
  (globalId, context) => {
    const { type, id } = fromGlobalId(globalId);

    if (type === 'User') return context.users.load(id);
    if (type === 'Lambda') return context.lambdas.load(id);
    if (type === 'Comment') return context.comments.load(id);

    return null;
  },
  (obj) => {
    if (obj.__type === 'User') return require('./UserType').default;
    if (obj.__type === 'Lambda') return require('./LambdaType').default;
    if (obj.__type === 'Comment') return require('./CommentType').default;

    return null;
  },
);

export { nodeInterface, node, nodes };
