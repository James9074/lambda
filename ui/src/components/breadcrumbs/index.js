// @flow

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import styles from './styles'

function Breadcrumbs(props, context) {
  const { classes } = props

  return (
    <div>
      <Button color="secondary"
        className={classes.button}
        onClick={() => context.router.history.goBack()}
        disableRipple
        disableFocusRipple>
          &lt; Back
      </Button>
    </div>
  );
}

Breadcrumbs.propTypes = {
  classes: PropTypes.object.isRequired,
  router: PropTypes.shape({
    history: PropTypes.object.isRequired,
  }),
};

Breadcrumbs.contextTypes = {
  router: PropTypes.object
}
export default withStyles(styles)(Breadcrumbs);
