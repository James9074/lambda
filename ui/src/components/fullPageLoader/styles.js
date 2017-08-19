import { createStyleSheet } from 'material-ui/styles'

export default createStyleSheet('Breadcrumbs', theme => ({
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  loadingContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
}))
