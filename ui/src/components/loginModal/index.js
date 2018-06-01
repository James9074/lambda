// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
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
      password: '',
      loading: false,
      error: false,
      errorText: ''
    };
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  editUserName = (event) => {
    this.setState({ username: event.target.value })
    event.preventDefault();
  }

  editPassword = (event) => {
    this.setState({ password: event.target.value })
    event.preventDefault();
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
    if (this.state.username === '' || this.state.password === '')
      return this.setState({
        loading: false,
        error: true,
        errorText: 'Please supply a username and password to log in' })
    this.setState({ loading: true });
    axios.post('/login/ldapauth', {
      username: this.state.username,
      password: this.state.password
    })
    .then(() => {
      this.setState({ loading: false, error: false, errorText: '' });
      window.location.reload();
    })
    .catch((error) => {
      console.log(error)
      this.setState({
        loading: false,
        error: true,
        errorText: error.response.status === 401 ?
        'Invalid credentials, pelase try again' : 'There was an error while trying to authenticate you' })
    });
  }

  render(){
    const { classes, isOpen, onClose } = this.props
    let useLdap = process.env.USE_LDAP;
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
                onChange={e => this.editUserName(e)}
                onKeyPress={this.catchReturn}
                margin="none"
                error={this.state.error}
              />

              <TextField
                id="login-password"
                type="password"
                value={this.state.password}
                placeholder="Password"
                onChange={e => this.editPassword(e)}
                onKeyPress={this.catchReturn}
                margin="none"
                error={this.state.error}
              />
            </div>
            <Typography className={classes.error}>{this.state.errorText}</Typography>
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
            {this.state.loading ?
              <CircularProgress size={14} /> : // Size 14 works pretty well
              <Typography>Login</Typography>}
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
