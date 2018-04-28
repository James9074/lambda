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
import LoginModal from 'components/loginModal'
import FullPageLoader from 'components/fullPageLoader/'
import Button from 'material-ui/Button';
import AddIcon from '@material-ui/icons/Add';
import { MuiThemeProvider } from 'material-ui/styles';
import 'typeface-roboto'
import { RobotTheme } from './Themes'
import './App.css'

@graphql(gql`query { me { displayName username imageUrl } }`)
class App extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    hoveredTooltip: false,
    loginModalOpen: false,
  }

  addNew = () => {
    if (!this.props.data.me)
      this.setState({ loginModalOpen: true })
    else
      this.context.router.history.push('/lambdas/new')
  };

  render() {
    const theme = RobotTheme;

    if (this.props.data && this.props.data.error){
      return (<FullPageLoader theme={theme} error/>)
    }
    if (!this.props.data || this.props.data.loading){
      return <FullPageLoader theme={theme}/>
    }
    return (
        <MuiThemeProvider theme={theme}>

            <div className="App" >
              <AppToolbar
                onRef={ref => (this.child = ref)} //eslint-disable-line
                loading={false}
                {...this.props} />
              <Grid container justify="center" style={{ padding: '0 15px 0 15px', marginTop: '60px', backgroundColor: theme.canvasColor[900] }}>
                <Grid item xs={12} sm={10} lg={8}>
                  <Grid item xs={12}>
                    <Switch>
                      <Route path='/lambdas/new' component={NewLambdaPage} appData={this.props.data}/>
                      <Route path='/users/:user' component={User} appData={this.props.data}/>
                      <Route path='/:slug' component={LambdaPage} appData={this.props.data}/>
                      <Route path='/' component={Lambdas} appData={this.props.data}/>
                    </Switch>
                  </Grid>

                  {this.context.router.route.location.pathname.indexOf('/lambdas/new') === -1 && (
                  <Button variant="fab" onClick={this.addNew} color="primary" style={{ position: 'fixed', right: '15px', bottom: '15px' }}>
                    <AddIcon />
                  </Button>)}
                  <LoginModal onClose={() => this.setState({ loginModalOpen: false })}
                    isOpen={this.state.loginModalOpen}
                    returnTo='/lambdas/new' />
                </Grid>
              </Grid>
            </div>
        </MuiThemeProvider>
    );
  }
}

export default App;
