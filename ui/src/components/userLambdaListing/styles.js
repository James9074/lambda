import { createStyleSheet } from 'material-ui/styles';

export default createStyleSheet('LambdasPage', theme => ({
  loading: {
    width: '100%',
    textAlign: 'center',
    marginTop: '100px',
    fontSize: '35px'
  },
  lambdaCard: {
    overflow: 'hidden'
  }
}));
