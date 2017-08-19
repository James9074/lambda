// @flow

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Card, { CardContent } from 'material-ui/Card';
import styles from './styles'
import moment from 'moment'

function Lambdas(props) {
  const { classes, lambda, type } = props;

  let lambdaLink = `/api/lambda/${lambda.slug}${Array.isArray(lambda.inputs) ? `/?${lambda.inputs.map((input, i) => `${input.name}=${input.example}${i + 1 < lambda.inputs.length ? '&' : ''}`).join('')}` : ''}`;
  if (type && type === 'single')
    return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
      <Grid container justify="flex-start">

        <Grid item className={classes.info}>

          <Typography type="headline" className={classes.largeTitle}>
            <a href={`${lambda.owner.username}/${lambda.slug}`} className={classes.headlineLink}>{lambda.name}</a>
          </Typography>

          <Typography className={classes.largeDesc} component='div'>
            {lambda.description || 'No description provided'}
          </Typography>

          <Typography color="secondary" className={classes.created} component='div'>
          <a href={`/users/${lambda.owner.username}`}>{lambda.owner.username}</a> | {moment(lambda.createdAt).format('MM/DD/YYYY')}  | <a href={lambdaLink}>View in API</a>
          </Typography>

        </Grid>

        <Grid item>
          <div className={classes.logo}>
            <img src={'https://seeklogo.com/images/N/nodejs-logo-FBE122E377-seeklogo.com.png'} alt="lambda logo"/>
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

          <Typography type="headline" className={classes.title}>
            <a href={`/${lambda.slug}`} className={classes.headlineLink}>{lambda.name}</a>
          </Typography>

          <Typography className={classes.desc} component='div'>
            {lambda.description || 'No description provided'}
          </Typography>

          <Typography color="secondary" className={classes.created} component='div'>
            <a href={`/users/${lambda.owner.username}`}>{lambda.owner.username}</a> | {moment(lambda.createdAt).format('MM/DD/YYYY')} | <a href={lambdaLink}>View in API</a>
          </Typography>


        </Grid>

        <Grid item>
          <div className={classes.logo}>
            <img src={'https://seeklogo.com/images/N/nodejs-logo-FBE122E377-seeklogo.com.png'} alt="lambda logo"/>
          </div>
        </Grid>

      </Grid>
      </CardContent>
      {/* <CardActions className={classes.actions}>
        <Button color="accent">
          View
        </Button>
        <Button>
          Execute
        </Button>
      </CardActions> */}
    </Card>
  );
}

Lambdas.propTypes = {
  lambda: PropTypes.object.isRequired,
};

export default withStyles(styles)(Lambdas);
