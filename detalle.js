import React from "react";
import { SHr, SImage, SLoad, SNavigation, SPage, SText, STheme, SView } from "servisofts-component2";
import BottomNavigator from "../../Components/BottomNavigator";
import SSocket from "servisofts-socket";
import { FlatList } from "react-native";
import Container from "../../Components/Container";
import MDL from "../../MDL";
import Card from "./Components/Card";

import Pdia from '../../Assets/svg/p-dia.svg'
import Pmodel from '../../Assets/svg/p-model.svg'
import Pprecio from '../../Assets/svg/p-precio.svg'
import BtnSend from "./Components/BtnSend";

// const params = SNavigation.getAllParams();

export default class detalle extends React.Component {
  static FOOTER = <BottomNavigator url={"/servicio"} />

  // state = {
  //   sucursales: [],
  //   loading: false,
  // };
  constructor(props) {
    super(props);
    this.state = {
      envio: 0,
      loading: false,
      paquete_detalle:[]
    };
    this.params = SNavigation.getAllParams();
    this.key = SNavigation.getParam("key_servicio");

  }

    btn = ({ title, onPress, active }) => {
        return <SView col={"xs-5.5"} height={44} center border={STheme.color.secondary} backgroundColor={active ? STheme.color.secondary : STheme.color.white} style={{ borderRadius: 8 }} onPress={onPress}  >
            <SText fontSize={14} color={active ? STheme.color.white : STheme.color.secondary} bold>{title}</SText>
        </SView>
    }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const paquete_detalle= await MDL.paquete.getByKey(
        this.params.pk,
    );
    this.state.paquete_detalle = paquete_detalle.data[this.params.pk];
    this.forceUpdate();
  }

      render_with_data() {
    
        var paquete = this.state.paquete_detalle;
        if (!paquete) return <SLoad />
        var { key, descripcion, observacion, dias, precio, participantes } = paquete;

        return <SView col={"xs-12"} center>

            <SView
                // height={125}
                col={"xs-12"}
                backgroundColor={STheme.color.darkGray}
                style={{
                    borderRadius: 10,
                    padding: 18
                }}
                row center
            >
                <SView col={"xs-3"} row  >
                    <SView style={{
                        width: 70,
                        height: 70,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 15,
                        overflow: "hidden"
                    }}>
                        <SImage enablePreview src={SSocket.api.root + "paquete/" + key + "?time=" + new Date().getTime()} width={"100%"} height={"100%"}
                            style={{
                                resizeMode: 'cover',
                            }}
                        />
                    </SView>
                </SView>
                <SView col={"xs-9"} height>
                    <SText color={STheme.color.text} fontSize={18} style={{ textTransform: "uppercase" }}>{descripcion}</SText>
                    <SHr h={4} />
                    <SView col={"xs-12"} flex>
                        <SText color={STheme.color.text} fontSize={12} >{observacion}</SText>
                    </SView>
                </SView>
            </SView>
            <SHr height={16} />
            <SView
                height={105}
                col={"xs-12"}
                backgroundColor={STheme.color.darkGray}
                style={{
                    borderRadius: 10,
                    padding: 18
                }}
                row
            >
                <SView col={"xs-5.8"} center >
                    <SText fontSize={14} >Días</SText>
                    <SView row center>
                        <Pdia name='Pdia' width={35} />
                        <SView width={15} />
                        <SText fontSize={32} >{dias}</SText>
                    </SView>
                </SView>
                <SView style={{ borderWidth: 1, borderRightColor: STheme.color.white }} height width={2}></SView>
                <SView col={"xs-5.8"} center>
                    <SText fontSize={14} >Participantes</SText>
                    <SView row center>
                        <Pmodel name='Pmodel' width={35} />
                        <SView width={15} />
                        <SText fontSize={32} >{participantes}</SText>
                    </SView>
                </SView>
            </SView>
            <SHr height={16} />
            <SView
                height={105}
                col={"xs-12"}
                backgroundColor={STheme.color.darkGray}
                style={{
                    borderRadius: 10,
                    padding: 18,
                    borderColor: STheme.color.secondary,
                    borderWidth: 2
                }}
                center
            >
                <SText fontSize={18} >Precio</SText>
                <SView row center>
                    <Pprecio name='Pprecio' width={35} />
                    <SView width={15} />
                    <SText fontSize={32} >Bs. {precio}</SText>
                </SView>
            </SView>
            <SHr height={26} />
            <BtnSend
                onPress={() => {
                    var usuario = MDL.usuario.session
                    console.log("usuario", usuario);
                    // var usuario = "c4310023-4413-42dd-9676-e9ed1bd862dc"; 
                    // if (!usuario) return SPopup.open({ key: "confirmar", content: this.popupMensajeLogin() });
                    if (!usuario) return SNavigation.navigate("/cuenta", { ...this.params });
                    let clonacion = {
                        ...this.params,
                        dataUser: usuario,
                    }
                    console.log("clonacion", clonacion);
                    SNavigation.navigate("/paquete/membresia/confirmar", clonacion);
                }}
            >Adquirir paquete</BtnSend>
        </SView>

    }

  render() {
    return <SPage  title={"Detalle Membresía"}>
      <Container flex>
        {this.render_with_data()}
      </Container>
      <SHr height={30} />
    </SPage>
  }
}


