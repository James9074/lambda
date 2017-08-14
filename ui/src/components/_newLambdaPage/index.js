// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import SmallHeader from 'components/smallHeader';
import styles from './styles'
import DeleteIcon from 'material-ui-icons/Delete';
import AddIcon from 'material-ui-icons/Add';
import IconButton from 'material-ui/IconButton';
import LambdaEditor from 'components/lambdaEditor'
import LoginModal from 'components/loginModal'
import request from 'request'
import url from 'url'

import Snackbar from 'material-ui/Snackbar';
import Fade from 'material-ui/transitions/Fade';

import { gql, graphql } from 'react-apollo';

@graphql(gql`mutation CreateLambda($input: CreateLambdaInput!){ createLambda(input: $input) { lambda{ id slug } } }`, {
  props: ({ mutate }) => ({
    save: (input) => mutate(input),
  })
})
@withStyles(styles)
class NewLambda extends Component {
  constructor(props, context){
    super(props);
    this.state = {
      loginModalOpen:false,
      lambda: {
        name: '',
        public: true,
        inputs: [{
          name: '',
          type: '',
          example: ''
        }],
        code: 
`/* Here's your Lambda playground
 * Access variables from the input section like so: */

// Prints the first input above (an empty string by default)
function entryPoint(inputs){        
  console.log("This will be printed")
  return inputs[0]
}

`
,
      },
      editorTheme: 1,
      themeMenuOpen: false,
      themeAnchorEl: undefined,
      codeOutput: '',
      codeErrors: '',
      saveErrors: [],
      toastOpen: false,
      editorOutput: '',
      loadingOutput: false
    }
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  //Shortcut for updating the Lambda object
  setLambda = (data) => {
    this.setState({ lambda: Object.assign(this.state.lambda, data) })
  }

  addInput = () => {
    var newInputs = this.state.lambda.inputs;
    newInputs.push({
      name: '',
      type: '',
      test: ''
    });
    this.setLambda({inputs: newInputs})
  }

  modifyInput = (i, value) => {
    var newInputs = this.state.lambda.inputs;
    newInputs[i] = value;
    this.setLambda({inputs: newInputs})
  }  

  removeInput = (input) => {
    var newInputs = this.state.lambda.inputs;
    console.log(newInputs.indexOf(input));
    newInputs.splice(newInputs.indexOf(input),1);
    console.log(newInputs)
    this.setLambda({inputs: newInputs})
  }

  onEditorUpdate(newCode){
    this.setLambda({code: newCode})
  }

  handleTestLambda = () => {
    if(this.state.loadingOutput) return;
    this.setState({loadingOutput: true})
    let fullURL = url.parse(document.location.href);
    let baseURL = fullURL.protocol + '//' + fullURL.hostname + (fullURL.port ? (':' + fullURL.port) : '')
    const settings = { 
      method: 'POST',
      followAllRedirects: true,
      followOriginalHttpMethod: true,
      url: `${baseURL}/api/lambda`,
      json: true,
      body: {
        lambda: this.state.lambda,
        test: 'test'
      }
    }

    request(settings, (err, response, body) => {
      this.setState({loadingOutput: false})
      console.log(response.statusCode)
      console.log(body) // this is empty instead of return the body that has been sent
      this.setState({editorOutput: body.output || body.lambda_error || body.error})
    })
    
  }  

  handleSaveLambda = () => {
    if(this.state.loadingOutput) return;

    //Filter out blank Inputs
    let filteredInputs = JSON.parse(JSON.stringify(this.state.lambda.inputs))
    filteredInputs = filteredInputs.filter(input => input.name.length > 0)

    //Try to submit
    this.props.save({
      variables: { 
        input: Object.assign({},this.state.lambda,{inputs: JSON.stringify(filteredInputs)})
      }
    })
    .then(({ data }) => {
      this.setState({toastOpen: true, toastMessage: 'Lambda Saved!', saveErrors:[]},()=>{
        this.context.router.history.push(`/${data.createLambda.lambda.slug}`)
      })
    }).catch(({graphQLErrors}) => {
        this.setState({toastOpen: true, toastMessage: 'There was an error saving this Lambda', saveErrors: graphQLErrors !== undefined ? graphQLErrors[0].state : 'Unknown Error'})
    });
  }

  handleInputsChange = (newInputs) => {
    this.setState({lambda: Object.assign({},this.state.lambda,{inputs: newInputs})});
  }

  render(){
    const { classes } = this.props;
    if(!this.props.appData.me){

      return (<LoginModal onClose={()=>this.context.router.history.push('/')} 
      isOpen={true}
      returnTo='/lambdas/new' />)
    }
    return (
      <div>
        <SmallHeader content={"New Lambda"}/>          
        <Paper className={classes.mainContainer} elevation={4}>
          <Grid item xs={12} >
            <Grid container gutter={0}  className={classes.editorOptions}>
              <Grid item xs={12} >
                <LambdaEditor 
                  edit
                  errors={this.state.saveErrors}
                  loading={this.state.loadingOutput}
                  lambda={this.state.lambda}
                  output={this.state.editorOutput}
                  editLambda={this.setLambda}
                  testLambda={this.handleTestLambda}
                  saveLambda={this.handleSaveLambda}
                  modifyInput={this.modifyInput}
                  addInput={this.addInput}
                  removeInput={this.removeInput}
                  onEditorUpdate={(newCode) => this.onEditorUpdate(newCode)} />
              </Grid>
            </Grid>
          </Grid>
          <Grid container gutter={40} className={classes.topOptions}>
              <Grid item xs={12} md={12}>
                <Grid container gutter={0} className={classes.description}>
                  <Grid item xs={12}>
                    <TextField
                      id="lambda-description"
                      label="Lambda Description"
                      value={this.state.lambda.description}
                      onChange={(event) => this.setLambda({ description: event.target.value })}
                      className={classes.textField}
                      fullWidth
                      multiline
                      rows="5"
                      rowsMax="5"
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>          
        </Paper>

        <Snackbar
          open={this.state.toastOpen}
          onRequestClose={()=>this.setState({toastOpen: false, toastMessage: ''})}
          transition={Fade}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.toastMessage}</span>}
        />
      </div>
    );
  }
}


export default NewLambda;