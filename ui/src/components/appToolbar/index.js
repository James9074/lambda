// @flow
/* eslint-disable react/no-multi-comp */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Grid from 'material-ui/Grid';
import Toolbar from 'material-ui/Toolbar';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import styles from './styles'
import { LinearProgress } from 'material-ui/Progress';
import AppDrawer from 'components/appDrawer'
import SearchBar from 'components/searchBar'

const pages = [{
  name: 'Feed',
  path: '/'
},{
  name: 'Lambdas',
  path: '/lambdas'
},{
  name: 'Products',
  path: '/products'
}];

@withRouter
@withStyles(styles)
class AppToolbar extends Component {
  constructor(props, context){
    super(props);
    this.state = {
      index: this.setBasePage(context)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.setState({index: this.setBasePage(this.context)})
    }
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

  setBasePage(context){
    let pathname = context.router.route.location.pathname.match(/[^/]*\/[^/]*/)[0]
    return pages.map((x,y)=>x.path).indexOf(pathname);
  }

  handleChange = (event, index) => {
    this.setState({ index });
    this.context.router.history.push(pages[index].path)
  };

  render() {
    const classes = this.props.classes;
    let loading = this.props.loading ? (<LinearProgress color="accent" />) : ('')
    let user = this.props.data.me == null ? "User" : this.props.data.me.displayName;

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
              <Avatar alt="Avatar" src={'https://robohash.org/'+user+'.png?size=300x300'} 
                      className={classes.avatar} />
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