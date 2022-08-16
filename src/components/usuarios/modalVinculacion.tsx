import { Backdrop, Box, createStyles, Fade, FormControl, Grid, InputLabel, makeStyles, MenuItem, Modal, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, Typography } from "@material-ui/core"
import { FC, useMemo, useState } from "react";
import FormControlHeader from "../core/input/form-control-select";
import { useListarGrupoFamiliarSinUsuarios } from "../grupo-familiar/use-grupo-familia";
import { useGetUsuario, useListadoUsuario, useAsignacionUsuarioMutate, useListadoUsuarioSinFamilares } from './use-usuario';
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@material-ui/icons/Save'
import { SupervisedUserCircle } from "@material-ui/icons"
import ModalAuth from "../core/input/dialog/modal-dialog";
import { isNotNilOrEmpty } from "../../utils/is-nil-empty";
import { COLOR_PRIMARIO } from '../../utils/keys';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: "auto"
        },
        paper: {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.palette.background.paper,
            // border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            borderRadius: 10,
            minWidth: theme.spacing(35),
        },
        containerTitle: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        iconInfo: {
            color: theme.palette.info.dark,
            marginRight: theme.spacing(2),
        },
        iconError: {
            color: theme.palette.error.light,
            marginRight: theme.spacing(2),
        },
        titleInfo: {
            fontSize: theme.typography.pxToRem(23),
            fontWeight: "bold",
            color: theme.palette.info.dark,
        },
        titleError: {
            fontSize: theme.typography.pxToRem(23),
            fontWeight: "bold",
            color: theme.palette.error.dark,
        },
        contentButton: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'end',
            marginTop: theme.spacing(3),
        },
        buttonInfo: {
            backgroundColor: theme.palette.info.dark,
            color: 'white',
            '&:hover': {
                backgroundColor: theme.palette.info.main,
            },
        },
        buttonError: {
            backgroundColor: theme.palette.error.dark,
            color: 'white',
            '&:hover': {
                backgroundColor: theme.palette.error.main,
            },
        },
    })
)


interface IProps {
    open: boolean,
    onClose: () => void;
    idUsuario: number
}

