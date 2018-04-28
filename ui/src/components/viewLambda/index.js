// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { CircularProgress } from 'material-ui/Progress';
import LambdaEditor from 'components/lambdaEditor'
import SmallHeader from 'components/smallHeader'
import LambdaCard from 'components/lambdaCard'
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import request from 'request'
import url from 'url'
import Snackbar from 'material-ui/Snackbar';
import Fade from 'material-ui/transitions/Fade';
import { gql, graphql, compose } from 'react-apollo';
import styles from './styles'

let userQuery = graphql(gql`query CurrentUser{ me { displayName username imageUrl admin } }`, { name: 'userQuery' })
let lambdaQuery = graphql(gql`query GetSingleLambdaBySlug($slug: String!) { lambda(slug:$slug) { name, id, slug, inputs, description, createdAt, code, owner_id, public, language, owner { username } } }`,
  {
    name: 'lambdaQuery',
    options: ownProps => ({
      variables: {
        slug: ownProps.slug
      },
    }
  ) })

let deleteLambda = graphql(gql`mutation DeleteLambda($input: DeleteLambdaInput!) { deleteLambda(input: $input) { result } }`, {
  props: ({ mutate }) => ({
    delete: input => mutate(input),
  })
})

let updateLambda = graphql(gql`mutation UpdateLambda($input: UpdateLambdaInput!){ updateLambda(input: $input) { lambda { id slug inputs } } }`, {
  props: ({ mutate }) => ({
    update: input => mutate(input),
  })
})

@withStyles(styles)
@compose(userQuery, lambdaQuery, deleteLambda, updateLambda)

