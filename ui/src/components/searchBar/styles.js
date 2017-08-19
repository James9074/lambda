import { createStyleSheet } from 'material-ui/styles';

export default createStyleSheet('SearchBar', theme => ({
  searchIcon: {
    left: '-10px',
    zIndex: '100',
    height: '40px',
    borderRadius: '0px',
  },
  searchContainer: {
    margin: '0',
    position: 'relative',
    top: '50%',
    width: '100%',
    height: '40px',
    // transform: 'translate(-50%, -50%)',
    backgroundColor: theme.palette.primary[400],
  },
  searchInput: {
    margin: '0',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100%',
    height: '40px',
    transform: 'translate(-50%, -50%)',
    backgroundColor: theme.palette.primary[400],
    '& input': {
      width: '98%',
      paddingLeft: '10px',
      paddingRight: '10px'
    },
    '& input:focus': {
      // backgroundColor: theme.palette.primary[300]
    },
  },
  search: {
    color: 'white',
    paddingLeft: '60px',
    padding: '5px 10px 5px 10px',
    '-webkit-transition': 'background-color .15s ease-in',
    '&:hover': {
      backgroundColor: theme.palette.primary[300]
    },
    '&::before': {
      height: '0px !important'
    },
    '&::after': {
      height: '0px'
    }
  },
  resultsContainer: {
    '& ul': {
      margin: '0px',
      padding: '0px',
      listStyle: 'none'
    }
  },
  highlights: {
    '& div': {
      verticalAlign: 'baseline',
      display: 'inline-block',
      marginRight: '3px'
    }
  },
  highlightName: {

  },
  highlightDesc: {
    color: '#525252',
    fontSize: '13px',
    '&::after': {
      content: '""',
      zIndex: 1,
      position: 'absolute',
      bottom: 0,
      right: 0,
      pointerEvents: 'none',
      backgroundImage: `linear-gradient(to right, 
                        rgba(255,255,255, 0), 
                        rgba(255,255,255, 1) 90%)`,
      width: '100px',
      height: '4em',
    }
  },
  highlightOwner: {
    color: '#525252',
    fontSize: '13px',
  }
}));
