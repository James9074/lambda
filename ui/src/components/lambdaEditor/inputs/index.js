// @flow weak

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import DeleteIcon from 'material-ui-icons/Delete';
import AddIcon from 'material-ui-icons/Add';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Input from 'material-ui/Input/Input';
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

  modifyInput = (event, i, input) => {
    let newInput = Object.assign(input,{name:event.target.value})
    this.props.modifyInput(i, newInput);
  }

  render() {
    const { lambdaInputs, classes } = this.props;
    return (
      <div className={classes.root + ' ' + (this.props.show ? classes.activeRoot : classes.hiddenRoot)}>
      <div className={classes.root} onClick={this.props.onClose}>
        
      </div>
      <div className={classes.inputsContainer}>
          <Slide 
            in={this.props.show}
            direction={'right'} 
            enterTransitionDuration={150}
            leaveTransitionDuration={150}
            transitionAppear={!this.state.firstMount}>
            <List className={classes.panel}>
              <ListItem button>
                <ListItemText primary="Inputs"/>
              </ListItem>
                {lambdaInputs.map((input, i) => (
                  <ListItem key={i}>
                    { lambdaInputs.length === i+1 ? (
                      <IconButton className={classes.button} aria-label="Add" onClick={this.props.addInput}>
                        <AddIcon />
                      </IconButton>)
                      : (
                      <IconButton className={classes.button} aria-label="Delete" onClick={()=>this.props.removeInput(input)}>
                        <DeleteIcon />
                      </IconButton>
                      )
                    }
                    {/*<ListItemText primary={input.name}/>*/}
                    <TextField
                      id="input-name"
                      value={input.name}
                      placeholder={`Input #${i+1} Name`}
                      onChange={(event) => this.modifyInput(event,i,input)}
                      fullWidth
                      margin="none"
                    />                              
                  </ListItem>
                ))}
              <ListItem button>
                <ListItemText primary="Outputs" />
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