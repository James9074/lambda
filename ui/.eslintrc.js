const path = require('path');

module.exports =
  Object.assign({},{
    "parser": "babel-eslint",
    "extends": "airbnb-base",
    "plugins": [
      "flowtype",
      "react"
    ],
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
      "import/extensions": "off",
      "import/first": "off",
      "import/no-extraneous-dependencies": ["error", {"devDependencies": false, "optionalDependencies": false, "peerDependencies": false}]
    }
  },
  {settings: {
      'import/resolver': {
        node: {
          paths: [path.resolve(__dirname, 'src')],
        },
      },
  }})
