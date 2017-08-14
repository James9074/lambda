import { createStyleSheet } from 'material-ui/styles';

export default createStyleSheet('ViewLambda', theme => ({
  loading:{
    width: '100%',
    textAlign:'center',
    marginTop:'100px',
    fontSize:'35px',
    "& h1":{
      color: theme.palette.primary[500]
    }
  },
  textField:{
    fontSize:'15px'
  },
  noLambda:{
    textAlign:'center'
  },
  inputs:{
    marginTop: '25px',
    paddingLeft:'5px',
  },
  viewEditor:{
    overflow: 'hidden'
  },
  deleteLambda: {
    color: 'white',
    float: 'right',
    marginTop: '15px',
    marginBottom:'15px'
  }
}));