import React, { Component } from 'react'
import { SPage,} from 'servisofts-component2'
import SMD from '../Components/SMD';
import SSocket from 'servisofts-socket';
// import BottomNavigator from '../Components/BottomNavigator';
import Container from '../Components/Container';


export default class Inversiones extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
    };
  }

  componentDidMount() {

    SSocket.sendPromise({
      component: "enviroments",
      type: "get",
      key: "informacion_inversion",
    }).then((resp) => {
      this.setState({ text: resp.data });
    });
  }

  render() {
    return <SPage 
    // footer={<BottomNavigator />} 
    title={""}  >
      <Container>
        <SMD>{this.state.text}</SMD>
      </Container>
    </SPage>

  }
}