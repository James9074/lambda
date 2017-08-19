// @flow weak

import { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import styles from './styles'
import Drawer from 'material-ui/Drawer';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import SendIcon from 'material-ui-icons/Send';
import HomeIcon from 'material-ui-icons/Home';
import MenuIcon from 'material-ui-icons/Menu';
import AddIcon from 'material-ui-icons/Add';


class AppDrawer extends Component {
  state = {
    open: {
      top: false,
      left: false,
      bottom: false,
      right: false,
    },
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  toggleDrawer = (side, open) => {
    const drawerState = {};
    drawerState[side] = open;
    this.setState({ open: drawerState });
  };

  handleLeftOpen = () => this.toggleDrawer('left', true);
  handleLeftClose = () => this.toggleDrawer('left', false);

  render() {
    const classes = this.props.classes;

    const mailFolderListItems = (
      <div>
        <ListItem>

        </ListItem>
        <ListItem button onClick={() => this.context.router.history.push('/')}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        { this.props.user && (<ListItem button onClick={() => this.context.router.history.push(`/users/${this.props.user.username}`)}>
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <ListItemText primary="My Lambdas" />
        </ListItem>)}
        <ListItem button onClick={() => this.context.router.history.push('/lambdas/new')}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="New Lambda" />
        </ListItem>
      </div>
    );

    const sideList = (
      <div>
        <List className={classes.list} disablePadding>
          {mailFolderListItems}
        </List>
      </div>
    );

    return (
      <div style={{ display: 'inline-block' }}>
        <Button onClick={this.handleLeftOpen} className={classes.menuButton} ><MenuIcon color="white" /></Button>
        <Drawer
          open={this.state.open.left}
          onRequestClose={this.handleLeftClose}
          onClick={this.handleLeftClose}
        >
          {sideList}
        </Drawer>
      </div>
    );
  }
}

AppDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppDrawer);
