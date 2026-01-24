const React = require('react');
const { View } = require('react-native');

const Ionicons = (props) => React.createElement(View, { testID: `icon-${props.name}` });

module.exports = {
  Ionicons,
};
