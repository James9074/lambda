import { createStyleSheet } from 'material-ui/styles';

export default createStyleSheet('Breadcrumbs', theme => ({
  button: {
    margin: theme.spacing.unit*1.5,
    marginLeft: 0,
    minWidth:'0px',
    padding:0,
    fontSize: '12px'
  },
}))