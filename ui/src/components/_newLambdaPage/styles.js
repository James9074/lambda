import { createStyleSheet } from 'material-ui/styles';

export default createStyleSheet('NewLambdaPage', theme => ({
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
  editorOptions: {
    padding: '0 50px 0 50px',
    marginTop: '25px',
  },
  themeButton: {
  }
}));