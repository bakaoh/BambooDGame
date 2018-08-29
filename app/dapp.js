import React from 'react';
import ReactDOM from 'react-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

import EmbarkJS from 'Embark/EmbarkJS';
import SimpleStorage from 'Embark/contracts/SimpleStorage';
import Blockies from './components/blockies';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tab: 0,
      address: '',
      joined: false,
      logs: []
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
        logs: [
        "SimpleStorage.methods.playerInfo()",
        "Account: " + this.state.address,
        "Join: " + _value.joined,
        "Knot: " + _value.knot,
        "Left: " + _value.left,
        "Right: " + _value.right,
        "Len: " + _value.length
      ]});
    })
  }

  render(){
    return (<React.Fragment>
      <CssBaseline />
      <Grid container justify="center">
        <Grid item xs={6} md={4}>
          <Paper>
            <Blockies address={this.state.address} />
            <AppBar position="static" color="default">
              <Tabs
                value={this.state.tab}
                onChange={this.handleChangeTab}
                indicatorColor="primary"
                textColor="primary"
                fullWidth
              >
                <Tab label="Left" />
                <Tab label="Right" />
              </Tabs>
            </AppBar>
            
          </Paper>
        </Grid>
      </Grid>
      <h3>{this.state.address}</h3>
      <p>{this.state.joined ? "joined" : "no"}</p>   
    </React.Fragment>);
  }
}

ReactDOM.render(<App></App>, document.getElementById('app'));
