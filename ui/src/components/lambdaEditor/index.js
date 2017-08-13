// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import styles from './styles'
import Menu, { MenuItem } from 'material-ui/Menu';
import SortIcon from 'material-ui-icons/Sort';
import PlayArrowIcon from 'material-ui-icons/PlayArrow';
import ContentCopyIcon from 'material-ui-icons/ContentCopy';
import SaveIcon from 'material-ui-icons/Save';
import IconButton from 'material-ui/IconButton';
import Editor from 'components/codeEditor'

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
      editorCode: props.lambda.code
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

  handleTestLambda2 = () => {
    var theInstructions = this.state.editorCode;
    var inputs = Array.isArray(this.props.lambda.inputs) ? this.props.lambda.inputs : JSON.parse(this.props.lambda.inputs);
    inputs = inputs.map((x)=>x.example)
    

    var expression = `${theInstructions} return entryPoint(${JSON.stringify(inputs)})`;
    var result = '';

    try{
      result = new Function(expression)().toString();
    }
    catch(e){ result = e.toString(); }
    if(result === undefined)
      result = "undefined"
    if(result === null)
      result = "null"
    if(result.length === 0)
      result = "Nothing returned"
    this.setState({codeOutput:result})    
  }

  handleSaveLambda = () => {
    this.props.saveLambda();
  }

  render(){
    const { classes } = this.props;

    return (
      <div>
        <Grid container gutter={40}  className={classes.editorOptions}>
          <Grid item xs={12} xl={8}>
            <Grid container>
              <Grid item xs={9}>
                <Typography type="headline">Implementation</Typography>
              </Grid>       
              <Grid item xs={3} style={{textAlign:'right'}}>
                { this.props.edit && (<IconButton className={classes.themeButton} aria-label="Theme" aria-owns="theme-menu" onClick={this.handleSaveLambda}>
                  <SaveIcon /> 
                </IconButton> )}   

                { this.props.view && (<IconButton className={classes.themeButton} aria-label="Theme" aria-owns="theme-menu" onClick={this.handleCloneLambda}>
                  <ContentCopyIcon /> 
                </IconButton> )}       
                <IconButton className={classes.themeButton} aria-label="Theme" aria-owns="theme-menu" onClick={this.props.testLambda}>
                  <PlayArrowIcon />
                </IconButton>
                <IconButton className={classes.themeButton} aria-label="Theme" aria-owns="theme-menu" onClick={this.handleThemeMenuOpen}>
                  <SortIcon />
                </IconButton>
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
            <Grid item xs={12}>
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
          </Grid>

          <Grid item xs={12} xl={4}>
            <Grid container>
              <Grid item xs={10}>
                <Typography type="headline">Output</Typography>
              </Grid>       
              <Grid item xs={2} style={{textAlign:'right'}}>
                <IconButton className={classes.themeButton} aria-label="Theme" aria-owns="theme-menu" onClick={this.handleThemeMenuOpen}>
                  <SortIcon />
                </IconButton>
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
            <Grid item xs={12}>
              <Paper elevation={4}>
                <Editor 
                  editorTheme={themeOptions[this.state.editorTheme].key} 
                  code={this.props.output}
                  editorOptions={{
                    minimap: { enabled: false },
                    lineNumbers: false,
                    readOnly: true
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