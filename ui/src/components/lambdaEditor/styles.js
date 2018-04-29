export default theme => ({
  mainContainer: {
    padding: '10px',
    paddingBottom: '40px',
    marginBottom: '55px'
  },
  topOptions: {
    padding: '0 55px 0 55px'
  },
  title: {
    marginTop: '20px'
  },
  inputContainer: {
    height: '246px',
    'overflow-y': 'auto',
    'overflow-x': 'hidden',
  },
  button: {
    marginTop: '25px'
  },
  themeButton: {
  },
  output: {
    width: '100%',
    position: 'relative',
    borderTop: `5px solid ${theme.palette.secondary[500]}`,
  },
  mainEditor: {
    width: '100%',
    height: '600px',
    position: 'relative',
    borderTop: `5px solid ${theme.palette.secondary[500]}`,
  },
  loadingOutput: {
    '& div': {
      top: '-10px'
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
  },
  badge: {
    margin: `0 ${theme.spacing.unit * 2}px`,
  },
  lambdaName: {
    borderLeft: '5px solid #229dff',
    paddingLeft: '10px',
    top: '50%',
    transform: 'translate(0,-50%)',
    position: 'relative',
  },
  editorButtons: {
    textAlign: 'right',
    '& button': {
      // top: '50%',
      // transform: 'translate(0,-50%)',
      position: 'relative',
      marginTop: '5px'
    }
  },
  editorOptions: {
    color: theme.palette.grey[500]
  },
  error: {
    color: 'red',
  }
})
