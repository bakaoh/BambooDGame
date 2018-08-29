import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Typography from '@material-ui/core/Typography';

import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Blockies from './blockies';

import EmbarkJS from 'Embark/EmbarkJS';
import SimpleStorage from 'Embark/contracts/SimpleStorage';

class JointDialog extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      number: this.props.number,
      jointed: this.props.jointed,
      selected: this.props.jointed,
      open: false,
      search: '',
      list: []
    }

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleJoint = this.handleJoint.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.jointed !== this.state.jointed) {
      this.setState({ jointed: nextProps.jointed });
    }
    if (nextProps.number !== this.state.number) {
      this.setState({ number: nextProps.number });
    }
  }

  handleOpen(){
    SimpleStorage.methods.knotsByNumber(this.state.number).call()
      .then(_value => {
        this.setState({ open: true, list: _value});
      })
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleSelect(address) {
    this.setState({ selected: address });    
  }

  handleJoint() {
    if (this.state.selected) {
      SimpleStorage.methods.joint(this.state.selected).send({from: web3.eth.defaultAccount});
      this.setState({ jointed: this.state.selected });    
    }
  }

  handleSearch(event) {
    this.setState({ search: event.target.value });
  }

  render() {
    return (
      <div>
        {!this.state.jointed || this.state.jointed === '0x0000000000000000000000000000000000000000'
          ?
          <Typography
            style={{padding: '16px', textAlign: 'center', cursor: 'pointer'}}
            onClick={this.handleOpen}
          >{`You didn't joint to any ${this.props.pos} knot. Click here to joint one!`}</Typography>
          :
          <ListItem button onClick={this.handleOpen}>
            <Blockies address={this.state.jointed} />
            <ListItemText primary={`Your ${this.props.pos} knot`} secondary={this.state.jointed} />
          </ListItem>
        }
        <Dialog
          fullScreen={this.props.fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{`Choose ${this.props.pos} knot to joint`}</DialogTitle>
          <DialogContent style={{padding: '0px'}}>
            <List dense={true}>
              {this.state.list.map((address) => address.includes(this.state.search) && 
                <ListItem 
                  button
                  key={address}
                  style={this.state.selected === address ? {background: '#c1c7bd'} : null}
                  onClick={_ => this.handleSelect(address)}
                >
                  <Blockies address={address} />
                  <ListItemText primary={address} />
                </ListItem>
              )}
            </List>
          </DialogContent>
          <DialogActions>
            <TextField
              placeholder="Search"
              type="search"
              margin="dense"
              onChange={this.handleSearch}
            />
            <Button onClick={this.handleClose} color="primary">
              Close
            </Button>
            <Button onClick={this.handleJoint} color="primary" autoFocus>
              Joint
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

JointDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(JointDialog);