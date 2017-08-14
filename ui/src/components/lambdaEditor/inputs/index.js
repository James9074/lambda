// @flow weak

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import StarIcon from 'material-ui-icons/Star';
import Slide from 'material-ui/transitions/Slide';
import styles from './styles'


class LambdaInputs extends Component {
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

  render() {
    const classes = this.props.classes;

    return (
      <div className={classes.root} onClick={this.props.onClose}>
        <div className={classes.inputsContainer} onClick={(e)=>e.preventDefault()}>
          <Slide 
            in={this.props.show}
            direction={'right'} 
            enterTransitionDuration={150}
            leaveTransitionDuration={150}
            transitionAppear={!this.state.firstMount}>
            <List className={classes.panel}>
              <ListItem button>
                <ListItemIcon>
                  <StarIcon />
                </ListItemIcon>
                <ListItemText inset primary="Chelsea Otakan" />
              </ListItem>
              <ListItem button>
                <ListItemText inset primary="Eric Hoffman" />
              </ListItem>
            </List> 
          </Slide>       
        </div>
      </div>
    );
  }
}

LambdaInputs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LambdaInputs);