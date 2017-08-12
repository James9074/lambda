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

  render(){
    const { isOpen, onClose } = this.props
    return (
        <Dialog open={isOpen} onRequestClose={onClose}>
          <DialogTitle>
            {"Use Google's location service?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Let Google help apps determine location. This means sending anonymous location data to
              Google, even when no apps are running.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Disagree
            </Button>
            <Button onClick={onClose} color="primary">
              Agree
            </Button>
          </DialogActions>
        </Dialog>
    )
  }
}

export default LoginModal;