const ModalVinculacionUsuario: FC<IProps> = ({ onClose, open, idUsuario }) => {
    const classes = useStyles()
    const { refetch: refetchListadoUsuario } = useListadoUsuario();
    const [idGrupoSeleccionado, setIdGrupoSeleccionado] = useState<number>()
    const [loadingMutate, setLoadingMutate] = useState(false)
    const { data: dataGetUsuario, loading: loadingGetUsuario } = useGetUsuario(idUsuario)
    const { data: dataListarGrupo, loading: loadingListarGrupo, refetch: refetchListadoUsuarioSinGrupo } = useListarGrupoFamiliarSinUsuarios()
    const { refetch: refetchUsuariosSinFamiliares } = useListadoUsuarioSinFamilares()
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)

    const dataUsuario = useMemo(() => {
        if (!loadingGetUsuario && dataGetUsuario && dataGetUsuario.GetUsuario) {
            return dataGetUsuario.GetUsuario
        }
        return null
    }, [dataGetUsuario, loadingGetUsuario])


    const dataListadoGrupoFamiliar = useMemo(() => {
        if (!loadingListarGrupo &&
            dataListarGrupo &&
            dataListarGrupo.ListadoGruposFamiliaresSinUsuario) {
            return dataListarGrupo.ListadoGruposFamiliaresSinUsuario
        }
        return null
    }, [dataListarGrupo, loadingListarGrupo])


    const [mutate] = useAsignacionUsuarioMutate();

    const onCloseModal = async () => {
        await refetchListadoUsuario();
        await refetchListadoUsuarioSinGrupo();
        await refetchUsuariosSinFamiliares();
        setOpenModalMsj(false);
        onClose();
    }


    const onSubmit = async () => {
        try {
            if (dataUsuario && idGrupoSeleccionado) {
                setLoadingMutate(true)
                const { data } = await mutate({
                    variables: {
                        idGrupoFamiliar: idGrupoSeleccionado,
                        idUsuario: dataUsuario.id
                    }
                })

                if (
                    isNotNilOrEmpty(data)
                ) {
                    const { code, message } = data.AsignacionUsuario
                    setTitleModalMsj(message);
                    if (code === 200) {
                        setLoadingMutate(false)
                        setErrorModal(false)

                    } else {
                        setErrorModal(true)
                    }
                    setOpenModalMsj(true)
                }
            }
        } catch (error) {
            console.log("Error: ", (error as Error).message);
            setLoadingMutate(false)
            setTitleModalMsj('Envio Fallido')
            setErrorModal(true)
        }
    }



    return (
        <>
            {openModalMsj && (
                <ModalAuth
                    openModal={openModalMsj}
                    //  setOpenModal={setOpenModalMsj}
                    onClose={() => { onCloseModal() }}
                    title={titleModalMsj}
                    message={mensajeModalMsj}
                    error={errorModal}
                />
            )}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={onClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}

            >
                <Fade in={open}>
                    <>
                        <Paper className={classes.paper}>
                            <div className={classes.containerTitle}>
                                <Typography
                                    className={
                                        classes.titleInfo
                                    }
                                    variant="subtitle1"
                                >
                                    Asignación de Usuario
                                </Typography>
                            </div>
                            <Box mt={2} style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column"
                            }}>

                                <div
                                    style={{
                                        overflow: "auto",
                                        marginTop: "6%",
                                        marginBottom: "6%",


                                    }}>
                                    {dataUsuario
                                        && (
                                            <TableContainer component={Paper} style={{
                                                // marginRight: "3%",
                                                // marginLeft: "3%",
                                                // margin: "5%",
                                                //  backgroundColor: "red",
                                                width: "100%",

                                            }}>
                                                <Table >
                                                    <TableHead>
                                                        <TableRow style={{
                                                            backgroundColor: COLOR_PRIMARIO,

                                                        }}>
                                                            <TableCell style={{
                                                                color: "white"
                                                            }}>Identificación</TableCell>
                                                            <TableCell style={{
                                                                color: "white"
                                                            }} align="right">Grupo Familiar</TableCell>

                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>

                                                        <TableRow
                                                        >
                                                            <TableCell>  {dataUsuario.num_identificacion}</TableCell>
                                                            <TableCell align="right">{dataUsuario.nombres} {dataUsuario.apellidos}</TableCell>

                                                        </TableRow>

                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        )

                                    }
                                </div>


                                <Grid container spacing={4}>
                                    <Grid item >
                                        <FormControl variant="filled"
                                            style={{
                                                width: "65%",
                                                minWidth: 240

                                            }}>
                                            <InputLabel id={'grupo_familiar_label'} style={{ fontSize: '12px' }}>
                                                Grupos Familiares
                                            </InputLabel>

                                            <Select onChange={(e) => { setIdGrupoSeleccionado(Number(e.target.value)) }} labelId="grupo_familiar_label" name="grupo_familiar">
                                                {
                                                    dataListadoGrupoFamiliar
                                                    &&
                                                    dataListadoGrupoFamiliar.map(({ id, nombre_familiar }) =>
                                                    (<MenuItem key={id} value={id}>
                                                        {
                                                            nombre_familiar
                                                        }
                                                    </MenuItem>)
                                                    )
                                                }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item style={{
                                        //  backgroundColor: "red",
                                        marginTop: "6%",

                                    }}>
                                        <LoadingButton
                                            loading={loadingMutate}
                                            loadingPosition="start"
                                            type="submit"
                                            variant="text"
                                            startIcon={<SupervisedUserCircle />}
                                            style={{

                                            }}
                                            onClick={onSubmit}
                                        >
                                            Asignar
                                        </LoadingButton>
                                    </Grid>
                                </Grid>

                                {/* <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    width: "100%",
                                    alignItems: "flex-start",
                                    // justifyContent: "center",
                                    // backgroundColor: "red",
                                    justifyContent: "space-between"
                                }}>
                                    <FormControl variant="filled"
                                        style={{
                                            width: "65%",
                                            minWidth: 240

                                        }}>
                                        <InputLabel id={'grupo_familiar_label'} style={{ fontSize: '12px' }}>
                                            Grupos Familiares
                                        </InputLabel>

                                        <Select onChange={(e) => { setIdGrupoSeleccionado(Number(e.target.value)) }} labelId="grupo_familiar_label" name="grupo_familiar">
                                            {
                                                dataListadoGrupoFamiliar
                                                &&
                                                dataListadoGrupoFamiliar.map(({ id, nombre_familiar }) =>
                                                (<MenuItem key={id} value={id}>
                                                    {
                                                        nombre_familiar
                                                    }
                                                </MenuItem>)
                                                )
                                            }
                                        </Select>
                                    </FormControl>

                                    <LoadingButton
                                        loading={loadingMutate}
                                        loadingPosition="start"
                                        type="submit"
                                        variant="text"
                                        startIcon={<SaveIcon />}
                                        style={{
                                            marginTop: "3%",
                                            marginLeft: "2%"
                                        }}
                                        onClick={onSubmit}
                                    >
                                        Asignar
                                    </LoadingButton>
                                </div> */}

                            </Box>

                        </Paper>
                    </>
                </Fade>
            </Modal>
        </>
    )
}


export default ModalVinculacionUsuario