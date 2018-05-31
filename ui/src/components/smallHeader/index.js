// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import styles from './styles'

@withStyles(styles)
class NewLambda extends Component {
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
    const { classes, content } = this.props;

    return (
      <div className={classes.root}>
        <Paper elevation={3}>
          <Grid item xs={12} className={classes.header}>
              <Grid container style={{ height: '70px' }}>
                <Grid item xs={1} className={classes.lambdaContainer}>
                  <Typography variant="headline" className={classes.lambdaIcon}>
                    λ
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <div className={classes.messageContainer}>
                    <Typography variant="headline">
                      <b>{content}</b>
                    </Typography>
                  </div>
                </Grid>
              </Grid>

          </Grid>
        </Paper>
      </div>
    );
  }
}

export default NewLambda;
