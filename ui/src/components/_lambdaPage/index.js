// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ViewLambda from 'components/viewLambda'
import styles from './styles'

function lambdaPage(props, context) {
  const classes = props.classes;

  return (
    <Grid container justify="flex-start" className={classes.card}>
      <Grid item xs={3} >
        {/* <Breadcrumbs /> */}
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
