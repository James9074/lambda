export default theme => ({
  root: {
    flexGrow: 1,
    marginTop: '20px'
  },
  loading: {
    width: '100%',
    textAlign: 'center',
    marginTop: '100px',
    fontSize: '35px',
    '& h1': {
      color: theme.palette.primary[500]
    }
  },
  lambdaCard: {
    overflow: 'hidden'
  },
  tabs: {
    backgroundColor: 'inherit',
    boxShadow: 'none',
    margin: '-10px 0 15px 0',
    color: `${theme.palette.grey[500]} !important`
  },
  title: {
    marginBottom: '15px'
  },
  jumbo: {
    overflow: 'hidden',
    marginBottom: '20px',
    '& div': {
      padding: '2px',
      height: '115px',
      backgroundColor: theme.palette.primary[400],
      '& h1': {
        color: 'white',
        textAlign: 'center',
      }
    }
  },
  lambdaIcon: {
    fontSize: '250px',
    height: '100%',
    lineHeight: '137px'
  },
  welcomeContainer: {
    marginTop: '-10px',
    '& h1': {
      fontSize: '40px',
      textAlign: 'left !important',
      marginBottom: '10px'
    },
    '& span': {
      fontSize: '16px',
      color: 'white',
    },

  },
  bullet: {
    display: 'block',
    paddingTop: '10px'
  },
  avatar: {
    height: '32px',
    width: '32px'
  }
})
