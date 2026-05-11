import React from "react";
import { SHr, SLoad, SNavigation, SPage, SText, STheme, SView } from "servisofts-component2";
import BottomNavigator from "../../Components/BottomNavigator";
import SSocket from "servisofts-socket";
import { FlatList } from "react-native";
import Container from "../../Components/Container";
import MDL from "../../MDL";
import Card from "./Components/Card";

// const params = SNavigation.getAllParams();

export default class membresia extends React.Component {
  static FOOTER = <BottomNavigator url={"/servicio"} />

  // state = {
  //   sucursales: [],
  //   loading: false,
  // };
  constructor(props) {
    super(props);
    this.state = {
      envio: 0,
      sucursales: [],
      loading: false,
    };
    this.key_servicio = SNavigation.getParam("key_servicio");
    this.key_sucursal = SNavigation.getParam("key_sucursal");

  }

  componentDidMount() {
    this.loadData();
  }
  async loadData() {
    var key_usuario = MDL.usuario.session?.key;
    // var key_usuario = "c4310023-4413-42dd-9676-e9ed1bd862dc"

    if (key_usuario) {
      // this.setState({ data: {} })
      // key_usuario = "c4310023-4413-42dd-9676-e9ed1bd862dc"
      // return;
      console.log("holaaaaa")

      const data = await SSocket.sendPromise({
        "version": "1.0",
        "component": "paquete_promo_usuario",
        "type": "getAll",
        "estado": "cargando",
        "key_usuario": key_usuario,
      })
      this.state.data = Object.values(data?.data).filter(a => a?.estado != 0);

    } else {
      this.state.data = {};
      console.log("no hay usuario logueado")
      // SNavigation.replace("/usuario/login");
      // return;
    }


    // const sucursal_paquete = await MDL.paquete.getAll(
    //   {
    //     key_servicio: this.key_servicio,
    //     key_sucursal: this.key_sucursal,
    //   }
    // );

    const sucursal_paquete = await SSocket.sendPromise({
      "version": "1.0",
      "component": "paquete",
      "type": "getAll",
      // "estado": "cargando",
      "key_servicio": (this.key_servicio).toString(),
      "key_sucursal": this.key_sucursal,
    }).then((e) => {
      if (e.estado != "exito") return;
      return e.data;
    }).catch((e) => {
      console.error(e)
      return null;
    });
    // this.state.paquete = Object.values(sucursal_paquete).filter(a => a?.estado != 0);
   

    if (sucursal_paquete) {
      this.state.paquete = Object.values(sucursal_paquete).filter(a => a?.estado != 0);
      console.log("Paquetes encontrados:", this.state.paquete.length);
    } else {
      this.state.paquete = []; // o null, según lo que necesites
      console.log("No se encontraron paquetes para esta sucursal");
    }
     this.forceUpdate();

  }

  render_with_data() {

    let paquetes = this.state.paquete;

    if (!paquetes) return <SLoad />
    if (!this.state.data) return <SLoad />

    let arr_paquete_promo_usuario = Object.values(this.state.data)
    var dataMostrar = [];
    Object.values(paquetes).map((obj) => {
      if (obj.estado === 0) return null
      let obj_ppu = arr_paquete_promo_usuario.find(a => a.key_paquete == obj.key)

      if (!obj_ppu) {
        if (!obj.estado_app) return null
      } else {
        obj.promo_usuario = obj_ppu;
      }

      dataMostrar.push(obj)
    })
    return <FlatList
      data={Object.values(dataMostrar).sort((a, b) => a.precio - b.precio)}
      renderItem={({ item }) => {
        return <Card datas={item} dataPaquete={paquetes} key_sucursal={this.key_sucursal} />
      }}
      ListHeaderComponent={() => <SHr h={32} />}
      ListFooterComponent={() => <SHr h={32} />}
      ItemSeparatorComponent={() => <SHr h={15} />}
      // numColumns={2}
      style={{ width: "100%" }}

      keyExtractor={(item) => item.key}
      onRefresh={() => {
        this.setState({ sucursales: [] });
        this.loadData();
      }}
      refreshing={this.state.loading}
    />
  }

  render() {
    return <SPage title={'Comprar'}>
      <Container flex>
        {this.render_with_data()}
        {/* <FlatList
          data={this.state.data}
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
        /> */}
      </Container>
    </SPage>
  }
}


