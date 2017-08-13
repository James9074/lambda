// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
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
      lambda: {
        name: '',
        public: true,
        inputs: [{
          id: 0,
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
  setLambda(data) {
    this.setState({ lambda: Object.assign(this.state.lambda, data) })
  }

  addInput(){
    var newInputs = this.state.lambda.inputs;
    newInputs.push({
      id: this.state.lambda.inputs.length,
      name: '',
      type: '',
      test: ''
    });
    this.setLambda({inputs: newInputs})
  }

  modifyInput(i, value){
    var newInputs = this.state.lambda.inputs;
    newInputs[i] = value;
    this.setLambda({inputs: newInputs})
  }  

  removeInput(i){
    var newInputs = this.state.lambda.inputs;
    newInputs.splice(i,1);
    this.setLambda({inputs: newInputs})
  }

  onEditorUpdate(newCode){
    this.setLambda({code: newCode})
  }

  handleTestLambda = () => {
    if(this.state.loadingOutput) return;
    this.setState({loadingOutput: true})
    let fullURL = url.parse(document.location.href);
    let baseURL = fullURL.protocol + '//' + fullURL.hostname  + ':' + fullURL.port
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
    let errors = []
    //Try to submit
    this.props.save({
      variables: { 
        input: Object.assign({},this.state.lambda,{inputs: JSON.stringify(this.state.lambda.inputs)})
      }
    })
    .then(({ data }) => {
      console.log('got data', data);
      this.setState({toastOpen: true, toastMessage: 'Lambda Saved!'})
    }).catch(({graphQLErrors}) => {
      console.log('there was an error sending the query', graphQLErrors[0].state);
      this.setState({toastOpen: true, toastMessage: 'There was an error saving this Lambda'})
    });

    this.setState({saveErrors: errors})
  }

  render(){
    const { classes } = this.props;

    return (
      <div>
        <SmallHeader content={"New Lambda"}/>          
        <Paper className={classes.mainContainer} elevation={4}>
          <Grid item xs={12} >
            <Grid container gutter={40} className={classes.topOptions}>
              <Grid item xs={6}>
                <Grid container gutter={0} className={classes.description}>
                  <Grid item xs={12} >
                    <Typography type="headline" className={classes.title}>Basic Info</Typography>
                    <Typography type="body1">This will help you identify and organize your lambda</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      id="lambda-name"
                      label="Lambda Name"
                      value={this.state.lambda.name}
                      onChange={(event) => this.setLambda({ name: event.target.value })}
                      className={classes.textField}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  
                  <Grid item xs={2}>
                    <FormControlLabel
                      className={classes.privacy}
                      label="Public"
                      control={
                        <Switch
                          checked={this.state.lambda.public}
                          onChange={(event, checked) => this.setLambda({ public: checked })}
                        />
                      }
                    />
                  </Grid>

                  <Grid item xs={11}>
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
              <Grid item xs={6}>
                <Grid item xs={12}>
                  <Typography type="headline" className={classes.title}>Lambda Inputs</Typography>
                  <Typography type="body1">These values will be accessible from the lambda function itself</Typography>
                </Grid>
                <Grid item xs={12}  className={classes.inputContainer}>
                  {this.state.lambda.inputs.map(function(input, i){
                    return (
                      <Grid key={i} container gutter={8}>
                        <Grid item xs={5}>
                          <TextField
                            id="input-name"
                            label={"Input Name"}
                            value={this.state.lambda.inputs[i].name}
                            onChange={(event)=>this.modifyInput(Object.assign(input,{name:event.target.value}))}
                            className={classes.textField}
                            fullWidth
                            margin="normal"
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <TextField
                            id="input-example"
                            label="Input Example"
                            value={this.state.lambda.inputs[i].example}
                            onChange={(event)=>this.modifyInput(Object.assign(input,{example:event.target.value}))}
                            className={classes.textField}
                            fullWidth
                            margin="normal"
                          />
                        </Grid>                           

                        {/*<Grid item xs={2}>                       
                          <TextField
                            id="input-type"
                            label="Input Type"
                            value={this.state.lambda.inputs[i].type}
                            onChange={(event)=>this.modifyInput(Object.assign(input,{type:event.target.value}))}
                            className={classes.textField}
                            fullWidth
                            margin="normal"
                          />
                        </Grid> */}                 

                        <Grid item xs={1}>

                          { this.state.lambda.inputs.length === i+1 ? (
                            <IconButton className={classes.button} aria-label="Delete" onClick={this.addInput.bind(this)}>
                              <AddIcon />
                            </IconButton>)
                            : (
                            <IconButton className={classes.button} aria-label="Delete" onClick={()=>{this.removeInput(i)}}>
                              <DeleteIcon />
                            </IconButton>
                            )
                          }
                        </Grid>
                      </Grid>
                    )
                  }.bind(this))}
                </Grid>
              </Grid>
            </Grid>

            <Grid container gutter={40}  className={classes.editorOptions}>
              <Grid item xs={12} >
                <LambdaEditor 
                  edit
                  loading={this.state.loadingOutput}
                  lambda={this.state.lambda}
                  output={this.state.editorOutput}
                  testLambda={this.handleTestLambda}
                  saveLambda={this.handleSaveLambda}
                  onEditorUpdate={(newCode) => this.onEditorUpdate(newCode)} />
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