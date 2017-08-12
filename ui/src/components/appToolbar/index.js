// @flow
/* eslint-disable react/no-multi-comp */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Grid from 'material-ui/Grid';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import styles from './styles'
import { LinearProgress } from 'material-ui/Progress';
import AppDrawer from 'components/appDrawer'
import SearchBar from 'components/searchBar'
import UserInfo from 'components/userInfo'

@withRouter
@withStyles(styles)
class AppToolbar extends Component {
  constructor(props, context){
    super(props);
  }

  componentDidMount() {
    this.props.onRef(this)
  }
  componentWillUnmount() {
    this.props.onRef(null)
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  render() {
    const classes = this.props.classes;
    let loading = this.props.loading ? (<LinearProgress color="accent" />) : ('')

    return (
      <AppBar position="fixed">
        <Toolbar className={classes.appBar}>
          <Grid container className="Grid" gutter={0}>
            <Grid item xs={2} lg={2} className={classes.centerItems}>
            <AppDrawer/>
              {/*<Button onClick={()=> {if(this.context.router.route.location.pathname !== "/") this.context.router.history.push("/")}} disableFocusRipple>*/}
              <Button href="/" disableFocusRipple>
                <Typography type="title" color="inherit" className={classes.title}>
                  λ Lambda
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={8} lg={8}>
              <div className={classes.center} id="toolbar">
                <SearchBar 
                    searchFocused={this.props.searchFocused} />
              </div>
            </Grid>
            <Grid item xs={2} style={{textAlign:'right'}} className={classes.centerItems}>
              <UserInfo user={this.props.data.me}/>
            </Grid>
          </Grid>
        </Toolbar>
        {loading}
      </AppBar>
    );
  }
}

AppToolbar.propTypes = {
  loading: PropTypes.bool.isRequired
};

export default AppToolbar;