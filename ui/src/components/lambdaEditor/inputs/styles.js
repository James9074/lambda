import { createStyleSheet } from 'material-ui/styles';

export default createStyleSheet('LambdaInputs', theme => ({
  root:{
    "& div":{
      top:'-10px'
    },
    textAlign: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
    top: '0',
    left: '0',
    zIndex: '100'
  },
  inputsContainer:{
    width:'400px',
    height: '100%',
    " & ul":{
      padding: '0px !important'
    }
  },
  panel:{
    height: '100%',
    background: theme.palette.background.paper
  }
}));