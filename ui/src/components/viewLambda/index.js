// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import LambdaCard from 'components/lambdaCard'
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { CircularProgress } from 'material-ui/Progress';
import styles from './styles'
import LambdaEditor from 'components/lambdaEditor'
import SmallHeader from 'components/smallHeader'
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import request from 'request'
import url from 'url'

import { gql, graphql } from 'react-apollo';

@withStyles(styles)
@graphql(gql`query GetSingleLambdaBySlug($slug: String!) { lambda(slug:$slug) { name, id, slug, inputs, description, createdAt, code, owner { username } } }`, {
  options: (ownProps) => ({
    variables: {
      slug: ownProps.slug
    },
  })})

class ViewLambda extends Component {
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
    }  
  }

  componentWillReceiveProps(newProps){
    if(newProps.data && (!this.state.lambda || (this.props.data.lambda.slug !== newProps.slug))){
      let newLambda = newProps.data.lambda === null ? "none" : Object.assign({...newProps.data.lambda},{inputs:JSON.parse(newProps.data.lambda.inputs)})
      this.setState({lambda: newLambda})
    }
  }

  static propTypes = {
    slug: PropTypes.string.isRequired
  }

  //Shortcut for updating the Lambda object
  setLambda(data) {
    this.setState({ lambda: Object.assign(this.state.lambda, data) })
  }

  modifyInput(i, value){
    var newInputs = this.state.lambda.inputs;
    newInputs[i] = value;
    this.setLambda({inputs: newInputs})
  }      

  handleRunLambda = () => {
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
      }
    }

    request(settings, (err, response, body) => {
      this.setState({loadingOutput: false})
      //console.log(response.statusCode)
      //console.log(body) // this is empty instead of return the body that has been sent
      this.setState({editorOutput: body.output || body.lambda_error || body.error})
    }) 
  }

  deleteLambda = () => {
    window.location = '/'
    this.setState({modalOpen:false})
  }

  render(){
    const { data, classes, slug } = this.props;
    const { lambda } = this.state;
    
    if(!data || data.loading || !lambda || !slug){
      return (<div className={classes.loading}>
        <CircularProgress color="accent" size={100} />
        <Typography type="headline">Loading</Typography>
        </div>)
    }

    else if(lambda === "none")
      return(
        <Grid container gutter={24}>
          <Grid item xs={12}>
            <SmallHeader content={"404: This Lambda Doesn't Exist!"}/>
            <Typography type="headline" className={classes.noLambda}></Typography>
          </Grid>
        </Grid>
      )

    return (
      <div className={classes.root}>
          <Grid container gutter={24}>
          <Dialog open={this.state.modalOpen} onRequestClose={() => this.setState({modalOpen: false})}>
            <DialogTitle>
              {"Delete"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this Lambda?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button disabled onClick={this.deleteLambda}>
                Yes
              </Button>
              <Button onClick={() => this.setState({modalOpen: false})}>
                No
              </Button>
            </DialogActions>
          </Dialog>
            <Grid item xs={12} key={lambda.id}>
              <LambdaCard lambda={lambda} type={'single'}/>
            </Grid>

            <Grid item xs={12}>
              <Grid container gutter={0}>
                <Grid item xs={12}>
                  <Typography type="headline" className={classes.title}>Lambda Inputs</Typography>
                  {!Array.isArray(this.state.lambda.inputs) && (
                    <Typography type="body1">There are no inputs for this Lambda</Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                   <Grid container gutter={8}>
                    {Array.isArray(this.state.lambda.inputs) && this.state.lambda.inputs.map(function(input, i){
                      return (
                          <Grid key={i} item xs={3}>
                            <TextField
                              id="input-example"
                              label={this.state.lambda.inputs[i].name || "Input #1"}
                              value={this.state.lambda.inputs[i].example}
                              onChange={(event)=>this.modifyInput(Object.assign(input,{example:event.target.value}))}
                              className={classes.textField}
                              fullWidth
                              margin="normal"
                            />
                          </Grid>
                        
                      )
                    }.bind(this))}
                  </Grid>
                </Grid>          
              </Grid>   
            </Grid>  

            <Grid item xs={12} className={classes.viewEditor}>
            <LambdaEditor 
              view
              loading={this.state.loadingOutput}
              lambda={lambda}
              output={this.state.editorOutput}
              testLambda={this.handleRunLambda} />
              <Button raised className={classes.deleteLambda} onClick={() => this.setState({modalOpen:true})} color="primary">Delete</Button>
            </Grid> 
          </Grid>
      </div>
    );
  }
}

export default ViewLambda;