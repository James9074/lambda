const path = require('path');

module.exports =
  Object.assign({},{
    "parser": "babel-eslint",
    "extends": "airbnb-base",
    "plugins": [
      "flowtype",
      "react"
    ],
    "env": {
      "browser": true,
      "node": true
    },
    "rules": {
      "curly": "off", // Ugly for one-liners
      "no-underscore-dangle": "off", // I like this one actually, but the library we're using enforces it.
      "semi": "off", // Where's the "force no semi" rule?
      "comma-dangle": "off", // Ew. I get it, but ew.
      "prefer-const": "off", // Sometimes we don't mutate, but want the ability to later on
      "consistent-return": "off", // Often unnecessary
      "func-names": "off", // Often Cleaner
      "space-before-function-paren": "off", // Personal preference
      "space-before-blocks": "off", // Personal preference
      "no-else-return": "off", // Sometimes an if/else block looks cleaner, even if unnecessary
      "react/jsx-uses-vars": 1,
      "react/jsx-uses-react": 1,
      "import/extensions": "off",
      //"import/first": "off",
      "import/no-extraneous-dependencies": 0, //I'm still confused why this is an issue
      "max-len": "off", //TODO: Turn this back on
      "no-confusing-arrow": 0 //It's not confusing.
    }
  },
  {settings: {
      'import/resolver': {
        node: {
          paths: [path.resolve(__dirname, 'src')],
        },
      },
  }})
