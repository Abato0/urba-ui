import { TipoUsuario } from "../../../components/core/input/dateSelect"
import { IngresarImagenBienvenida } from "../../../components/imagenes-de-bienvenida/imagen-bienvenida-form"
import PermisoLayout from "../../../components/layout/auth-layout/permiso-layout"
import LayoutTituloPagina from "../../../components/layout/tituloPagina-layout"
import {
    Box,
    colors,
    createStyles,
    FormControl,
    InputLabel,
    makeStyles,
    MenuItem,
    Paper,
    Select,
    Table,
    TableContainer,
    TextField,
    Tooltip,
} from '@material-ui/core'
import { useCallback, useEffect, useMemo, useState } from "react"
import { IResultQueryImagenesSitio, useListadoImagenesBienvenidaQuery, useDeleteImagenBienvenidaMutation } from '../../../components/imagenes-de-bienvenida/use-imagenes-bienvenida';
import { prop } from "ramda"
import { usePagination, useTable } from "react-table"
import { headImagen } from "../../../components/imagenes-de-bienvenida/imagen-bienvenida-dataTable"
import TablePaginations from "../../../components/table/table-paginations"
import CardTableBody from "../../../components/table/table-body"
import TableHeader from "../../../components/table/table-header"
import { data } from '../../../components/core/dashboard/dashboardPrueba';
import ModalAuth from "../../../components/core/input/dialog/modal-dialog"
import ModalImagen from "../../../components/core/input/dialog/modal-ver-imagen"
import FormControlHeader from "../../../components/core/input/form-control-select"
import { Listado_lugares_image } from "../../../utils/keys"
import { ActionsButtonsFilterReset } from "../../../components/core/actions/actionsButtonsFilterReset"


const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            borderRadius: '12px',
            // margin: '30px',
            maxWidth: "800px",
            width: '85%',
        },
        contentButtons: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            // alignContent: "center",
            alignItems: 'center',
            width: '100%',
            padding: theme.spacing(2),
            marginTop: theme.spacing(2),
        },
        button: {
            marginTop: theme.spacing(1),
            color: 'white',
            margin: theme.spacing(1),
            // height: "50%",
            backgroundColor: colors.blueGrey[900],
            '&:hover': {
                backgroundColor: colors.blueGrey[800],
            },
            minWidth: theme.spacing(14),
            // height: theme.spacing(12),
            padding: theme.spacing(3),
            maxHeight: theme.spacing(1),
        },
        textBox: {
            backgroundColor: '',
            width: theme.spacing(40),
            marginTop: theme.spacing(2),
        },
        contenFilter: {
            backgroundColor: colors.grey[50],
            marginBottom: theme.spacing(5),
            marginTop: theme.spacing(2),
            // display: "flex",
            // alignItems: "center",
            // justifyContent: "center",
        },
        contentForm: {
            marginTop: theme.spacing(3),
        },
        formControl: {
            // margin: theme.spacing(1),
            minWidth: 220,
            marginTop: theme.spacing(2)
            // textAlign: "center"
        },
        labelButton: {
            fontSize: theme.typography.pxToRem(11),
            fontFamily: 'Roboto',
        },
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        image: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: theme.spacing(3),
        },
        containerTitle: {
            // backgroundColor: "red",
            display: 'flex',
            justifyContent: 'center',
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(1),
        },
        title: {
            fontSize: theme.typography.pxToRem(19),
            backgroundColor: colors.grey[200],
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
            borderRadius: 5,
            // fontWeight: "bold",
            // font
        },
        paperFilter: {
            width: '85%',
            borderRadius: 8,
        },
    })
)





const idTable = 'idListadoImagenesTable'
const titlePdf = 'Listado de Vehiculos por Familia'
const columnsPdf = [
    'Nombre Familiar',
    'Tipo Vehiculo',
    'Placa',
    'Marca',
    'Color',
    'Modelo',
]

const getRowId: any = prop('id')

