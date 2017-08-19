// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import UserLambdaListing from 'components/userLambdaListing'
import styles from './styles'
import SmallHeader from 'components/smallHeader';

@withStyles(styles)
class UserPage extends Component {
  constructor(props, context){
    super(props);
    this.state = {
      index: 0
    }
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  handleChange = (event, index) => {
    this.setState({ index });
  };

  render(){
    const { classes } = this.props;
    const user = this.context.router.route.match.params.user;

    return (
      <div className={classes.root}>
          <SmallHeader content={`Lambdas for ${user}`}/>

          <Grid container gutter={24}>
            <UserLambdaListing username={user} />
          </Grid>
      </div>
    );
  }
}

export default UserPage;
