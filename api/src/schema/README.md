# GraphQL Schema

```js
import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { me } from './User';
import { node, nodes } from './Node';
import { lambdas, createLambda, updateLambda } from './Lambda';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      me,
      node,
      nodes,
      lambdas,
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
```

## The Top-level Fields and Mutations

* `Node`
* `Lambda`
* `User`

## GraphQL Types

* `EmailType`
* `LambdaType`
* `UserType`

## Utility Classes

* `ValidationError`
