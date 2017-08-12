// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import LoginModal from 'components/loginModal'
import styles from './styles'

@withStyles(styles)
class UserInfo extends Component {
  constructor(props, context){
    super(props);
    this.state = {
      loginModalOpen:false
    }
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  handleRequestClose = () => {
    this.setState({loginModalOpen:false})
  }

  render(){
    const { user, classes } = this.props;
    if(!user)
      return (
        <div className={classes.root}>
          <Button onClick={() => this.setState({ loginModalOpen: true })}>Log In</Button>
          <LoginModal onClose={this.handleRequestClose} isOpen={this.state.loginModalOpen} />
        </div>
      )

    return (
      <div className={classes.root}>
        <Avatar alt="Avatar" src={'https://robohash.org/testUSer.png?size=300x300'} 
          className={classes.avatar} />
      </div>
    );
  }
}

export default UserInfo;