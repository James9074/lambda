import { createStyleSheet } from 'material-ui/styles';

export default createStyleSheet('UserInfo', theme => ({
  root:{
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: '10px',
  },
  login:{
    color: 'white'
  },
  avatar: {
    right: '10px',
    width: '200px',
    height: '45px',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  userPopup:{
    position: 'absolute',
    width: '246px',
    right: '9px',
    top: '71px',
    minHeight: '146px',
    opacity: 0,
    transition: 'opacity .15s',
    padding: '10px',
    textAlign: 'left'
  },
  nameInfo:{
    textAlign: 'right',
    position: 'absolute',
    width: '200px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontWeight: '300',
    "& div":{
      display: 'inline-block',
    },
    textTransform: 'none'
  },
  nameText: {
    left: '-5px',
    top: '-8px',
    position: 'relative',
  },
  displayName:{
    display: 'block',
    color: 'white'
  },
  userName:{
    display: 'block',
    color: theme.palette.primary[100],
    fontSize: '14px'
  }
}));