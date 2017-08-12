import { createStyleSheet } from 'material-ui/styles';

export default createStyleSheet('LambdasPage', theme => ({
  root: {
    flexGrow: 1,
    marginTop: '20px',
  },
  loading:{
    width: '100%',
    textAlign:'center',
    marginTop:'100px',
    fontSize:'35px'
  },
  lambdaCard:{
    overflow: 'hidden'
  },
  tabs:{
    backgroundColor:'inherit',
    boxShadow:'none',
    margin: '-10px 0 15px 0',
    "& .undefined": {
      color: theme.palette.primary[500] + " !important"
    }
  },
  title: {
    marginBottom:'15px',
  },
  header:{
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
      fontSize: '30px',
      textAlign: 'left !important'
    }
    
  },
  avatar:{
    height:'32px',
    width:'32px'
  }
}));