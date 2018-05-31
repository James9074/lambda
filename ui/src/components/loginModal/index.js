// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import styles from './styles'

@withStyles(styles)
class LoginModal extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  editUserName = (event, i) => {
    this.setState({ username: i })
  }

  editPassword = (event, i) => {
    this.setState({ password: i })
  }

  catchReturn = (ev) => {
    if (ev.key === 'Enter') {
      this.ldapAuth(ev)
      ev.preventDefault();
    }
  }

  directToAuth = (provider) => {
    window.location = `/login/${provider}?return=${this.props.returnTo || '/'}`
  }

  ldapAuth = () => {
    axios.post('/login/ldapauth', {
      firstName: 'Fred',
      lastName: 'Flintstone'
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render(){
    const { useLdap, classes, isOpen, onClose } = this.props
    return (
        <Dialog open={isOpen} onClose={onClose}>
          <DialogTitle>
            {'Login'}
          </DialogTitle>
          { useLdap && (<DialogContent>
            <DialogContentText>
              <span>Login with LDAP to create your own Lambdas</span>
            </DialogContentText>
            <div className={classes.ldapLogin}>
              <TextField
                id="login-username"
                value={this.state.username}
                placeholder="Username"
                onChange={(e, i) => this.editUserName(e, i)}
                onKeyPress={this.catchReturn}
                margin="none"
              />

              <TextField
                id="login-password"
                type="password"
                value={this.state.password}
                placeholder="Password"
                onChange={(e, i) => this.editPassword(e, i)}
                onKeyPress={this.catchReturn}
                margin="none"
              />
            </div>
          </DialogContent>)}
          {!useLdap && (<DialogContent>
            <DialogContentText>
              Please login to create Lambdas
            </DialogContentText>
          </DialogContent>)}
          {useLdap && (<DialogActions>
            <Button onClick={() => this.props.onClose()} color="secondary">
              Cancel
            </Button>
            <Button onClick={() => this.ldapAuth()} color="primary">
              Login
            </Button>
          </DialogActions>)}

          {!useLdap && (<DialogActions>
            <Button disabled onClick={() => this.directToAuth('google')} color="primary">
              Google
            </Button>
            <Button onClick={() => this.directToAuth('github')} color="secondary">
              GitHub
            </Button>
            <Button disabled onClick={() => this.directToAuth('twitter')} color="primary">
              Twitter
            </Button>
          </DialogActions>)}
        </Dialog>
    )
  }
}

export default LoginModal;