class ViewLambda extends Component {
  constructor(props){
    super(props);

    this.state = {
      editorTheme: 1,
      themeMenuOpen: false,
      themeAnchorEl: undefined,
      codeOutput: '',
      codeErrors: '',
      graphqlErrors: [],
      toastOpen: false,
      isEditing: false,
      ownerIsViewing: false,
      adminIsViewing: false,
      toastMessage: '',
      modalOpen: false
    }
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentWillReceiveProps(newProps){
    if (newProps.lambdaQuery.lambda && !newProps.lambdaQuery.loading && (this.state.lambda === undefined || (this.props.lambdaQuery.lambda.slug !== newProps.slug))){
      let newLambda = newProps.lambdaQuery.lambda === null ? 'none' : Object.assign({ ...newProps.lambdaQuery.lambda }, { inputs: JSON.parse(newProps.lambdaQuery.lambda.inputs) })
      let ownerIsViewing = newProps.userQuery.me && (newProps.userQuery.me.username === newProps.lambdaQuery.lambda.owner.username)
      let adminIsViewing = newProps.userQuery.me && newProps.userQuery.me.admin === 1;
      this.setState({ lambda: newLambda, ownerIsViewing, adminIsViewing })
    }
  }

  static propTypes = {
    slug: PropTypes.string.isRequired
  }

  // Shortcut for updating the Lambda object
  setLambda(data) {
    this.setState({ lambda: Object.assign(this.state.lambda, data) })
  }

  modifyInput(i, value){
    let newInputs = this.state.lambda.inputs;
    newInputs[i] = value;
    this.setLambda({ inputs: newInputs })
  }

  handleRunLambda = () => {
    if (this.state.loadingOutput) return;
    this.setState({ loadingOutput: true })
    let fullURL = url.parse(document.location.href);
    let baseURL = `${fullURL.protocol}//${fullURL.hostname}${fullURL.port ? (`:${fullURL.port}`) : ''}`
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
      this.setState({ loadingOutput: false })
      this.setState({ editorOutput: body.output || body.lambda_error || body.error })
    })
  }

  deleteLambda = () => {
    // Try to delete
    this.props.delete({
      variables: {
        input: { slug: this.state.lambda.slug }
      }
    })
    .then(() => {
      this.setState({ toastOpen: true, toastMessage: 'Lambda Deleted!', graphqlErrors: [] }, () => {
        this.context.router.history.push('/')
      })
    }).catch(({ graphQLErrors }) => {
      this.setState({ toastOpen: true, toastMessage: 'There was an error deleting this Lambda', graphqlErrors: graphQLErrors !== undefined ? graphQLErrors[0].state : 'Unknown Error' })
    });

    // window.location = '/'
    this.setState({ modalOpen: false })
  }

  handleDeleteLambda = () => {
    this.setState({ modalOpen: true })
  }

  handleToggleEdit = () => {
    if (!this.state.isEditing)
      this.setState({ cachedLambda: Object.assign({}, this.state.lambda) })
    else
      this.setState({ lambda: this.state.cachedLambda })


    this.setState({ isEditing: !this.state.isEditing })
  }

  editLambda = (newData) => {
    this.setState({ lambda: Object.assign({}, this.state.lambda, newData) })
  }

  handleUpdateLambda = () => {
    if (this.state.loadingOutput) return;

    // Filter out blank Inputs
    let filteredInputs = JSON.parse(JSON.stringify(this.state.lambda.inputs))
    filteredInputs = filteredInputs.filter(input => input.name.length > 0)

    let updatedLambda = {
      name: this.state.lambda.name,
      id: this.state.lambda.id,
      slug: this.state.lambda.slug,
      description: this.state.lambda.description,
      public: this.state.lambda.public,
      language: this.state.lambda.language,
      code: this.state.lambda.code,
      owner_id: this.state.lambda.owner_id,
      inputs: JSON.stringify(filteredInputs)
    }

    // Try to submit
    this.props.update({
      variables: {
        input: updatedLambda
      }
    })
    .then(({ data }) => {
      // TODO: Figure out how to really deal with this parsing bznz
      this.setState({ toastOpen: true, toastMessage: 'Lambda Saved!', graphqlErrors: [], isEditing: false, lambda: Object.assign({}, this.state.lambda, { inputs: JSON.parse(data.updateLambda.lambda.inputs) }) }, () => {
        // this.context.router.history.push(`/${data.createLambda.lambda.slug}`)
      })
    }).catch(({ graphQLErrors }) => {
      let message = 'There was an error saving this Lambda'
      if (graphQLErrors !== undefined && graphQLErrors[0].state.inputs !== undefined)
        message = graphQLErrors[0].state.inputs[0]
      this.setState({ toastOpen: true, toastMessage: message, graphqlErrors: graphQLErrors !== undefined ? graphQLErrors[0].state : 'Unknown Error' })
    });
  }

  addInput = () => {
    let newInputs = this.state.lambda.inputs;
    newInputs.push({
      name: '',
      type: '',
      example: ''
    });
    this.setLambda({ inputs: newInputs })
  }

  modifyInput = (i, value) => {
    let newInputs = this.state.lambda.inputs;
    newInputs[i] = value;
    this.setLambda({ inputs: newInputs })
  }

  removeInput = (input) => {
    let newInputs = this.state.lambda.inputs;
    newInputs.splice(newInputs.indexOf(input), 1);
    this.setLambda({ inputs: newInputs })
  }

  render(){
    const { classes, slug } = this.props;
    const { lambda, ownerIsViewing, adminIsViewing, isEditing } = this.state;

    if (!lambda || !slug){
      return (<div className={classes.loading}>
        <CircularProgress color="secondary" size={100} />
        <Typography variant="headline">Loading</Typography>
        </div>)
    } else if (lambda === 'none')
      return (
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <SmallHeader content={"404: This Lambda Doesn't Exist!"}/>
            <Typography variant="headline" className={classes.noLambda}></Typography>
          </Grid>
        </Grid>
      )

    return (
      <div className={classes.root}>
          <Grid container spacing={0}>
            <Dialog open={this.state.modalOpen} onClose={() => this.setState({ modalOpen: false })}>
              <DialogTitle>
                {'Delete'}
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
                <Button onClick={() => this.setState({ modalOpen: false })}>
                  No
                </Button>
              </DialogActions>
            </Dialog>
            <Grid item xs={12} key={lambda.id}>
              <LambdaCard lambda={lambda} type={'single'}/>
            </Grid>

            <Grid item xs={12} className={classes.viewEditor}>
            <LambdaEditor
              edit={isEditing}
              handleToggleEdit={this.handleToggleEdit}
              onEditorUpdate={this.onEditorUpdate}
              ownerIsViewing={ownerIsViewing}
              adminIsViewing={adminIsViewing}
              handleDeleteLambda={this.handleDeleteLambda}
              handleEditLambda={this.state.onEdit}
              handleSaveLambda={this.handleUpdateLambda}
              editLambda={this.editLambda}
              loading={this.state.loadingOutput}
              errors={this.state.graphqlErrors}
              modifyInput={this.modifyInput}
              addInput={this.addInput}
              removeInput={this.removeInput}
              lambda={lambda}
              output={this.state.editorOutput}
              testLambda={this.handleRunLambda} />
            </Grid>
          </Grid>
          <Snackbar
            open={this.state.toastOpen}
            className={classes.snackBar}
            onClose={() => this.setState({ toastOpen: false, toastMessage: '' })}
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

export default ViewLambda;
