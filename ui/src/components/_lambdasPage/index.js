// @flow

import { Component } from 'react';
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
import styles from './styles'

import { gql, graphql } from 'react-apollo';

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

    if (!data.lambdas){
      return (<div className={classes.loading}>
        <CircularProgress color="accent" size={100} />
        <Typography type="headline">Loading</Typography>
        </div>)
    }
    return (
      <div className={classes.root}>
        <Hidden smDown>
          <Grid item xs={12} className={classes.jumbo}>
            <Paper>
              <Grid container>
                <Grid item xs={2}>
                  <Typography type="headline" className={classes.lambdaIcon}>
                    λ
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <div className={classes.welcomeContainer}>
                    <Typography type="headline">
                      <b>lambda</b> | noun | lamb·da | \ˈlam-də\
                    </Typography>
                    <span className={classes.definition}>In computer programming, an anonymous function (function literal, lambda abstraction) is a function definition that is not bound to an identifier. Anonymous functions are often:</span>
                        <span className={classes.bullet}>• Arguments being passed to higher-order functions, or </span>
                        <span className={classes.bullet}>• Used for constructing the result of a higher-order function that needs to return a function. </span>

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
            index={this.state.index}
            onChange={this.handleChange}
            indicatorColor="accent"
            textColor="#a9a9a9"
            fullWidth
          >
            <Tab label="Popular" />
            <Tab label="Latest" />
            <Tab label="Starred" />
            <Tab label="All" />
            <Tab label="Mine" />
          </Tabs>
        </AppBar>

          <Grid container gutter={24}>
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