const ListadoImagenes = () => {

    const classes = useStyles();
    const [search, setSearch] = useState<string>('')
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('');
    const [errorModal, setErrorModal] = useState<boolean>(false);

    const [imagenesFilter, setImagenesFilter] = useState<IResultQueryImagenesSitio[]>([])
    const { data, loading, refetch } = useListadoImagenesBienvenidaQuery();

    const [mutate] = useDeleteImagenBienvenidaMutation();


    const [imagenSeleccionada, setImagenSeleccionada] = useState("")
    const [openModalImagen, setOpenModalImagen] = useState(false)

    const [lugarSeleccionado, setLugarSeleccionado] = useState<string>()



    const onSee = ({ id, urlImagen }: IResultQueryImagenesSitio) => {
        if (id) {
            console.log('image', urlImagen);
            setImagenSeleccionada(urlImagen)
            // setBase64(null);
            // setIdPago(id)
            setOpenModalImagen(true)
        }
    }


    const onDelete = async ({ id }: IResultQueryImagenesSitio) => {
        try {
            const { data } = await mutate({
                variables: {
                    id
                }
            })
            if (data) {
                const { code, message } = data.DeleteImagenSitio;

                setTitleModalMsj(message);
                if (code === 200) {
                    await refetch();
                    setErrorModal(false)
                } else {
                    setErrorModal(true)
                }
                setOpenModalMsj(true)
            } else {
                setOpenModalMsj(true)
                setErrorModal(false)
                setTitleModalMsj('Usuario no autorizado')
            }
        } catch (error) {
            // setLoadingMutate(false)
            console.log('error.;', error)
            setTitleModalMsj('Envio Fallido')
            setErrorModal(true)
            // setMensajeModalMsj(
            //     'El modelo no ha sido guardado: ' + error.message
            // )
            setOpenModalMsj(true)
        }

    }
    const dataImagenes = useMemo(() => {
        if (!loading && data) {
            return data.ListaImagenesSitio
        }
    }, [data, loading])

    useEffect(() => {
        if (dataImagenes) {
            setImagenesFilter(dataImagenes)
        }

    }, [dataImagenes])




    const {
        getTableProps,
        getTableBodyProps,
        gotoPage,
        headerGroups,
        page,
        prepareRow,
        setPageSize,
        state: {
            pageIndex,
            pageSize,
            // , selectedRowIds
        },
    } = useTable(
        {
            columns: headImagen,
            data: imagenesFilter,
            getRowId,
            onDelete,
            onSee
            // onEdit,
            // onDescargar,
        },
        usePagination
    )

    const onChangePage = useCallback(
        (event, page) => gotoPage(page),
        [gotoPage]
    )

    const onChangeRowsPerPage = useCallback(
        (event, rowsPerPage) => setPageSize(rowsPerPage.props.value), [setPageSize]
    )


    const filtrar = () => {

        if (lugarSeleccionado && dataImagenes) {
            const result = dataImagenes.filter(({ lugar }) => lugar === lugarSeleccionado);
            setImagenesFilter(result)
        }
    }

    const reset = () => {
        if (dataImagenes) {
            setLugarSeleccionado(undefined);
            setImagenesFilter(dataImagenes)
        }
    }



    return (<LayoutTituloPagina titulo="Parametrizacion - Imagenes de Bienvenida">
        <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
            {openModalMsj && (
                <ModalAuth
                    openModal={openModalMsj}
                    onClose={() => { setImagenSeleccionada(""), setOpenModalMsj(false) }}
                    // setOpenModal={setOpenModalMsj}
                    title={titleModalMsj}
                    message={mensajeModalMsj}
                    error={errorModal}
                />
            )}

            <ModalImagen
                open={openModalImagen}
                handleClose={() => setOpenModalImagen(false)}
                base64={imagenSeleccionada}
                classes={classes}
            />
            <Box>
                <IngresarImagenBienvenida />
            </Box>
            <Box className={classes.root}>
                <Paper style={{ borderRadius: '12px' }}>
                    <div className={classes.contentButtons}>
                        <TextField
                            className={classes.textBox}
                            variant="outlined"
                            placeholder="Search"
                            onChange={(e) => {
                                setSearch(e.target.value)
                            }}
                            value={search}
                        />
                        <FormControl variant="filled" className={classes.formControl}>
                            <InputLabel id={"lugar_seleccionado_label"} style={{ fontSize: '12px' }}>
                                Lugar
                            </InputLabel>
                            <Select
                                labelId={'lugar_seleccionado_label'}
                                value={lugarSeleccionado}
                                onChange={(e) => setLugarSeleccionado(e.target.value as string)}

                            >
                                {
                                    Listado_lugares_image.map(({ label, value }) => {
                                        return (
                                            <MenuItem key={value} value={value}>
                                                {label}
                                            </MenuItem>)
                                    })
                                }
                            </Select>
                        </FormControl>

                        <ActionsButtonsFilterReset
                            filtrar={filtrar}
                            reset={reset}
                        />
                        {/* <ActionsButtonsExcelPdf
                            ExportExcel={ExportExcel}
                            columnsPdf={columnsPdf}
                            idTable={idTable}
                            orientacion={"landscape"}
                            titlePdf={titlePdf}
                        /> */}
                    </div>
                    <TableContainer>
                        <Table
                            // className={classes.table}
                            stickyHeader
                            aria-label="sticky table"
                            {...getTableProps()}
                            id={idTable}
                        >
                            <TableHeader headerGroups={headerGroups} />
                            <CardTableBody
                                getTableBodyProps={getTableBodyProps}
                                page={page}
                                prepareRow={prepareRow}
                            />
                        </Table>
                    </TableContainer>
                    <TablePaginations
                        lengthData={imagenesFilter.length}
                        onChangePage={onChangePage}
                        onChangeRowsPerPage={onChangeRowsPerPage}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                    />
                </Paper>
            </Box>
        </PermisoLayout>

    </LayoutTituloPagina>)
}

export default ListadoImagenes