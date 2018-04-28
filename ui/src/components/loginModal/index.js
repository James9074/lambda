// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import styles from './styles'

@withStyles(styles)
class LoginModal extends Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  directToAuth = (provider) => {
    window.location = `/login/${provider}?return=${this.props.returnTo || '/'}`
  }

  render(){
    const { isOpen, onClose } = this.props
    return (
        <Dialog open={isOpen} onClose={onClose}>
          <DialogTitle>
            {'Login'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Login to create your own Lambdas
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button disabled raised onClick={() => this.directToAuth('google')} color="primary">
              Google
            </Button>
            <Button raised onClick={() => this.directToAuth('github')} color="secondary">
              GitHub
            </Button>
            <Button disabled raised onClick={() => this.directToAuth('twitter')} color="primary">
              Twitter
            </Button>
          </DialogActions>
        </Dialog>
    )
  }
}

export default LoginModal;
