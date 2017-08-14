// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
//import Breadcrumbs from 'components/breadcrumbs'
import styles from './styles'
import ViewLambda from 'components/viewLambda'

function lambdaPage(props, context) {
  const classes = props.classes;

  return (
    <Grid container gutter={0} justify="flex-start" className={classes.card}>
      <Grid item xs={3} >
        {/*<Breadcrumbs />*/}
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.root}>
          <ViewLambda slug={context.router.route.match.params.slug} />
        </Paper>
      </Grid>
    </Grid>
  );
}

lambdaPage.propTypes = {
  classes: PropTypes.object.isRequired,
  router: PropTypes.object,
};

lambdaPage.contextTypes = {
  router: PropTypes.object,
};

export default withStyles(styles)(lambdaPage);


