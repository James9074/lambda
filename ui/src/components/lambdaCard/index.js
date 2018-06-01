// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import moment from 'moment'
import styles from './styles'

function Lambdas(props) {
  const { classes, lambda, type } = props;

  let lambdaLink = `/api/lambda/${lambda.slug}${Array.isArray(lambda.inputs) ? `/?${lambda.inputs.map((input, i) => `${input.name}=${input.example}${i + 1 < lambda.inputs.length ? '&' : ''}`).join('')}` : ''}`;

  let logoImg = '';
  switch (lambda.language){
    case 'node':
      logoImg = 'https://seeklogo.com/images/N/nodejs-logo-FBE122E377-seeklogo.com.png'
      break;
    case 'java':
      logoImg = 'https://www.seeklogo.net/wp-content/uploads/2011/06/java-logo-vector.png'
      break;
    default:
      break;
  }

  if (type && type === 'single')
    return (
      <Card className={classes.card}>
        <CardContent className={classes.content}>
        <Grid container justify="flex-start">

          <Grid item className={classes.info}>

            <Typography variant="headline" className={classes.largeTitle}>
              <a href={`${lambda.owner.username}/${lambda.slug}`} className={classes.headlineLink}>{lambda.name}</a>
            </Typography>

            <Typography className={classes.largeDesc} component='div'>
              {lambda.description || 'No description provided'}
            </Typography>

            <Typography color="inherit" className={classes.created} component='div'>
            <a href={`/users/${lambda.owner.username}`}>{lambda.owner.username}</a> | {moment(lambda.createdAt).format('MM/DD/YYYY')}  | <a href={lambdaLink}>View in API</a>
            </Typography>

          </Grid>

          <Grid item>
            <div className={classes.logo}>
              <img src={logoImg} alt="lambda logo"/>
            </div>
          </Grid>

        </Grid>
        </CardContent>
      </Card>
    )

  return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
      <Grid container justify="flex-start">

        <Grid item className={classes.info}>

          <Typography variant="headline" className={classes.title}>
            <a href={`/${lambda.slug}`} className={classes.headlineLink}>{lambda.name}</a>
          </Typography>

          <Typography className={classes.desc} component='div'>
            {lambda.description || 'No description provided'}
          </Typography>

          <Typography color="inherit" className={classes.created} component='div'>
            <a href={`/users/${lambda.owner.username}`}>{lambda.owner.username}</a> | {moment(lambda.createdAt).format('MM/DD/YYYY')} | <a href={lambdaLink}>View in API</a>
          </Typography>


        </Grid>

        <Grid item>
          <div className={classes.logo}>
            <img src={logoImg} alt="lambda logo"/>
          </div>
        </Grid>

      </Grid>
      </CardContent>
      {/* <CardActions className={classes.actions}>
        <Button color="inherit">
          View
        </Button>
        <Button>
          Execute
        </Button>
      </CardActions> */}
    </Card>
  )
}

Lambdas.propTypes = {
  lambda: PropTypes.object.isRequired,
};

export default withStyles(styles)(Lambdas);
