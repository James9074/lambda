export default theme => ({
  loading: {
    width: '100%',
    textAlign: 'center',
    marginTop: '100px',
    fontSize: '35px',
    '& h1': {
      color: theme.palette.primary[500]
    }
  },
  textField: {
    fontSize: '15px'
  },
  noLambda: {
    textAlign: 'center'
  },
  inputs: {
    marginTop: '25px',
    paddingLeft: '5px',
  },
  viewEditor: {
    marginTop: '10px',
    overflow: 'hidden'
  },
  deleteLambda: {
    color: 'white',
    float: 'right',
    marginTop: '15px',
    marginBottom: '15px'
  },
  snackBar: {
    '& div': {
      '& div': {
        width: '100%',
        textAlign: 'center'
      }
    }
  }
})
