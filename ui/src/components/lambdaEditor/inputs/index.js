// @flow weak

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import DeleteIcon from 'material-ui-icons/Delete';
import AddIcon from 'material-ui-icons/Add';
import SaveIcon from 'material-ui-icons/Save';
import EditIcon from 'material-ui-icons/Edit';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Slide from 'material-ui/transitions/Slide';
import styles from './styles'


class LambdaInputs extends Component {
  constructor(props){
    super(props);
    this.state = {
      open: {
        top: false,
        left: false,
        bottom: false,
        right: false,
      },
      localInputs: props.lambdaInputs.slice()
    };
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  modifyInputName = (event, i, input) => {
    let newInput = Object.assign(input, { name: event.target.value })
    this.props.modifyInput(i, newInput);
  }

  modifyInputExample = (event, i, input) => {
    let newInput = Object.assign(input, { example: event.target.value })
    this.props.modifyInput(i, newInput);
  }

  modifyInputTestValue = (event, i) => {
    let newInputs = this.state.localInputs.slice();
    newInputs[i].localExample = event.target.value;
    this.setState({ localInputs: newInputs });
  }

  toggleInputEditing = (event, i) => {
    let newInputs = this.state.localInputs.slice();
    newInputs[i].isEditing = newInputs[i].isEditing === undefined ? true : !newInputs[i].isEditing;
    this.setState({ localInputs: newInputs });
  }

  render() {
    const { lambdaInputs, classes } = this.props;
    const { localInputs } = this.state;

    return (
      <div className={`${classes.root} ${this.props.show ? classes.activeRoot : classes.hiddenRoot}`}>
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
                <ListItemText primary="Inputs" secondary='Inputs with blank names are ignored'/>
              </ListItem>
                {!this.props.edit && localInputs.map((input, i) => (
                  <div key={i}>
                    <Divider />
                    { !input.isEditing &&
                      <ListItem>
                        <ListItemText primary={input.name && input.name.length > 0 ? input.name : `Nameless Input #${i + 1}`} secondary={`${input.example && input.example.length > 0 ? `Example: ${input.example}` : 'No example provided'}`}/>
                        <IconButton className={classes.button} aria-label="Add" disabled onClick={e => this.toggleInputEditing(e, i)}>
                          <EditIcon />
                        </IconButton>
                      </ListItem> }

                      { input.isEditing &&
                        <ListItem>
                          <TextField
                            id="input-example"
                            value={input.localExample || ''}
                            placeholder={`Input #${i + 1} Example`}
                            onChange={e => this.modifyInputTestValue(e, i)}
                            fullWidth
                            margin="none"
                          />
                          <IconButton className={classes.button} aria-label="Add" onClick={e => this.toggleInputEditing(e, i)}>
                            <SaveIcon />
                          </IconButton>
                        </ListItem>}

                  </div>
                ))}

                {this.props.edit && (lambdaInputs.length === 0) && (
                  <IconButton className={classes.button} aria-label="Add" onClick={this.props.addInput}>
                    <AddIcon />
                  </IconButton>)}

                {this.props.edit && lambdaInputs.map((input, i) => (
                  <div key={i}>
                    <Divider />
                    <ListItem>
                      { lambdaInputs.length === i + 1 ? (
                        <IconButton className={classes.button} aria-label="Add" onClick={this.props.addInput}>
                          <AddIcon />
                        </IconButton>)
                        : (
                        <IconButton className={classes.button} aria-label="Delete" onClick={() => this.props.removeInput(input)}>
                          <DeleteIcon />
                        </IconButton>
                        )
                      }
                      <TextField
                        id="input-name"
                        value={input.name}
                        placeholder={`Input #${i + 1} Name`}
                        onChange={event => this.modifyInputName(event, i, input)}
                        fullWidth
                        margin="none"
                      />

                    </ListItem>
                    <ListItem>
                      <IconButton></IconButton>
                      <TextField
                        id="input-example"
                        value={input.example}
                        placeholder={`Input #${i + 1} Example (Optional)`}
                        onChange={event => this.modifyInputExample(event, i, input)}
                        fullWidth
                        margin="none"
                       />
                    </ListItem>
                  </div>
                ))}
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
