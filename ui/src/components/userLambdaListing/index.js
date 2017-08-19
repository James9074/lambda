// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import LambdaCard from 'components/lambdaCard'
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { CircularProgress } from 'material-ui/Progress';
import styles from './styles'

import { gql, graphql } from 'react-apollo';

@withStyles(styles)
@graphql(gql`query GetAllLambdasByUsername($name: String!) { lambdas(username:$name) { edges { node { id name slug owner_id createdAt owner{ displayName, username, emails { email } } } } } }`, {
  options: ownProps => ({
    variables: {
      name: ownProps.username // ownProps are the props that are added from the parent component
    },
  }) })

class UserLambdaListing extends Component {
  constructor(props, context){
    super(props);
  }

  static propTypes = {
    username: PropTypes.string.isRequired
  }


  render(){
    const { data, classes, username } = this.props;

    if (!data.lambdas || !username){
      return (<div className={classes.loading}>
        <CircularProgress color="accent" size={100} />
        <Typography type="headline">Loading</Typography>
        </div>)
    }

    return (
      <div className={classes.root}>

          <Grid container gutter={24}>
            {data.lambdas.edges.map(item => (<Grid key={item.node.id} item xs={12} lg={6} className={classes.lambdaCard}>
                        <LambdaCard lambda={item.node}/>
                      </Grid>))}
          </Grid>
      </div>
    );
  }
}

export default UserLambdaListing;
