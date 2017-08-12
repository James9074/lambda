import { createStyleSheet } from 'material-ui/styles';

export default createStyleSheet('LambdaCard', theme => ({
  root: {
    overflow: 'hidden', 
  },
  card:{
    //height:'275px'
    "& a": {
      color: theme.palette.primary[300],
      textDecoration: 'none',
    }
  },
  actions:{
    borderTop:'1px solid ' + theme.palette.grey[300]
  },
  content:{
    //height: '185px',
    paddingTop:'30px',
    fontSize:'12px'
  },
  logo: {
    textAlign: 'center',
    overflow: 'hidden',
    maxWidth: '80px',
    "& img": {
      width: "80px",
      verticalAlign: 'middle'
    }
  },
  info: {
    flex: 1,
    lineHeight:"15px",
    "& span": {
      display: "inline"
    },
    "& p": {
      display: "inline"
    }
  },
  created:{
    fontSize:'12px',
  },
  largeTitle:{
    fontSize: '35px'
  },
  title:{
    fontSize: '22px'
  },
  link:{
    color: theme.palette.primary[500],
    textDecoration: 'none',
    marginBottom:'5px',
    display:'block',
    fontSize:'12px',
  },
  headlineLink:{
    color: theme.palette.primary[500],
    textDecoration: 'none',
    '-webkit-transition': 'color .15s ease-in',
    "&:hover":{
      color: theme.palette.primary[900],
    }
  },
  desc:{
    fontSize:'12px',
    overflow: 'hidden'
  },
  largeDesc:{
    margin: '5px 0 5px 0',
    padding:'10px 0 10px 10px',
    borderLeft: '4px solid ' + theme.palette.accent[100],
    fontSize: '18px'
  }
}));