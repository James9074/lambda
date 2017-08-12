import { createStyleSheet } from 'material-ui/styles';

export default createStyleSheet('UserInfo', theme => ({
  root:{
    height: '100%',
    "& button":{
      height: '100%',
      color:'white'
    }
  },
  avatar: {
    marginRight: '10px',
    backgroundColor: 'white',
    display: 'inline-block'
  },
}));