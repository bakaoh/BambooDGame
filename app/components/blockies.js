import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import blockies from 'blockies-identicon/blockies';

const styles = {
  bigAvatar: {
    width: 64,
    height: 64,
  },
};

class Blockies extends React.Component {

  constructor(props) {
    super(props);
    this.state = { address: props.address, url: this._createUrl(props.address) };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.address !== this.state.address) {
      this.setState({ address: nextProps.address, url: this._createUrl(nextProps.address) });
    }
  }

  _createUrl(address) {
    return blockies.create({ seed:address, size: 15, scale: 3 }).toDataURL();
  }

  render(){
    return (<Avatar
      alt={this.state.address}
      src={this.state.url}
      className={this.props.big ? this.props.classes.bigAvatar : null}
    />);
  }
}

Blockies.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Blockies);