export default theme => ({
  root: {
    textAlign: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    zIndex: '100'
  },
  activeRoot: {
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
  },
  hiddenRoot: {
    pointerEvents: 'none'
  },
  inputsContainer: {
    zIndex: '100',
    position: 'absolute',
    width: '300px',
    maxWidth: '80%',
    height: '100%',
    ' & ul': {
      padding: '0px !important',
      ' & li': {
        paddingLeft: '0px !important',
      }
    }
  },
  panel: {
    height: '100%',
    background: theme.palette.background.paper
  }
})
