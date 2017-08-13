// @flow

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import LoginModal from 'components/loginModal'
import styles from './styles'
import Menu, { MenuItem } from 'material-ui/Menu';
import Hidden from 'material-ui/Hidden'

@withStyles(styles)
class UserInfo extends Component {
  constructor(props, context){
    super(props);
    this.state = {
      loginModalOpen:false,
      userMenuOpen: false,
      userAnchorEl: undefined,      
    }
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount = () => {
    this.setState({'avatarNode':ReactDOM.findDOMNode(this.refs.avatar)})
  }

  handleRequestClose = () => {
    this.setState({loginModalOpen:false})
  }

  handleUserMenuOpen = event => {
    this.setState({ userMenuOpen: true, userAnchorEl: event.currentTarget });
  };

  handleUserMenuClick = (event, index) => {
    this.setState({ editoruser: index, userMenuOpen: false});
    switch(index){
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
    if(!user)
      return (
        <div className={classes.root}>
          <Button raised color="accent" className={classes.login} onClick={() => this.setState({ loginModalOpen: true })}>Log In</Button>
          <LoginModal onClose={this.handleRequestClose} isOpen={this.state.loginModalOpen} />
        </div>
      )
    let profilePic = user.imageUrl || `https://robohash.org/${user.username}.png?size=300x300`
    //TODO: Wow the css for this is abysmal. Let's fix that.
    return (
      <div className={classes.root}>
          <div className={classes.nameInfo}>
          <Button className={classes.avatar}  onClick={this.handleUserMenuOpen}>
            <Avatar alt="Avatar" src={profilePic}  ref="avatar"/>
          </Button>            
          <Hidden smDown>
            <div className={classes.nameText}>
              <span className={classes.displayName}>{user.displayName}</span>
              <span className={classes.userName}>{user.username}</span>
            </div>
          </Hidden>
          </div>

        <Menu
            id="user-menu"
            anchorEl={this.state.avatarNode}
            open={this.state.userMenuOpen}
            onRequestClose={this.handleUserMenuClose}
          >
          <MenuItem onClick={event => this.handleUserMenuClick(event, 1)}>Logout</MenuItem>
        </Menu>        
      </div>
    );
  }
}

export default UserInfo;