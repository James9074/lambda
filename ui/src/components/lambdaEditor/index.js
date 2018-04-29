// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import { FormControlLabel } from 'material-ui/Form';
import Badge from 'material-ui/Badge';
import Switch from 'material-ui/Switch';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Menu, { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import SortIcon from '@material-ui/icons/Sort';
import EditIcon from '@material-ui/icons/Edit';
import UndoIcon from '@material-ui/icons/Undo';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ContentCopyIcon from '@material-ui/icons/ContentCopy';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import InputIcon from '@material-ui/icons/Input';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import Editor from 'components/codeEditor'
import { LinearProgress } from 'material-ui/Progress';
import TextField from 'material-ui/TextField';
import LambdaInputs from './inputs'
import styles from './styles'

const themeOptions = [
  { name: 'VS Light', key: 'vs' },
  { name: 'VS Dark', key: 'vs-dark' },
  { name: 'High Contrast', key: 'hc-black' },
];

const languageOptions = [
  { name: 'Node JS', key: 'node' },
  { name: 'Java', key: 'java' }
];

@withStyles(styles)
class LambdaEditor extends Component {
  constructor(props){
    super(props);
    this.state = {
      editorTheme: 1,
      themeMenuOpen: false,
      themeAnchorEl: undefined,
      languageMenuOpen: false,
      languageAnchorEl: undefined,
      codeOutput: '',
      codeErrors: '',
      saveErrors: [],
      toastOpen: false,
      editorCode: props.lambda.code,
      showInputs: false,
      outputHeight: 150
    }
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }


  onEditorUpdate(newCode){
    this.setState({ editorCode: newCode })
    this.props.onEditorUpdate(newCode)
  }

  /* Theme Menu Methods */

  handleThemeMenuOpen = (event) => {
    this.setState({ themeMenuOpen: true, themeAnchorEl: event.currentTarget });
  };

  handleThemeMenuClick = (event, index) => {
    this.setState({ editorTheme: index, themeMenuOpen: false });
  };

  handleThemeMenuClose = () => {
    this.setState({ themeMenuOpen: false });
  };

  /* Language Menu Methods */

  handleLanguageMenuOpen = (event) => {
    this.setState({ languageMenuOpen: true, languageAnchorEl: event.currentTarget });
  };

  handleLanguageMenuClick = (event, index) => {
    this.setState({ language: index, languageMenuOpen: false });
    this.props.editLambda({ language: languageOptions[index].key })
  };

  handleLanguageMenuClose = () => {
    this.setState({ languageMenuOpen: false });
  };

  render(){
    const { classes } = this.props;
    let validInputs = this.props.lambda.inputs.filter(input => input.name.length > 0).length
    let language = this.props.lambda.language;
    if (language === 'node') language = 'javascript'
    return (
      <div>
        <Grid container spacing={8} className={classes.editorOptions}>
          <Grid item xs={12} xl={12}>
            <Grid container>
              <Grid item xs={12} md={2}>
                {this.props.edit && (<TextField
                  id="lambda-name"
                  value={this.props.lambda.name}
                  error={this.props.errors && this.props.errors.name !== undefined}
                  label={`${this.props.errors && this.props.errors.name !== undefined ? '* ' : ''}Lambda Name`}
                  onChange={event => this.props.editLambda({ name: event.target.value })}
                  fullWidth
                  margin="none"
                />)}
                </Grid>
                <Grid item xs={12} md={5}>
                {this.props.edit && (<TextField
                  id="lambda-description"
                  value={this.props.lambda.description}
                  error={this.props.errors && this.props.errors.description !== undefined}
                  label={`${this.props.errors && this.props.errors.description !== undefined ? '* ' : ''}Lambda Description`}
                  onChange={event => this.props.editLambda({ description: event.target.value })}
                  fullWidth
                  margin="none"
                />)}
                {!this.props.edit && (<Typography variant="headline" className={classes.lambdaName}>{/* this.props.lambda.name */}</Typography>)}
              </Grid>
              <Grid item xs={12} md={5} className={classes.editorButtons}>
              <Tooltip placement="top" id="tooltip-icon" title="Inputs">
                <IconButton aria-label="Inputs" aria-owns="inputs-menu" onClick={() => this.setState({ showInputs: !this.state.showInputs })} className={(this.props.errors && this.props.errors.inputs !== undefined) ? classes.error : ''}>
                  { !validInputs ? (<InputIcon />) :
                    (<Badge className={classes.badge} badgeContent={validInputs} color='secondary'>
                      <InputIcon />
                    </Badge>)}
                </IconButton>
              </Tooltip>
              { (this.props.adminIsViewing || this.props.ownerIsViewing) && !this.props.edit && !this.props.isNewLambda && (<IconButton className={classes.themeButton} aria-label="Theme" aria-owns="theme-menu" onClick={this.props.handleDeleteLambda}>
                <DeleteIcon />
              </IconButton>)}
              { (this.props.adminIsViewing || this.props.ownerIsViewing) && !this.props.edit && !this.props.isNewLambda &&
                (<Tooltip placement="top" id="tooltip-icon" title="Edit">
                  <IconButton className={classes.themeButton} aria-label="Theme" aria-owns="theme-menu" onClick={this.props.handleToggleEdit}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>)}
              { (this.props.adminIsViewing || this.props.ownerIsViewing) && this.props.edit && !this.props.isNewLambda &&
                (<Tooltip placement="top" id="tooltip-icon" title="Edit">
                  <IconButton className={classes.themeButton} aria-label="Edit" aria-owns="edit-menu" onClick={this.props.handleToggleEdit}>
                    <UndoIcon />
                  </IconButton>
                </Tooltip>)}
              { this.props.edit &&
              (<Tooltip placement="top" id="tooltip-icon" title="Save">
                <IconButton className={classes.themeButton} aria-label="Save" aria-owns="save-menu" onClick={this.props.handleSaveLambda}>
                  <SaveIcon />
                </IconButton>
              </Tooltip>)}
              { this.props.view &&
                (<Tooltip placement="top" id="tooltip-icon" title="Clone">
                  <IconButton disabled className={classes.themeButton} aria-label="Clone" aria-owns="clone-menu" onClick={this.handleCloneLambda}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>)}
              <Tooltip placement="top" id="tooltip-icon" title="Run">
                <IconButton className={classes.themeButton} aria-label="Test" aria-owns="theme-menu" onClick={this.props.testLambda}>
                  <PlayArrowIcon />
                </IconButton>
              </Tooltip>
              <Tooltip placement="top" id="tooltip-icon" title="Theme">
                <IconButton className={classes.themeButton} aria-label="Theme" aria-owns="theme-menu" onClick={this.handleThemeMenuOpen}>
                    <SortIcon />
                </IconButton>
              </Tooltip>
              { this.props.edit && <Button
                aria-owns={this.state.languageMenuOpen ? 'simple-menu' : null}
                aria-haspopup="true"
                onClick={this.handleLanguageMenuOpen}
              >
                {languageOptions.filter(o => o.key === this.props.lambda.language)[0].name}
              </Button>}
              <FormControlLabel
                className={classes.privacy}
                label=""
                control={
                  <Tooltip placement="right" id="tooltip-icon" title="Private">
                    <Switch
                      checked={this.props.lambda.public === 1}
                      onChange={(event, checked) => this.props.editLambda({ public: checked })} />
                  </Tooltip>
                }
              />
                <Menu
                  id="language-menu"
                  anchorEl={this.state.languageAnchorEl}
                  open={this.state.languageMenuOpen}
                  onClose={this.handleLanguageMenuClose}
                >
                  {languageOptions.map((option, index) =>
                    <MenuItem
                      key={index}
                      selected={index === this.state.editorLanguage}
                      onClick={event => this.handleLanguageMenuClick(event, index)}
                    >
                      {option.name}
                    </MenuItem>,
                  )}
              </Menu>

              <Menu
                id="theme-menu"
                anchorEl={this.state.themeAnchorEl}
                open={this.state.themeMenuOpen}
                onClose={this.handleThemeMenuClose}
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
              onClose={() => { this.setState({ showInputs: false }) }} />

            <Paper elevation={4}>
              <Editor
                editorTheme={themeOptions[this.state.editorTheme].key}
                language={language}
                code={this.state.editorCode}
                onChange={newCode => this.onEditorUpdate(newCode)}
                editorOptions={{
                  readOnly: !this.props.edit
                }}/>
            </Paper>
          </Grid>
          <Grid item xs={12} className={classes.output} style={{ height: this.state.outputHeight }}>
            {this.props.loading && (
              <div className={classes.loadingOutput}>
                <LinearProgress color="secondary" />
              </div>
            )}
            <Paper elevation={4}>
              <Editor
                height={this.state.outputHeight}
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
