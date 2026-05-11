import React, { useEffect } from "react";
import { TextInput } from 'react-native'
import { SHr, SNavigation, SNotification, SPage, SPopup, SText, STheme, SView, } from "servisofts-component2";
import MDL from "../../MDL";
import HTTP from "../../HTTP";
import PButtom from "../../Components/PButtom";
import Container from "../../Components/Container";
import Item_photo_picker from "../check/Components/Item_photo_picker";
import Config from "../../Config";
import { ScrollView } from "react-native";
import Carga_truck from '../../Assets/carga_truck.svg';
export default class fotos extends React.Component {
    id = SNavigation.getParam("id", null);
    incidenciaUpdateTimeout = null;
    lastIncidenciaSent = undefined;
    initialPhotos = {};
    networkWarningShown = false;
    state = {
        preguntas: [],
        photos: {},
        photoUploadStatus: {},
        missingRequired: {},
        incidencia: '',
        loading: true,
        error: null,
        isSaving: false,
        uploadCurrent: 0,
        uploadTotal: 1,
    }
    componentDidMount() {
        this.checkInternetConnection();
        this.loadData();
    }
    bindNetworkListeners() {
        if (typeof window === 'undefined') return;
        window.addEventListener('online', this.checkInternetConnection);
        window.addEventListener('offline', this.checkInternetConnection);
    }
    isOffline() {
        if (typeof navigator === 'undefined' || typeof navigator.onLine !== 'boolean') {
            return false;
        }
        return navigator.onLine === false;
    }
    checkInternetConnection = () => {
        if (this.isOffline()) {
            if (this.networkWarningShown) return;
            this.networkWarningShown = true;
            SNotification.send({
                key: 'checklist_offline_warning',
                title: 'Sin conexión',
                body: 'No hay conexión a internet. Conéctese o intente de nuevo.',
                color: STheme.color.danger,
                time: 4000,
            });
            return;
        }
        this.networkWarningShown = false;
    }
    getSelectedPhotoEntries() {
        return Object.entries(this.state.photos || {}).filter(([, file]) => !!file?.uri);
    }
    getChangedPhotoEntries() {
        const currentPhotos = this.state.photos || {};
        const initialPhotos = this.initialPhotos || {};
        return Object.entries(currentPhotos).filter(([photoId, file]) => {
            if (!file?.uri) return false;
            const initialFile = initialPhotos?.[photoId];
            if (!initialFile?.uri) return true;
            return String(file.uri) !== String(initialFile.uri) || String(file.name || '') !== String(initialFile.name || '');
        });
    }
    getMissingRequiredMap() {
        const missingRequired = {};
        (this.state.preguntas || []).forEach((pregunta) => {
            const uploadStatus = this.state.photoUploadStatus?.[pregunta.id]?.status;
            if (pregunta?.requerido> 0 && (!this.state.photos?.[pregunta.id]?.uri || uploadStatus === 'uploading' || uploadStatus === 'error')) {
                missingRequired[pregunta.id] = true;
            }
        });
        return missingRequired;
    }
    getPendingOrFailedUploads() {
        return (this.state.preguntas || []).filter((pregunta) => {
            const file = this.state.photos?.[pregunta.id];
            const uploadStatus = this.state.photoUploadStatus?.[pregunta.id]?.status;
            return !!file?.uri && uploadStatus && uploadStatus !== 'success';
        });
    }
    getUploadErrorMessage() {
        return 'No se subió la foto.';
    }
    updatePhotoStatus(photoId, status, message = null) {
        this.setState((prev) => ({
            photoUploadStatus: {
                ...(prev.photoUploadStatus || {}),
                [photoId]: {
                    status,
                    message,
                },
            },
        }));
    }
    async savePhoto(pregunta, file) {
        const resp = await MDL.checklist.postChecklistFoto({
            checklist_id: String(this.id),
            checklist_pregunta_id: pregunta.id,
            file,
        });
        let urlPath = resp?.path ?? '';
        urlPath = urlPath.substring(1, urlPath.length);
        await MDL.checklist.setChecklistDetalle({
            id_pregunta: pregunta.id,
            id_checklist: this.id,
            value: file.name,
            url_path: urlPath,
        });
        return resp;
    }
    handlePhotoChange = async (pregunta, file) => {
        this.setState((prev) => ({
            photos: {
                ...(prev.photos || {}),
                [pregunta.id]: file,
            },
            missingRequired: {
                ...(prev.missingRequired || {}),
                [pregunta.id]: false,
            },
        }));
        this.updatePhotoStatus(pregunta.id, 'uploading');
        try {
            await this.savePhoto(pregunta, file);
            this.updatePhotoStatus(pregunta.id, 'success');
        } catch (error) {
            this.updatePhotoStatus(pregunta.id, 'error', this.getUploadErrorMessage(error));
        }
    }
    retryPhotoUpload = async (pregunta) => {
        const file = this.state.photos?.[pregunta.id];
        if (!file?.uri) return;
        await this.handlePhotoChange(pregunta, file);
    }
    async loadData() {
        this.setState({ loading: true, error: null, preguntas: [], missingRequired: {} });
        try {
            const resp = await MDL.checklist.getCompleto(this.id)
            const respw = {
                "id": "43ef99c0-e31f-49cb-b783-7f107dfe1a8a",
                "state": 1,
                "created_at": "2026-05-06T09:53:43.962911",
                "updated_at": "2026-05-08T01:53:15.843096",
                "matricula": "R-5301-BCM",
                "dni": "18536035J",
                "incidencia": "0sssssssss",
                "tipo_vehiculo_id": "2",
                "completado": "exito",
                "preguntas": [
                    {
                        "id": "d3dcdc1b-3781-4669-8fa8-399447bad926",
                        "state": 1,
                        "created_at": "2026-05-05T07:49:20.924982",
                        "updated_at": "2026-05-05T07:49:20.924982",
                        "tipo_vehiculo_id": 2,
                        "tipo_pregunta": "photo",
                        "pregunta": "Subir foto Tracera",
                        "valor_referencia": null,
                        "requerido": null,
                        "data": null,
                        "orden": 1,
                        "grupo": "foto",
                        "respuesta": {
                            "id": "ade878bd-fb0b-45bb-83b7-fff3446c5231",
                            "state": 1,
                            "created_at": "2026-05-07T02:30:57.250404",
                            "updated_at": "2026-05-07T02:30:57.250404",
                            "checklist_id": "43ef99c0-e31f-49cb-b783-7f107dfe1a8a",
                            "checklist_pregunta_id": "d3dcdc1b-3781-4669-8fa8-399447bad926",
                            "respuesta": "plus-line-icon 1.svg",
                            "observacion": null,
                            "url_path": "servisoftsFiles/checklist/43ef99c0-e31f-49cb-b783-7f107dfe1a8a/d3dcdc1b-3781-4669-8fa8-399447bad926/plus-line-icon 1.svg"
                        }
                    },
                    {
                        "id": "85223503-8363-422e-836d-4f67c73d634d",
                        "state": 1,
                        "created_at": "2026-05-05T07:49:45.276438",
                        "updated_at": "2026-05-05T07:49:45.276438",
                        "tipo_vehiculo_id": 2,
                        "tipo_pregunta": "photo",
                        "pregunta": "Subir foto Frontal",
                        "valor_referencia": null,
                        "requerido": null,
                        "data": null,
                        "orden": 2,
                        "grupo": "foto",
                        "respuesta": null
                    }
                ]
            };
            const preguntas = resp?.preguntas ?? [];
            const preguntas_filtradas = preguntas.filter((p) => p.tipo_pregunta == "photo").sort((a, b) => a.orden - b.orden);
            const photos = {};
            const photoUploadStatus = {};
            const incidenciaRaw = resp?.incidencia;
            const incidencia = incidenciaRaw === 0 || String(incidenciaRaw ?? '').trim() === '0'
                ? ''
                : String(incidenciaRaw ?? '');
            preguntas_filtradas.forEach((pregunta) => {
                if (pregunta?.respuesta?.url_path) {
                    const loadedPhoto = {
                        uri: Config.apis.api_checklist + "/" + pregunta.respuesta.url_path,
                        name: pregunta.respuesta.respuesta,
                    };
                    photos[pregunta.id] = loadedPhoto;
                    this.initialPhotos[pregunta.id] = loadedPhoto;
                    photoUploadStatus[pregunta.id] = { status: 'success' };
                }
            });
            this.initialPhotos = { ...this.initialPhotos };
            this.setState({
                preguntas: preguntas_filtradas,
                photos,
                photoUploadStatus,
                incidencia,
                loading: false,
            });
        } catch (error) {
            this.checkInternetConnection();
            this.setState({
                loading: false,
                error: "No se pudo cargar la información",
                preguntas: [],
            });
        }
    }
    async completar() {
        if (this.state.isSaving) return;
        const missingRequired = this.getMissingRequiredMap();
        if (Object.keys(missingRequired).length> 0) {
            this.setState({ missingRequired });
            SPopup.alert("Por favor completa todas las fotos requeridas.");
            return;
        }
        const selectedPhotos = this.getSelectedPhotoEntries();
        const changedPhotos = this.getChangedPhotoEntries();
        if (selectedPhotos.length <= 0 || changedPhotos.length <= 0) {
            this.abrirPopupSinCambios();
            return;
        }
        const uploadTotal = selectedPhotos.length> 0 ? selectedPhotos.length : 1;
        const pendingOrFailedUploads = this.getPendingOrFailedUploads();
        if (pendingOrFailedUploads.length> 0) {
            SPopup.alert("Hay fotos que no se subieron. Reintenta antes de continuar.");
            return;
        }
        this.setState({ isSaving: true, uploadCurrent: 0, uploadTotal });
        await this.flushIncidenciaUpdate();
        try {
            this.abrirPopupCompletado();
            for (let i = 0; i < uploadTotal; i++) {
                await new Promise((resolve) => setTimeout(resolve, 350));
                this.setState({ uploadCurrent: i + 1 });
            }
            const resp = await MDL.checklist.completado({ id: this.id, incidencia: this.state.incidencia || "", })
            await new Promise((resolve) => setTimeout(resolve, 1200));
            SPopup.close("popup_ejemplo");
            SNavigation.reset("/checklist");
            return resp;
        } finally {
            this.setState({ isSaving: false, uploadCurrent: 0, uploadTotal: 1 });
        }
    }
    handleIncidenciaChange = (text) => {
        this.setState({ incidencia: text });
        this.scheduleIncidenciaUpdate(text);
    }
    scheduleIncidenciaUpdate = (mensaje) => {
        if (this.incidenciaUpdateTimeout) {
            clearTimeout(this.incidenciaUpdateTimeout);
            this.incidenciaUpdateTimeout = null;
        }
        this.incidenciaUpdateTimeout = setTimeout(() => {
            this.updateIncidenciaOnServer(mensaje);
        }, 600);
    }
    updateIncidenciaOnServer = async (incidencia) => {
        try {
            const checklist_id = this.id;
            if (!checklist_id || !incidencia) {
                return;
            }
            const response = await HTTP.PUT({
                url: `${Config.apis.api_checklist}/checklist/test_simple/${checklist_id}/${incidencia}`,
                body: {},
            });
            this.lastIncidenciaSent = incidencia;
            return response;
        } catch (error) {
            console.error("Error al actualizar incidencia", error);
        }
    }
    flushIncidenciaUpdate = async () => {
        if (this.incidenciaUpdateTimeout) {
            clearTimeout(this.incidenciaUpdateTimeout);
            this.incidenciaUpdateTimeout = null;
        }
        await this.updateIncidenciaOnServer(this.state.incidencia);
    }
    abrirPopupCompletado = () => {
        SPopup.open({
            key: "popup_ejemplo",
            content: (
                <PopupGuardandoFotos owner={this} />
            ),
        });
    }
    abrirPopupSinCambios = () => {
        SPopup.open({
            key: "popup_ejemplo",
            content: (
                <PopupGuardandoFotos owner={this} mode="no_changes" />
            ),
        });
        setTimeout(() => {
            SPopup.close("popup_ejemplo");
            SNavigation.reset("/checklist");
        }, 1400);
    }
    render() {
        const { incidencia, isSaving, uploadCurrent, uploadTotal } = this.state;
        const progress = uploadTotal> 0 ? Math.min(1, uploadCurrent / uploadTotal) : 0;
        const selectedPhotosCount = this.getSelectedPhotoEntries().length;
        const photoCount = (this.state.preguntas || []).length;
        const isTwoPhotos = photoCount === 2;
        if (this.state.loading) {
            return <SPage title={""} center disableScroll>
                <Container flex>
                    <SView flex center style={{ backgroundColor: STheme.color.card, padding: 24, borderRadius: 16, alignItems: "center", justifyContent: "center" }}>
                        <SText font='AlbertSans' bold center fontSize={18} color={STheme.color.secondary}>Cargando...</SText>
                    </SView>
                </Container>
            </SPage>
        }
        return <SPage title={""} center disableScroll>
            <Container flex>
                <ScrollView style={{ width: "100%" }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <SView flex center style={{ backgroundColor: STheme.color.card, padding: 16, borderRadius: 16, alignItems: "center" }}>
                        <SView col={"xs-12"} center style={{ alignItems: "center" }} row backgroundColor="transparent">
                            <SText font='AlbertSans' center fontSize={24} color={STheme.color.secondary}> TIEMPO DE CHECKLIST </SText>
                            <SHr height={10} />
                            <SView col={"xs-12"} height={1} style={{ backgroundColor: STheme.color.lightGray }} />
                        </SView>
                                                <SView col={"xs-12"} flex style={{ minHeight: 0, alignSelf: 'center' }} center>
                            {this.state.error ? (<SView col={"xs-12"} flex center style={{ minHeight: 180 }}><SText center color={STheme.color.danger}>{this.state.error}</SText></SView>
                            ) : this.state.preguntas.length <= 0 ? (<SView col={"xs-12"} flex center style={{ minHeight: 180 }}><SText center color={STheme.color.text}>No se encontró info</SText></SView>
                            ) : (
                                <>
                                    <SView col={"xs-12"} center>
                                        <SText font='AlbertSans' bold center fontSize={22} color={STheme.color.text}>Insertar Fotografías</SText>
                                        <SHr height={16} color="transparent" />
                                        <SView col={"xs-11"} row style={{ flexWrap: 'wrap', justifyContent: isTwoPhotos ? 'space-between' : 'space-between', paddingHorizontal: isTwoPhotos ? 4 : 8 }} center backgroundColor="transparent">
                                            {this.state.preguntas.map((pregunta) => {
                                                return <FotoComponent key={String(pregunta?.id ?? pregunta?.key ?? Math.random())} pregunta={pregunta} owner={this} useTwoPhotos={isTwoPhotos} onChangePhoto={(file) => {
                                                    this.handlePhotoChange(pregunta, file);
                                                }} highlightRequired={!!this.state.missingRequired?.[pregunta.id]} />
                                            })}
                                        </SView>
                                        <SHr height={8} color="transparent" />
                                        <SView col={"xs-12"} style={{ alignItems: 'flex-start' }}>
                                            <SText font='AlbertSans' bold style={{ paddingLeft: 2, }} fontSize={13} color={STheme.color.secondary}>Ingrese la incidencia</SText>
                                            <SHr height={4} />
                                            <TextInput multiline numberOfLines={1} placeholder="Escribe aquí el detalle de la incidencia" placeholderTextColor={STheme.color.lightGray}
                                                value={String(incidencia ?? '')} onChangeText={this.handleIncidenciaChange} onBlur={this.flushIncidenciaUpdate}
                                                style={{
                                                    width: '100%', minHeight: 64, borderRadius: 12, borderWidth: 1, borderColor: STheme.color.secondary,
                                                    backgroundColor: STheme.color.card, color: STheme.color.text, paddingHorizontal: 12, paddingVertical: 10, fontSize: 12, textAlignVertical: 'top', outlineWidth: 0, outlineStyle: "none",
                                                }} />
                                        </SView>
                                        <SHr height={14} color="transparent" />
                                        <PButtom center borderRadius={8} width={"100%"} onPress={() => {
                                            this.completar();
                                        }}>SIGUIENTE</PButtom>
                                    </SView>
                                </>
                            )}
                        </SView>
                    </SView>
                    <SHr h={32} />
                </ScrollView>
            </Container>
        </SPage>
    }
}
const FotoComponent = ({ pregunta, owner, onChangePhoto, highlightRequired, useTwoPhotos }) => {
    const [file, setFile] = React.useState(null); useEffect(() => {
        const loadFile = async () => {
            if (pregunta.respuesta?.url_path) {
                const nextFile = { uri: Config.apis.api_checklist + "/" + pregunta.respuesta.url_path, name: pregunta.respuesta.respuesta };
                setFile(nextFile);
            }
        }
        loadFile();
    }, [pregunta.respuesta]);
    const onChange = (file) => {
        setFile(file);
        if (onChangePhoto) {
            onChangePhoto(file);
        }
    }
    const preguntaTexto = (pregunta?.pregunta ?? "").replace("Subir foto", "").trim();
    const cardWidth = useTwoPhotos ? "48%" : "50%";
    const pickerBoxWidth = useTwoPhotos ? 118 : 126;
    const pickerBoxHeight = useTwoPhotos ? 118 : 126;
    const labelWidth = useTwoPhotos ? 180 : 120;
    return <SView style={{ width: cardWidth, justifyContent: "center", alignItems: "center", paddingBottom: 16, paddingHorizontal: useTwoPhotos ? 6 : 4 }}>
        <Item_photo_picker uri={file?.uri} onChange={onChange}
            text={pregunta.pregunta}
            label={preguntaTexto}
            required={pregunta.requerido}
            highlightRequired={highlightRequired}
            labelWidth={labelWidth}
            boxWidth={pickerBoxWidth}
            boxHeight={pickerBoxHeight}
            uploadStatus={owner?.state?.photoUploadStatus?.[pregunta.id]?.status || 'idle'}
            uploadMessage={owner?.state?.photoUploadStatus?.[pregunta.id]?.message}
            onRetryUpload={() => owner?.retryPhotoUpload?.(pregunta)}
        />
    </SView>
}
const PopupGuardandoFotos = ({ owner, mode = "saving" }) => {
    const [tick, setTick] = React.useState(0);
    React.useEffect(() => {
        const timer = setInterval(() => {
            setTick((value) => value + 1);
        }, 100);
        return () => clearInterval(timer);
    }, []);
    const uploadCurrent = owner?.state?.uploadCurrent ?? 0;
    const uploadTotal = owner?.state?.uploadTotal ?? 1;
    const selectedPhotosCount = owner?.getSelectedPhotoEntries?.().length ?? 0;
    const progress = uploadTotal> 0 ? Math.min(1, uploadCurrent / uploadTotal) : 0;
    const isNoChanges = mode === "no_changes";
    return <SView col={"xs-12"} center style={{ width: '100%', height: '100%', zIndex: 9999, padding: 22, }}>
        <SView col={"xs-11"} center style={{ maxWidth: 360, borderRadius: 16, backgroundColor: STheme.color.primary, padding: 22, }}>
            <SView center style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: STheme.color.secondary + '22', }}>
                <Carga_truck width={48} height={32} fill={STheme.color.secondary} />
            </SView>
            <SHr height={14} />
            {isNoChanges ? (
                <>
                    <SText font='AlbertSans' bold center fontSize={20} color={STheme.color.text}> No hay cambios </SText>
                    <SHr height={8} />
                    <SText font='AlbertSans' center fontSize={15} color={STheme.color.secondary}> No se hicieron cambios en las fotos. </SText>
                </>
            ) : (
                <>
                    <SText font='AlbertSans' bold center fontSize={20} color={STheme.color.text}> Guardando coleccion de fotos </SText>
                    <SHr height={6} />
                    <SText font='AlbertSans' center fontSize={16} color={STheme.color.secondary}> Subiendo foto por foto </SText>
                    <SHr height={10} />
                    <SText font='AlbertSans' center fontSize={15} color={STheme.color.text}>
                        {selectedPhotosCount> 0
                            ? `Foto ${Math.min(uploadCurrent, uploadTotal)} de ${uploadTotal}`
                            : `Procesando finalización`}
                    </SText>
                    <SHr height={10} />
                    <SView style={{ width: '100%', height: 10, borderRadius: 8, backgroundColor: STheme.color.lightGray, overflow: 'hidden', }}>
                        <SView style={{ width: `${Math.round(progress * 100)}%`, height: '100%', backgroundColor: STheme.color.secondary, }} />
                    </SView>
                    <SHr height={12} />
                    <SText font='AlbertSans' center fontSize={14} color={STheme.color.text}> Por favor espere... </SText>
                </>
            )}
        </SView>
    </SView>;
};