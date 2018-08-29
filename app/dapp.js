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

import EmbarkJS from 'Embark/EmbarkJS';
import SimpleStorage from 'Embark/contracts/SimpleStorage';
import Blockies from './components/blockies';
import Blockchain from './components/blockchain';
import JointDialog from './components/jointDialog';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tab: 0,
      address: '',
      knot: 0,
      left: '',
      right: '',
      list: [],
      joined: false,
      length: 0
    }

    this.handleChangeTab = this.handleChangeTab.bind(this);
  }

  componentDidMount(){
    EmbarkJS.onReady(() => {
      this.getInfo(web3.eth.defaultAccount);
    });
  }

  handleChangeTab(event, value) {
    this.setState({ tab: value });
  }

  getInfo(address) {
    SimpleStorage.methods.playerInfo(address).call()
      .then(_value => {
        this.setState({
          address: address,
          joined: _value.joined != 0,
          knot: _value.knot,
          left: _value.left,
          right: _value.right,
          length: _value.length
        });
      })
  }

  render(){
    return (<React.Fragment>
      <CssBaseline />
      <Grid container justify="center">
        <Grid item xs={12} md={4}>
          <Paper style={{ margin: '16px 0px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Blockies address={this.state.address} big />
            <Typography style={{ margin: '8px 0px' }}>{this.state.address}</Typography>
            <Typography>Your knot number: <b>{this.state.knot}</b></Typography>
            <Typography>Your bamboo length: <b>{this.state.length}</b></Typography>
          </Paper>
          <Paper>
            <List dense={true}>
              <JointDialog number={5} jointed={this.state.left} pos="left"/>
              <Divider/>
              <JointDialog number={7} jointed={this.state.right} pos="right"/>
            </List>
          </Paper>
        </Grid>
      </Grid>
      <Blockchain/>
    </React.Fragment>);
  }
}

ReactDOM.render(<App></App>, document.getElementById('app'));
