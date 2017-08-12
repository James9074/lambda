// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom'
import { gql, graphql } from 'react-apollo';
import Grid from 'material-ui/Grid';
import Lambdas from 'components/_lambdasPage'
import LambdaPage from 'components/_lambdaPage'
import NewLambdaPage from 'components/_newLambdaPage'
import User from 'components/_userPage'
import AppToolbar from 'components/appToolbar/'
import FullPageLoader from 'components/fullPageLoader/'
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { MuiThemeProvider } from 'material-ui/styles';
import { RobotTheme } from './Themes'
import 'typeface-roboto'
import css from './App.css'

@graphql(gql`query { me { displayName } }`)
class App extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    hoveredTooltip: false
  }


  _handleShortcuts = (action, event) => {
    console.log(event)
    switch (action) {
      case 'FIND':
        this.child.focusSearch();
        break;
      default:
        break;
    }
  }

  // Handles login redirect if needed
  componentWillUpdate(nextProps){
   // if(nextProps.data.me === null)
    //  window.location = '/login/test'
    //  fetch('/login/facebook', { method: 'GET', credentials: 'include' }).then(() => window.location = window.location)
  }

  addNew = (event, index) => {
    this.setState({ index });
    this.context.router.history.push('/lambdas/new')
  };

  render() {
    const theme = RobotTheme;
    if(!this.props.data || this.props.data.loading){
      return <FullPageLoader theme={theme}/>
    }
    return (
        <MuiThemeProvider theme={theme}>
    
            <div className="App" >
              <AppToolbar 
                onRef={ref => (this.child = ref)}
                loading={false}
                {...this.props} />
              <Grid container gutter={0} justify="center" style={{marginTop: '60px', backgroundColor:theme.canvasColor[900]}}>
                <Grid item xs={8}>
                  <Grid item xs={12}>
                    <Switch>
                      <Route path='/lambdas/new' component={NewLambdaPage} data={this.props.data}/>
                      <Route path='/users/:user' component={User} data={this.props.data}/>
                      <Route path='/:slug' component={LambdaPage} data={this.props.data}/>
                      <Route path='/' component={Lambdas} data={this.props.data}/>
                    </Switch>
                  </Grid>

                  <Button onClick={this.addNew} fab color="primary" style={{position: 'fixed',right: '15px', bottom: '15px'}}>
                    <AddIcon />
                  </Button>
                </Grid>
              </Grid>
            </div>
        </MuiThemeProvider>
    );
  }
}

export default App;