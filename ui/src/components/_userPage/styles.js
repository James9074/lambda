import { createStyleSheet } from 'material-ui/styles';

export default createStyleSheet('LambdasPage', theme => ({
  root: {
    flexGrow: 1,
    marginTop: '20px'
  },
  title: {
    marginBottom:'15px'
  },
  jumbo:{
    overflow: 'hidden',
    marginBottom:'20px',
    "& div":{
      padding:'5px',
      height:'50px',
      backgroundColor: theme.palette.primary[400],
      "& h1":{
        color:'white',
        textAlign: 'center',
      }
    }
  },
  lambdaIcon: {
    fontSize: '85px',
    height: '100%',
    lineHeight: '45px'
  },
  welcomeContainer: {
    "& h1":{
      fontSize: '40px',
      textAlign: 'left !important'
    }
    
  },
  avatar:{
    height:'32px',
    width:'32px'
  }
}));