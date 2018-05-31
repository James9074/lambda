// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import styles from './styles'

function FullPageLoader(props) {
  const { classes, error } = props

  if (error)
    return (
      <div className={classes.loadingContainer} ><div className={classes.loading}>
        <Typography variant="headline" style={{ color: props.theme.palette.primary[500] }}>There was an error loading Lambda</Typography>
      </div></div>)

  return (
    <div className={classes.loadingContainer} ><div className={classes.loading}>
      <CircularProgress color="secondary" size={100} />
      <Typography variant="headline" style={{ color: props.theme.palette.primary[500] }}>Loading</Typography>
      </div>
    </div>)
}

export default withStyles(styles)(FullPageLoader);
