import { createStyleSheet } from 'material-ui/styles';

export default createStyleSheet('ViewLambda', theme => ({
  loading:{
    width: '100%',
    textAlign:'center',
    marginTop:'100px',
    fontSize:'35px'
  },
  textField:{
    fontSize:'15px'
  },
  noLambda:{
    textAlign:'center'
  },
  viewEditor:{
    overflow: 'hidden'
  }
}));