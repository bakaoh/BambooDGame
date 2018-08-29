import EmbarkJS from 'Embark/EmbarkJS';
import SimpleStorage from 'Embark/contracts/SimpleStorage';
import React from 'react';
import Blockies from './blockies';
import { Form, FormGroup, FormControl, HelpBlock, Button, Col } from 'react-bootstrap';
 
class Blockchain extends React.Component {

    constructor(props) {
      super(props);
  
      this.state = {
        number: 0,
        address: "",
        logs: []
      }
    }

    componentDidMount(){
      EmbarkJS.onReady(() => {
        this.setState({address: web3.eth.defaultAccount})
        this.getInfo();
      });
    }

    checkin(){
      SimpleStorage.methods.checkin().send({from: web3.eth.defaultAccount});
    }

    getInfo() {
      SimpleStorage.methods.playerInfo(this.state.address).call()
      .then(_value => {
        this.setState({logs: [
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

    addAttendees() {
      let addrs = [];
      for (let i = 0; i < 50; i++) {
        addrs.push(web3.eth.accounts.create().address);
      }
      this.setState({logs: addrs});
      SimpleStorage.methods.addDummy(addrs).send({from: web3.eth.defaultAccount});
    }
  
    handleNumberChange(e){
      this.setState({number: e.target.value});
    }
  
    handleAddressChange(e){
      this.setState({address: e.target.value});
    }
  
    knotsByNum(){
      var value = parseInt(this.state.number, 0);
      SimpleStorage.methods.knotsByNum(value).call()
        .then(_value => {
          this.setState({logs: _value});
        })
    }

    render(){
      return (<React.Fragment>
          <Col xs={6} md={4}>
            <Blockies address={this.state.address} />
          </Col>
          <h3> 1. Info</h3>
          <Form inline>
            <FormGroup>
              <FormControl
                type="text"
                defaultValue={this.state.address}
                onChange={(e) => this.handleAddressChange(e)} />
              <Button bsStyle="primary" onClick={() => this.getInfo()}>Get Info</Button>
            </FormGroup>
            <FormGroup>
              <FormControl
                type="text"
                defaultValue={this.state.number}
                onChange={(e) => this.handleNumberChange(e)} />
              <Button bsStyle="primary" onClick={() => this.knotsByNum()}>Get Knots</Button>
            </FormGroup>
          </Form>

          <h3> 2. Action</h3>
          <Form inline>
            <FormGroup>
              <Button bsStyle="primary" onClick={() => this.checkin()}>Join</Button>
            </FormGroup>
            <FormGroup>
              <Button bsStyle="primary" onClick={() => this.addAttendees()}>Add 50 attendees</Button><br/>
            </FormGroup>
          </Form>
          
          <h3> Logs </h3>
          <div className="logs">
          {
            this.state.logs.map((item, i) => <p key={i}>{item}</p>)
          }
          </div>
      </React.Fragment>
      );
    }
  }

  export default Blockchain;