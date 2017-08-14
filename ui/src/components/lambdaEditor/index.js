// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import { FormControlLabel } from 'material-ui/Form';
import Badge from 'material-ui/Badge';
import Switch from 'material-ui/Switch';
import Paper from 'material-ui/Paper';
import styles from './styles'
import Menu, { MenuItem } from 'material-ui/Menu';
import SortIcon from 'material-ui-icons/Sort';
import PlayArrowIcon from 'material-ui-icons/PlayArrow';
import ContentCopyIcon from 'material-ui-icons/ContentCopy';
import SaveIcon from 'material-ui-icons/Save';
import InputIcon from 'material-ui-icons/Input';
import IconButton from 'material-ui/IconButton';
import Editor from 'components/codeEditor'
import LambdaInputs from './inputs'
import { LinearProgress } from 'material-ui/Progress';
import TextField from 'material-ui/TextField';

const themeOptions = [
  { name: 'VS Light', key: 'vs' },
  { name: 'VS Dark', key: 'vs-dark' },
  { name: 'High Contrast', key: 'hc-black' },
];

@withStyles(styles)
class LambdaEditor extends Component {
  constructor(props, context){
    super(props);
    this.state = {
      editorTheme: 1,
      themeMenuOpen: false,
      themeAnchorEl: undefined,
      codeOutput: '',
      codeErrors: '',
      saveErrors: [],
      toastOpen: false,
      editorCode: props.lambda.code,
      showInputs: false
    }
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }


  onEditorUpdate(newCode){
    this.setState({editorCode: newCode})
    this.props.onEditorUpdate(newCode)
  }

  handleThemeMenuOpen = event => {
    this.setState({ themeMenuOpen: true, themeAnchorEl: event.currentTarget });
  };

  handleThemeMenuClick = (event, index) => {
    this.setState({ editorTheme: index, themeMenuOpen: false});
  };

  handleThemeMenuClose = () => {
    this.setState({ themeMenuOpen: false });
  };

  handleSaveLambda = () => {
    this.props.saveLambda();
  }

  render(){
    const { classes } = this.props;

    let validInputs = this.props.lambda.inputs.filter(input => input.name.length > 0).length

    return (
      <div>
        <Grid container gutter={8}  className={classes.editorOptions}>
          <Grid item xs={12} xl={12}>
            <Grid container>
              <Grid item xs={12} md={6}>
                {this.props.edit && (<TextField
                  id="lambda-name"
                  value={this.props.lambda.name}
                  error={this.props.errors && this.props.errors.name !== undefined}
                  label={`${this.props.errors && this.props.errors.name !== undefined ? '* ' : ''}Lambda Name`}                  
                  onChange={(event) => this.props.editLambda({name: event.target.value})}
                  fullWidth
                  margin="dense"
                />)}
              </Grid>       
              
              <Grid item xs={12} md={6} style={{textAlign:'right'}}>
                <IconButton className={classes.themeButton} aria-label="Theme" aria-owns="theme-menu" onClick={()=>this.setState({showInputs: !this.state.showInputs})}>
                { !validInputs ? (<InputIcon /> ) : 
                  (<Badge className={classes.badge} badgeContent={validInputs} color="accent">
                    <InputIcon /> 
                  </Badge>)}
                </IconButton>
                { this.props.edit && (<IconButton className={classes.themeButton} aria-label="Theme" aria-owns="theme-menu" onClick={this.handleSaveLambda}>
                  <SaveIcon /> 
                </IconButton> )}   

                { this.props.view && (<IconButton disabled className={classes.themeButton} aria-label="Theme" aria-owns="theme-menu" onClick={this.handleCloneLambda}>
                  <ContentCopyIcon /> 
                </IconButton> )}       
                <IconButton className={classes.themeButton} aria-label="Theme" aria-owns="theme-menu" onClick={this.props.testLambda}>
                  <PlayArrowIcon />
                </IconButton>
                <IconButton className={classes.themeButton} aria-label="Theme" aria-owns="theme-menu" onClick={this.handleThemeMenuOpen}>
                  <SortIcon />
                </IconButton>
                <FormControlLabel
                  className={classes.privacy}
                  label="Public"
                  control={
                    <Switch
                      disabled
                      checked={this.props.lambda.public}
                      onChange={(event, checked) => this.props.editLambda({ public: checked })} />
                  }
                />                 
                  <Menu
                    id="theme-menu"
                    anchorEl={this.state.themeAnchorEl}
                    open={this.state.themeMenuOpen}
                    onRequestClose={this.handleThemeMenuClose}
                  >
                    {themeOptions.map((option, index) =>
                      <MenuItem
                        key={index}
                        selected={index === this.state.editorTheme}
                        onClick={event => this.handleThemeMenuClick(event, index)}
                      >
                        {option.name}
                      </MenuItem>,
                    )}
                </Menu>
              </Grid>            
            </Grid>
            <Grid item xs={12} className={classes.mainEditor}>
              
              <LambdaInputs 
                edit={this.props.edit}
                show={this.state.showInputs}
                lambdaInputs={this.props.lambda.inputs}
                addInput={this.props.addInput}
                removeInput={this.props.removeInput}
                modifyInput={this.props.modifyInput}
                onClose={()=>{this.setState({showInputs: false})}} />

              <Paper elevation={4}>
                <Editor 
                  editorTheme={themeOptions[this.state.editorTheme].key} 
                  canEdit={this.props.edit === true}
                  code={this.state.editorCode} 
                  onChange={(newCode)=>this.onEditorUpdate(newCode)}
                  editorOptions={{
                    readOnly: this.props.view
                  }}/>
              </Paper>
            </Grid>
            {//+ ' ' +  (!this.props.loading && classes.outputLoaded}
            }
            <Grid item xs={12} className={classes.output}>
              {this.props.loading && (
                <div className={classes.loadingOutput}>
                  <LinearProgress color="accent" />
                </div>
              )}
              <Paper elevation={4}>
                <Editor
                  height='100'
                  editorTheme={themeOptions[this.state.editorTheme].key} 
                  code={this.props.output}
                  editorOptions={{
                    minimap: { enabled: false },
                    lineNumbers: false,
                    readOnly: true,
                  }} />
              </Paper>
            </Grid>
          </Grid>            
          </Grid>
      </div>
    );
  }
}


export default LambdaEditor;