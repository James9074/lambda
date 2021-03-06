// @flowimport LinearProgress from '@material-ui/core/LinearProgress';

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Hidden from '@material-ui/core/Hidden'
import AppDrawer from 'components/appDrawer'
import SearchBar from 'components/searchBar'
import UserInfo from 'components/userInfo'
import styles from './styles'

@withRouter
@withStyles(styles)
class AppToolbar extends Component {
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
    let loading = this.props.loading ? (<LinearProgress color="secondary" />) : ('')

    return (
      <AppBar position="fixed" className={classes.barContainer}>
        <Toolbar className={classes.appBar}>
          <Grid container className="Grid">
            <Grid item xs={2} md={3} lg={2} className={classes.centerItems}>
            <AppDrawer user={this.props.data.me}/>
              {/* <Button onClick={()=> {if(this.context.router.route.location.pathname !== "/") this.context.router.history.push("/")}} disableFocusRipple> */}
              <Hidden smDown>
                <Button href="/" disableFocusRipple>
                  <Typography variant="title" color="inherit" className={classes.title}>
                    λ Lambda
                  </Typography>
                </Button>
              </Hidden>
            </Grid>
            <Grid item xs={7} sm={8} md={6} lg={8}>
              <div className={classes.center} id="toolbar">
                <SearchBar
                    searchFocused={this.props.searchFocused} />
              </div>
            </Grid>
            <Grid item xs={1} style={{ textAlign: 'right' }} className={classes.centerItems}>
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
