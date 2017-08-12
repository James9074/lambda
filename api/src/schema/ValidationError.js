/* @flow */

import { GraphQLError } from 'graphql';

type StateError = {
  key: string,
  message: string,
};

export default class ValidationError extends GraphQLError {
  state: any;
  constructor(errors: Array<StateError>) {
    super('The request is invalid.');
    this.state = errors.reduce((result, error) => {
      if (Object.prototype.hasOwnProperty.call(result, error.key)) {
        result[error.key].push(error.message);
      } else {
        Object.defineProperty(result, error.key, {
          value: [error.message],
          enumerable: true,
        });
      }
      return result;
    }, {});
  }
}
