import { createStyleSheet } from 'material-ui/styles';

export default createStyleSheet('UserInfo', theme => ({
  root:{
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: '0px',
  },
  login:{
    color: 'white',
    right: '15px',
  },
  loginSmall:{
    color: 'white',
    right: '10px',
    minWidth: '60px'
  },
  avatar: {
    right: '0px',
    width: '60px',
    minWidth: '60px',
    padding: '0px !important',
    height: '60px',
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
    fontWeight: '300',
    "& div":{
      display: 'inline-block',
    },
    textTransform: 'none'
  },
  nameText: {
    position: 'relative',
    right: '65px'
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