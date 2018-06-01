// @flow

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import LoginModal from 'components/loginModal'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Hidden from '@material-ui/core/Hidden'
import styles from './styles'

@withStyles(styles)
class UserInfo extends Component {
  constructor(props){
    super(props);
    this.state = {
      loginModalOpen: false,
      userMenuOpen: false,
      userAnchorEl: undefined,
    }
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount = () => {
    this.setState({ avatarNode: ReactDOM.findDOMNode(this.refs.avatar) })
  }

  handleRequestClose = () => {
    this.setState({ loginModalOpen: false })
  }

  handleUserMenuOpen = (event) => {
    this.setState({ userMenuOpen: true, userAnchorEl: event.currentTarget });
  };

  handleUserMenuClick = (event, index) => {
    this.setState({ editoruser: index, userMenuOpen: false });
    switch (index){
      case 1:
        window.location = '/login/clear';
        break;
      default:
        break;
    }
  };

  handleUserMenuClose = () => {
    this.setState({ userMenuOpen: false });
  };

  render(){
    const { user, classes } = this.props;
    if (!user)
      return (
        <div className={classes.root}>
          <Hidden smUp>
            <Button color="secondary" className={classes.loginSmall} onClick={() => this.setState({ loginModalOpen: true })}>Log In</Button>
          </Hidden>
          <Hidden xsDown>
            <Button color="secondary" className={classes.login} onClick={() => this.setState({ loginModalOpen: true })}>Log In</Button>
          </Hidden>
          <LoginModal onClose={this.handleRequestClose} useLdap={true} isOpen={this.state.loginModalOpen} />
        </div>
      )
    let profilePic = user.imageUrl || `https://robohash.org/${user.username}.png?size=300x300`
    // TODO: Wow the css for this is abysmal. Let's fix that.
    return (
      <div className={classes.root}>
          <div className={classes.nameInfo}>
          <Button className={classes.avatar} onClick={this.handleUserMenuOpen}>
            <Avatar alt="" src={profilePic} ref="avatar"/>
          </Button>
          <Hidden smDown>
            <div className={classes.nameText}>
              <span className={classes.displayName}>{user.displayName || user.username}</span>
              <span className={classes.userName}>{user.displayName && user.username}</span>
            </div>
          </Hidden>
          </div>

        <Menu
            id="user-menu"
            anchorEl={this.state.avatarNode}
            open={this.state.userMenuOpen}
            onClose={this.handleUserMenuClose}
          >
          <MenuItem onClick={event => this.handleUserMenuClick(event, 1)}>Logout</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default UserInfo;
