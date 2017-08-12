import { createStyleSheet } from 'material-ui/styles';

export default createStyleSheet('AppToolbar', theme => ({
  appBar: {
    paddingLeft: '0px',
    minHeight: '60px',
  },
  title: {
    fontSize: "22px",
    fontWeight:400,
    color: 'white',
    textTransform: 'none'
  },
  name: {
    fontSize: "14px",
    fontWeight:400
  },
  centerItems: {
    "& div button ":{
      'vertical-align': 'middle'
    },
    "& a ":{
      'vertical-align': 'middle'
    },
    "& button ":{
      'vertical-align': 'middle'
    }
  },
  flag: {
    width: '40px',
    paddingRight: '17px'
  },
  vertCenter: {
    top: '50%',
    width: '100%',
    transform: 'translate(0, -50%)',
    position: 'relative',    
  },
  center: {
    '& button' : {
      minWidth: '85px'
    },
    top: '50%',
    width: '100%',
    transform: 'translate(0, -50%)',
    marginLeft: '15px',
    position: 'relative',    
  },
}));