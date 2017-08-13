import { createStyleSheet } from 'material-ui/styles';

export default createStyleSheet('LambdasPage', theme => ({
  root: {
    flexGrow: 1,
    marginTop: '20px',
  },
  header:{
    overflow: 'hidden',
    marginBottom:'20px',
    backgroundColor: theme.palette.primary[400],
    "& div":{
      padding:'5px',
      height:'50px',
      "& h1":{
        color:'white',
        textAlign: 'center',
      }
    }
  },
  lambdaIcon: {
    fontSize: '85px',
    height: '100%',
    lineHeight: '50px'
  },
  messageContainer: {
    "& h1":{
      fontSize: '30px',
      textAlign: 'left !important'
    }
    
  },
  lambdaContainer:{
    minWidth:  '55px'
  }
}));