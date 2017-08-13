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
import TextField from 'material-ui/TextField';

import { gql, graphql } from 'react-apollo';

@withStyles(styles)
@graphql(gql`query GetSingleLambdaBySlug($slug: String!) { lambda(slug:$slug) { name, id, slug, inputs, description, code, owner { username } } }`, {
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
      let newLambda = Object.assign({...newProps.data.lambda},{inputs:newProps.data.lambda.inputs})
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

  render(){
    const { data, classes, slug } = this.props;
    const { lambda } = this.state;
    
    if(!data || data.loading || !lambda || !slug){
      return (<div className={classes.loading}>
        <CircularProgress color="accent" size={100} />
        <Typography type="headline">Loading</Typography>
        </div>)
    }

    return (
      <div className={classes.root}>
          <Grid container gutter={24}>
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

            <Grid item xs={12} >
              <LambdaEditor 
                view
                lambda={lambda} />
            </Grid> 
          </Grid>
      </div>
    );
  }
}

export default ViewLambda;