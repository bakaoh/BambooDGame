import React from 'react';
import ReactDOM from 'react-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ImageIcon from '@material-ui/icons/Image';
import Avatar from '@material-ui/core/Avatar';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import Button from '@material-ui/core/Button';

import EmbarkJS from 'Embark/EmbarkJS';
import SimpleStorage from 'Embark/contracts/SimpleStorage';
import Blockies from './components/blockies';
import Blockchain from './components/blockchain';
import JointDialog from './components/jointDialog';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      address: '',
      knot: 0,
      left: '',
      right: '',
      list: [],
      joined: false,
      master: false,
      length: 0
    }

    this.getInfo = this.getInfo.bind(this);
    this.handleCheckin = this.handleCheckin.bind(this);
    this.addDummy = this.addDummy.bind(this);
    this.stop = this.stop.bind(this);
  }

  componentDidMount(){
    EmbarkJS.onReady(() => {
      this.getInfo(web3.eth.defaultAccount);
    });
  }

  getInfo(address) {
    SimpleStorage.methods.playerInfo(address).call()
      .then(_value => {
        this.setState({
          address: address,
          joined: _value.joined != 0,
          master: _value.master != 0,
          knot: _value.knot,
          left: _value.left,
          right: _value.right,
          length: _value.length
        });
      })
  }

  handleCheckin() {
    SimpleStorage.methods.checkin().send({from: web3.eth.defaultAccount});
    this.setState({ joined: true });    
  }

  stop() {
    SimpleStorage.methods.stop().send({from: web3.eth.defaultAccount});
  }

  addDummy() {
    let addrs = [];
    for (let i = 0; i < 50; i++) {
      addrs.push(web3.eth.accounts.create().address);
    }
    SimpleStorage.methods.addDummy(addrs).send({from: web3.eth.defaultAccount});
  }

  render(){
    return (<React.Fragment>
      <CssBaseline />
      <Grid container justify="center">
        <Grid item xs={12} md={4}>
          <Typography style={{'text-align': 'center', 'padding': '16px 0px 0px 0px', 'font-size': '36px', 'font-weight': '900', color: 'darkgreen'}} fullWidth>{`Bamboo D.Game`}</Typography>
          {this.state.joined &&
            <Paper style={{ margin: '16px 0px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Blockies address={this.state.address} big />
              <Typography style={{ margin: '8px 0px' }}>{this.state.address}</Typography>
              <Typography>Your knot number: <b>{this.state.knot}</b></Typography>
              <Typography>Your bamboo length: <b>{this.state.length}</b></Typography>
            </Paper>}
          {this.state.joined && 
            <Paper>
              <List dense={true}>
                <JointDialog number={parseInt(this.state.knot) - 1} jointed={this.state.left} pos="left"/>
                <Divider/>
                <JointDialog number={parseInt(this.state.knot) + 1} jointed={this.state.right} pos="right"/>
              </List>
            </Paper>}
          {!this.state.joined && !this.state.master &&
            <Paper style={{ margin: '16px 0px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Blockies address={this.state.address} big />
              <Typography style={{ margin: '8px 0px' }}>{this.state.address}</Typography>
              <Button 
                onClick={this.handleCheckin} 
                style={{ margin: '8px 0px 0px 0px' }} 
                variant="contained" color="primary" fullWidth={true}
              >
                Join the game
              </Button>
            </Paper>}
          {this.state.master &&
            <Paper style={{ margin: '16px 0px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Blockies address={this.state.address} big />
              <Typography style={{ margin: '8px 0px' }}>{`Game master`}</Typography>
              <Button 
                onClick={this.stop} 
                style={{ margin: '8px 0px 0px 0px' }} 
                variant="contained" color="secondary" fullWidth={true}
              >
                Stop the game
              </Button>
              <Button 
                onClick={this.addDummy} 
                style={{ margin: '8px 0px 0px 0px' }} 
                variant="contained" color="primary" fullWidth={true}
              >
                Add 50 dummy account
              </Button>
            </Paper>}
        </Grid>
      </Grid>
      <Blockchain/>
    </React.Fragment>);
  }
}

ReactDOM.render(<App></App>, document.getElementById('app'));
