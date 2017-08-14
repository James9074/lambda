import { createStyleSheet } from 'material-ui/styles';
import Slide from 'material-ui/transitions/Slide';

export default createStyleSheet('LambdaEditor', theme => ({
  mainContainer:{
    padding: '10px',
    paddingBottom: '40px',
    marginBottom: '55px'
  },
  topOptions: {
    padding:'0 55px 0 55px'
  },
  title: {
    marginTop:'20px'
  },
  privacy: {
    marginTop: '23px',
    paddingLeft: '25%'
  },
  inputContainer:{
    height: '246px',
    'overflow-y': 'auto',
    'overflow-x': 'hidden',
  },
  button: {
    marginTop:'25px'
  },
  themeButton: {
  },
  output: {
    width: '100%',
    height: '100px',
    position: 'relative',
    borderTop: '5px solid ' + theme.palette.accent[500],
  },
  mainEditor:{
    width: '100%',
    height: '600px',
    position: 'relative',
    borderTop: '5px solid ' + theme.palette.accent[500],
  },
  inputsOverlay:{

  },
  loadingOutput:{
    "& div":{
      top:'-10px'
    },
    borderTop: '5px solid transparent',
    textAlign: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
    zIndex: '100'
  }
}));