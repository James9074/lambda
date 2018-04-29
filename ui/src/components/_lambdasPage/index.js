// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import LambdaCard from 'components/lambdaCard'
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import Hidden from 'material-ui/Hidden'
import { CircularProgress } from 'material-ui/Progress';
import SmallHeader from 'components/smallHeader'
import { gql, graphql } from 'react-apollo';
import styles from './styles'

const GetLambdasQuery = gql`
query GetAllLambdas($afterCursor: String!) {
  lambdas(first: 10, after:$afterCursor) {
    edges {
      node {
        id
        name
        description
        slug
        inputs
        language
        createdAt
        owner{
          displayName,
          username
        }
      },
      cursor
    }
    pageInfo{
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}`
@withStyles(styles)
@graphql(GetLambdasQuery, {
  options: ownProps => ({
    variables: {
      afterCursor: ownProps.afterCursor || '' // ownProps are the props that are added from the parent component
    },
  }) })
class Lambdas extends Component {
  constructor(props){
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
    const { data, classes } = this.props;

    if (data && data.error){
      return (<div className={classes.loading}>
        <Typography variant="headline">There is Error</Typography>
        </div>)
    }
    if (!data.lambdas){
      return (<div className={classes.loading}>
        <CircularProgress color="secondary" size={100} />
        <Typography variant="headline">Loading</Typography>
        </div>)
    }
    return (
      <div className={classes.root}>
        <Hidden smDown>
          <Grid item xs={12} className={classes.jumbo}>
            <Paper>
              <Grid container>
                <Grid item xs={2}>
                  <Typography color="primary" variant="headline" className={classes.lambdaIcon}>
                    λ
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <div className={classes.welcomeContainer}>
                    <Typography variant="headline">
                      <b>lambda</b> | noun | lamb·da
                    </Typography>
                    <span className={classes.definition}>In computer programming, an anonymous function (function literal, lambda abstraction) is a function definition that is not bound to an identifier.</span>
                  </div>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Hidden>

        <Hidden mdUp>
          <SmallHeader content={'View Lambdas'}/>
        </Hidden>

        <AppBar position="static" color="default" className={classes.tabs}>
          <Tabs
            value={this.state.index}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
          >
            <Tab label="Popular" />
            <Tab label="Latest" />
            <Tab label="Starred" />
            <Tab label="All" />
            <Tab label="Mine" />
          </Tabs>
        </AppBar>

          <Grid container spacing={24}>
            {data.lambdas.edges.map(item =>
              (<Grid item xs={12} lg={6} className={classes.lambdaCard} key={item.node.id}>
                  <LambdaCard lambda={Object.assign({}, item.node, { inputs: JSON.parse(item.node.inputs) })}/>
                </Grid>))}
          </Grid>
      </div>
    );
  }
}

export default Lambdas;
