import React from "react";
import { SHr, SPage, SText, SView } from "servisofts-component2";
import BottomNavigator from "../../Components/BottomNavigator";
import Sucursal from "../../Components/Sucursal";
import SSocket from "servisofts-socket";
import { FlatList } from "react-native";
import Container from "../../Components/Container";
import sucursal from ".";

export default class index extends React.Component {
  static FOOTER = <BottomNavigator url={"/sucursal"} />

  state = {
    sucursales: [],
    loading: false,
  };
  componentDidMount() {
    this.loadData();
  }
  async loadData() {
    const data = await SSocket.sendPromise({
      "version": "1.0",
      "component": "sucursal",
      "type": "getAll",
      "estado": "cargando"
    })
    this.state.sucursales = Object.values(data.data).filter(a => a.estado_app > 0 && !a.tipo_tienda);
    this.forceUpdate();
  }
  render() {
    return <SPage hidden
      disableScroll
      header={<Sucursal.MapaListaButtoms url={"/sucursal"} />}
    >
      <Container flex>
        <FlatList
          data={this.state.sucursales}
          renderItem={({ item }) => {
            return <Sucursal.Card image={1} data={item} key_sucursal={item.key} root={'/sucursal/detalle'} />
          }}
          ListHeaderComponent={() => <SHr h={32} />}
          ListFooterComponent={() => <SHr h={32} />}
          numColumns={2}
          keyExtractor={(item) => item.key}
          onRefresh={() => {
            this.setState({ sucursales: [] });
            this.loadData();
          }}
          refreshing={this.state.loading}
        />
      </Container>
    </SPage>
  }
}


