import React from "react";
import { Animated, Easing, Platform } from "react-native";
import { SHr, SNavigation, SPage, SPopup, SText, STheme, SView } from "servisofts-component2";
import MDL from "../../MDL";
import PButtom from "../../Components/PButtom";
import Container from "../../Components/Container";
import QuestionItem from "./Components/QuestionItem";
import { ScrollView } from "react-native-gesture-handler";
export default class question extends React.Component {
    id = SNavigation.getParam("id", null);
    scrollAnimationValue = new Animated.Value(0);
    scrollAnimationListener = null;
    questionsScrollRef = null;
    questionsViewportHeight = 0;
    questionsContentHeight = 0;
    rowLayouts = {};
    lastScrollY = 0;
    scrollBeforeFocus = null;
    restoreOnInputExit = false;
    state = {
        preguntas: [],
        loading: true,
        error: null,
        selectedRowKey: null,
    }
    componentDidMount() {
        this.loadData();
        this.scrollAnimationListener = this.scrollAnimationValue.addListener(({ value }) => {
            this.questionsScrollRef?.scrollTo?.({ x: 0, y: value, animated: false });
        });
    }
    componentWillUnmount() {
        if (this.scrollAnimationListener) {
            this.scrollAnimationValue.removeListener(this.scrollAnimationListener);
            this.scrollAnimationListener = null;
        }
    }
    async loadData() {
        this.setState({ loading: true, error: null, preguntas: [] });
        try {
            const resp = await MDL.checklist.getCompleto(this.id)
            const preguntas = resp?.preguntas ?? [];
            if (preguntas.length <= 0) {
                this.setState({ loading: false, preguntas: [] });
                return;
            }
            let preguntas_filtradas = preguntas.filter((p) => p.tipo_pregunta != "photo");
            preguntas_filtradas = preguntas_filtradas.sort((a, b) => a.orden - b.orden);
            this.setState({ preguntas: preguntas_filtradas, loading: false });
        } catch (error) {
            this.setState({
                loading: false,
                error: "No se pudo cargar la información",
            });
        }
    }
    animateScrollTo = (toY, duration = 420) => {
        console.clear();
        console.log("%c" + JSON.stringify(toY, null, 2), "color: #2ECC40; font-weight: bold;");
        const safeY = Math.max(0, toY);
        this.scrollAnimationValue.stopAnimation();
        this.scrollAnimationValue.setValue(this.lastScrollY);
        Animated.timing(this.scrollAnimationValue, {
            toValue: safeY,
            duration,
            easing: Easing.bezier(0.22, 0.61, 0.36, 1),
            useNativeDriver: false,
        }).start();
    }
    handleNumberInputFocus = (rowKey, shouldRestoreOnExit = false, isLastItem = false) => {
        if (Platform.OS === 'web') {
            return;
        }
        this.setState({ selectedRowKey: rowKey });
        setTimeout(() => {
            const layout = this.rowLayouts[rowKey];
            if (!layout) return;
            this.restoreOnInputExit = shouldRestoreOnExit;
            if (this.scrollBeforeFocus === null) {
                this.scrollBeforeFocus = this.lastScrollY;
            }
            const visibleHeight = Math.max(0, this.questionsViewportHeight - 0);
            const targetTopOffset = visibleHeight * (isLastItem ? 0.15 : 0.4);
            const y = Math.max(0, layout.y - targetTopOffset);
            this.animateScrollTo(y, 900);
        }, 120);
    }
    render() {
       
       console.clear();
       console.log("%c" + "sss",`color: #2ECC40; font-weight: bold;`);
        const lastThreeRowKeys = this.state.preguntas.slice(-3).map((pregunta) => String(pregunta?.id ?? pregunta?.key ?? ""));
        const extraSpacerHeight = lastThreeRowKeys.includes(this.state.selectedRowKey) ? 150 : 20;
        return <SPage title={""} center disableScroll>
            <Container flex center>
                <ScrollView
                    ref={(ref) => { this.questionsScrollRef = ref; }}
                    style={{ width: "100%" }}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={this.state.loading ? { flexGrow: 1, justifyContent: 'center', paddingBottom: 12 } : { paddingBottom:  0}}
                    showsVerticalScrollIndicator={false}
                    onScroll={(event) => { this.lastScrollY = event?.nativeEvent?.contentOffset?.y ?? 0; }}
                    scrollEventThrottle={16}
                    onLayout={(event) => { this.questionsViewportHeight = event?.nativeEvent?.layout?.height ?? 0; }}
                    onContentSizeChange={(_, height) => { this.questionsContentHeight = height ?? 0; }}
                >
                    <SView flex center style={{ backgroundColor: STheme.color.card, padding: 16, borderRadius: 16, alignItems: "center" }}>
                        <SView col={"xs-12"} center style={{ alignItems: "center" }} row backgroundColor="transparent">
                            <SText font='AlbertSans' center fontSize={24} color={STheme.color.secondary}> TIEMPO DE CHECKLIST </SText>
                            <SHr height={10} />
                            <SView col={"xs-12"} height={1} style={{ backgroundColor: STheme.color.lightGray }} />
                        </SView>
                        <SHr height={24} />
                        {this.state.loading ? (<SView col={"xs-12"} flex center backgroundColor="transparent"><SText font='AlbertSans' bold center fontSize={18} color={STheme.color.secondary}>Cargando...</SText></SView>
                        ) : this.state.error ? (<SView col={"xs-12"} flex center><SText padding={32} center color={STheme.color.danger}>{this.state.error}</SText></SView>
                        ) : this.state.preguntas.length <= 0 ? (<SView col={"xs-12"} flex center><SText padding={32} center color={STheme.color.text}>No se encontró info</SText></SView>
                        ) : (
                            <>
                                <SView col={"xs-12"} center backgroundColor="transparent">
                                    <SText font='AlbertSans' bold center fontSize={22} color={STheme.color.text}>Validación Datos</SText>
                                </SView>
                                <SHr height={16} color="transparent" />
                                {this.state.preguntas.map((pregunta, index) => {
                                    const rowKey = String(pregunta?.id ?? pregunta?.key ?? Math.random());
                                    const isLastItem = index === this.state.preguntas.length - 1;
                                    const isSelected = this.state.selectedRowKey === rowKey;
                                    return <SView key={rowKey} onLayout={(event) => {
                                        this.rowLayouts[rowKey] = event?.nativeEvent?.layout ?? null;
                                    }}>
                                        <QuestionItem
                                            pregunta={pregunta}
                                            id_checklist={this.id}
                                            rowKey={rowKey}
                                            isLastItem={isLastItem}
                                            isSelected={isSelected}
                                            onFocusInput={this.handleNumberInputFocus}
                                        />
                                    </SView>
                                })}
                                <SHr height={extraSpacerHeight} 
                                // color="red" 
                                />
                                <PButtom center width={"100%"} onPress={() => {
                                    let valid = true;
                                    this.state.preguntas.forEach((pregunta) => {
                                        if (pregunta.requerido> 0) {
                                            const respuesta = pregunta?.respuesta?.respuesta;
                                            if (!respuesta) {
                                                valid = false;
                                            }
                                        }
                                    });
                                    if (!valid) {
                                        SPopup.alert("Por favor completa todas las preguntas requeridas.");
                                        return;
                                    }
                                    console.log(this.state.preguntas);
                                    SNavigation.navigate('/checklist/fotos', { id: this.id, });
                                    // SNavigation.navigate('/check/ChecklistImageCollection', { id: this.id, });
                                }}>SIGUIENTE</PButtom>
                            </>
                        )}
                    </SView>
                    <SHr h={32} />
                </ScrollView>
            </Container>
        </SPage>
    }
}