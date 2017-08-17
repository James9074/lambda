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

import { gql, graphql, compose } from 'react-apollo';

let userQuery = graphql(gql`query CurrentUser{ me { displayName username imageUrl } }`, { name: 'userQuery' })
let lambdaQuery = graphql(gql`query GetSingleLambdaBySlug($slug: String!) { lambda(slug:$slug) { name, id, slug, inputs, description, createdAt, code, owner { username } } }`, 
  {
    name: 'lambdaQuery',
    options: (ownProps) => ({
      variables: {
        slug: ownProps.slug
      },
    }
  )})

  let deleteLambda = graphql(gql`mutation DeleteLambda($input: DeleteLambdaInput!) { deleteLambda(input: $input) { result } }`, {
    props: ({ mutate }) => ({
      delete: (input) => mutate(input),
    })
  }) 

  let createLambda = graphql(gql`mutation CreateLambda($input: CreateLambdaInput!){ createLambda(input: $input) { lambda{ id slug } } }`, {
    props: ({ mutate }) => ({
      save: (input) => mutate(input),
    })
  })  
    
@withStyles(styles)
@compose(userQuery,lambdaQuery,deleteLambda, createLambda)

class ViewLambda extends Component {
  constructor(props, context){
    super(props);

    this.state = {
      editorTheme: 1,
      themeMenuOpen: false,
      themeAnchorEl: undefined,
      codeOutput: '',
      codeErrors: '',
      deleteErrors: [],
      toastOpen: false,
      isEditing: false,
      ownerIsViewing: false
    }
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  
  componentWillReceiveProps(newProps){
    if(newProps.lambdaQuery.lambda && !newProps.lambdaQuery.loading &&  (this.state.lambda === undefined || (this.props.lambdaQuery.lambda.slug !== newProps.slug))){
      let newLambda = newProps.lambdaQuery.lambda === null ? "none" : Object.assign({...newProps.lambdaQuery.lambda},{inputs:JSON.parse(newProps.lambdaQuery.lambda.inputs)})
      let ownerIsViewing = newProps.userQuery.me && (newProps.userQuery.me.username === newProps.lambdaQuery.lambda.owner.username)
      this.setState({lambda: newLambda, ownerIsViewing})
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
    //Try to delete
    this.props.delete({
      variables: { 
        input: { 'slug': this.state.lambda.slug }
      }
    })
    .then(({ data }) => {
      this.setState({toastOpen: true, toastMessage: 'Lambda Deleted!', deleteErrors:[]},()=>{
        this.context.router.history.push(`/`)
      })
    }).catch(({graphQLErrors}) => {
        this.setState({toastOpen: true, toastMessage: 'There was an error deleting this Lambda', deleteErrors: graphQLErrors !== undefined ? graphQLErrors[0].state : 'Unknown Error'})
    });

    //window.location = '/'
    this.setState({modalOpen:false})
  }

  onDelete = () =>{
    this.setState({modalOpen:true})
  }

  onEdit = () => {
    if(this.state.cachedLambda){
      console.log(this.state.lambda.name, this.state.cachedLambda.name)
    }
    if(!this.state.isEditing)
      this.setState({cachedLambda:Object.assign({},this.state.lambda)})
    else
      this.setState({lambda: this.state.cachedLambda})


    this.setState({isEditing:!this.state.isEditing})
  }

  editLambda = (newData) => {
    this.setState({lambda: Object.assign({},this.state.lambda,newData)})
  }

  onEditorUpdate = (code) => {
    //test
  }

  render(){
    const { classes, slug } = this.props;
    const { lambda, ownerIsViewing, isEditing } = this.state;
    
    if(!lambda || !slug){
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
          <Grid container gutter={0}>
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
                <Button onClick={this.deleteLambda}>
                  Yes
                </Button>
                <Button onClick={() => this.setState({modalOpen: false})}>
                  No
                </Button>
              </DialogActions>
            </Dialog>
            {/*Grid item xs={12} key={lambda.id}>
              <LambdaCard lambda={lambda} type={'single'}/>
            </Grid>*/}

            {false && (<Grid item xs={12} className={classes.inputs}>
              <Grid container gutter={0}>
                <Grid item xs={12}>
                  <Typography type="headline" className={classes.title}>Lambda Inputs</Typography>
                  {!this.state.lambda.inputs.length && (
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
                            margin="dense"
                          />
                        </Grid>
                      )
                    }.bind(this))}
                  </Grid>
                </Grid>          
              </Grid>   
            </Grid>)}

            <Grid item xs={12} className={classes.viewEditor}>
            <LambdaEditor 
              edit={isEditing}
              handleToggleEdit={this.onEdit}
              onEditorUpdate={this.onEditorUpdate}
              ownerIsViewing={ownerIsViewing}
              handleDeleteLambda={this.onDelete}
              handleEditLambda={this.state.onEdit}
              editLambda={this.editLambda}
              loading={this.state.loadingOutput}
              lambda={lambda}
              output={this.state.editorOutput}
              testLambda={this.handleRunLambda} />
            </Grid> 
          </Grid>
      </div>
    );
  }
}

export default ViewLambda;