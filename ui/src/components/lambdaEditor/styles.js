import { createStyleSheet } from 'material-ui/styles';

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
    borderTop: '10px solid transparent',
    borderImage: `linear-gradient(to bottom, ${theme.palette.primary[600]} 0%, ${theme.palette.primary[500]} .9%)`,
    borderImageSlice: '1',
  },
  loadingOutput:{
    position: 'absolute',
    width: '100px',
    height: '100px',
    backgroundColor: 'red',
    zIndex: '100'
  }
}));