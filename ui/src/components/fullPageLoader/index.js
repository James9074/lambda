// @flow
import React from 'react';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import styles from './styles'

function FullPageLoader(props) {
  const { classes } = props

  return (
    <div className={classes.loadingContainer} ><div className={classes.loading}>
      <CircularProgress color="accent" size={100} />
      <Typography type="headline" style={{ color: props.theme.palette.primary[500] }}>Loading</Typography>
      </div>
    </div>)
}

export default withStyles(styles)(FullPageLoader);
