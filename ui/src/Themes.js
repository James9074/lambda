// @flow

import { createMuiTheme } from 'material-ui/styles';
import red from 'material-ui/colors/red';
import blue from 'material-ui/colors/blue';
import indigo from 'material-ui/colors/indigo';
import blueGrey from 'material-ui/colors/blueGrey';

// This is just an example of how we can extend themes
export const DarkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blueGrey,
    secondary: {
      ...blue
    },
    error: red,
    action: red
  },
  canvasColor: { 900: 'grey' }
});

export const RobotTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      ...blue,
      contrastText: '#fff',
    },
    secondary: {
      ...indigo
    },
    error: red,
    action: red,
    test: red,
    text: 'white'
  },
  canvasColor: { 900: 'white' }
});

export const RobotThemeDark = createMuiTheme({
  palette: {
    type: 'dark',
    primary: indigo,
    secondary: {
      ...blue
    },
    error: red,
    action: red
  },
  canvasColor: { 900: 'grey' }
});

export const MainTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      50: '#757495',
      100: '#5E5D83',
      200: '#474671',
      300: '#302F60',
      400: '#19184E',
      500: '#03013d',
      600: '#030138',
      700: '#030132',
      800: '#03012D',
      900: '#020127',
      A100: '#5E5C8F',
      A200: '#47457F',
      A400: '#19175F',
      A700: '#020041',
      contrastDefaultColor: '#88003C'
    },
    secondary: blue,
    error: red,
    action: red
  },
});
