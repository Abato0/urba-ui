import { useEffect, useMemo, useState, useCallback } from 'react'
import ModalAuth from '../../components/core/input/dialog/modal-dialog'
import {
    IIntegranteFilterInput,
    IIntegranteVariables,
    IListaIntegranteFilterQuery,
    useListaIntergranteFilterQuery,
} from '../../components/integrante/use-intergrante'
import CardTable from '../../components/table/card-table'
import { isNilOrEmpty, isNotNilOrEmpty } from '../../utils/is-nil-empty'
import useDebounce from '../../utils/useDebounce'
import Fuse from 'fuse.js'
import XLSX from 'xlsx'
import { equals, is, isEmpty, isNil, omit, pluck, prop } from 'ramda'
import { headIntegranteTable } from '../../components/integrante/integrante-dataTable'
import {
    colors,
    Divider,
    makeStyles,
    createStyles,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@material-ui/core'
import { useListarGrupoFamiliar } from '../../components/grupo-familiar/use-grupo-familia'
import { useRouter } from 'next/router'
import { Paper } from '@material-ui/core'
import LayoutTituloPagina from '../../components/layout/tituloPagina-layout'
import { ActionsButtonsFilterReset } from '../../components/core/actions/actionsButtonsFilterReset'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            borderRadius: '12px',
        },
        contentButtons: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            padding: theme.spacing(2),
            // marginTop: theme.spacing(1),
        },
        button: {
            marginTop: theme.spacing(1),
            color: 'white',
            margin: theme.spacing(1),
            height: '50%',
            backgroundColor: colors.blueGrey[900],
            '&:hover': {
                backgroundColor: colors.blueGrey[800],
            },
            width: theme.spacing(2),
        },
        textBox: {
            backgroundColor: '',
        },
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        row: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            // paddingTop: theme.spacing(6),
            // paddingBottom: theme.spacing(6),
        },
        selectFilter: {
            // padding: theme.spacing(2),
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 220,
            // textAlign: "center"
        },
        image: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: theme.spacing(3),
        },
        contenFilter: {
            // backgroundColor: colors.grey[50],
            // marginBottom: theme.spacing(5),
            // marginTop: theme.spacing(2),
            // display: "flex",
            // alignItems: "center",
            // justifyContent: "center",
        },
        contentForm: {
            marginTop: theme.spacing(3),
        },
        paperFilter: {
            width: '80%',
            borderRadius: 8,
        },
    })
)

const extractData = (
    data: IListaIntegranteFilterQuery
): IIntegranteVariablesNormalize[] => {
    return isNotNilOrEmpty(data)
        ? VariablesNormalizeIntegrantes(data.ListaIntegranteFilter)
        : []
}

const VariablesNormalizeIntegrantes = (data: IIntegranteVariables[]) => {
    return isNotNilOrEmpty(data)
        ? data.map(
            ({ grupoFamiliar, parentesco, tipoIdentificacion, ...input }) => {
                return omit(['__typename'], {
                    ...input,
                    nombre_familiar: grupoFamiliar.nombre_familiar,
                    parentesco: parentesco.parentesco,
                    tipo_doc_identidad:
                        tipoIdentificacion.tipo_identificacion ?? '',
                    // manzana: grupoFamiliar.manzana,
                    // calle_principal: grupoFamiliar.calle_principal,
                    // calle_interseccion: grupoFamiliar.calle_interseccion,
                    // villa: grupoFamiliar.villa,
                })
            }
        )
        : []
}

export interface IIntegranteVariablesNormalize {
    id: number
    tipo_doc_identidad: string
    num_doc_identidad: string
    nombre: string
    apellido: string
    telefono: string
    email: string
    genero: string
    fecha_nacimiento: string
    parentesco: string
    representante: string
    // piso_ocupa: string;
    // status: string;

    nombre_familiar: string
    // calle_principal: string;
    // calle_interseccion: string;
    // manzana: string;
    // villa: string;
}

const optionsFuse: Fuse.IFuseOptions<any> = {
    keys: ['cedula', 'nombre', 'apellido'],
}
const getRowId: any = prop('id')

const ListadoIntegrante = () => {
    const classes = useStyles()
    const router = useRouter()

    const [dataTable, setDataTable] = useState<IIntegranteVariablesNormalize[]>(
        []
    )
    const [search, setSearch] = useState<string>('')
    const debounceSearch = useDebounce(search, 300)
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [inputFilter, setInputFilter] = useState<IIntegranteFilterInput>({})

    const {
        data: dataListadoGrupoFamiliar,
        loading: loadingListadoGrupoFamiliar,
        error: errorListadoGrupoFamiliar,
    } = useListarGrupoFamiliar()

    const { data, loading, error } = useListaIntergranteFilterQuery(inputFilter)

    const [idGrupoFamiliarFilter, setIdGrupoFamiliarFilter] = useState<
        number | undefined
    >()
    const [callePrincipalFilter, setCallePrincipalFilter] = useState<string>('')
    const [cllInterseccionFilter, setClleInterseccionFilter] =
        useState<string>('')
    const [manzanaFilter, setManzanaFilter] = useState<string>('')

    useEffect(() => {
        if (!loading && !isNil(data) && isNil(error)) {
            setDataTable(extractData(data!))
        }
    }, [loading, data, error])

    const fuse = useMemo(() => {
        if (isNotNilOrEmpty(data)) {
            const myIndex = Fuse.createIndex(
                optionsFuse.keys!,
                extractData(data!)
            )
            return new Fuse(extractData(data!), optionsFuse, myIndex)
        }
    }, [data])

    useEffect(() => {
        if (isNotNilOrEmpty(debounceSearch) && !isNil(fuse)) {
            const result = pluck('item', fuse.search(String(debounceSearch)))

            setDataTable(result)
        } else {
            setDataTable(extractData(data!))
        }
    }, [data, debounceSearch, fuse])

    const onEdit = ({ id }: any) => {
        if (!isNil(id)) {
            router.push(
                { pathname: '/integrante/ingresar/[id]' },
                `/integrante/ingresar/${encodeURIComponent(id)}`
            )
        }
    }

    const onDelete = async ({ id }: any) => { }

    const ExportExcel = useCallback(() => {
        if (isNotNilOrEmpty(dataTable)) {
            const newCampos = dataTable.map(
                ({
                    apellido,
                    email,
                    fecha_nacimiento,
                    genero,
                    nombre,
                    nombre_familiar,
                    num_doc_identidad,
                    parentesco,
                    representante,
                    telefono,
                    tipo_doc_identidad,
                }) => {
                    return {
                        GrupoFamiliar: nombre_familiar,
                        Nombre: nombre,
                        Apellido: apellido,
                        TipoDocIdentidad: tipo_doc_identidad,
                        NumIdentidad: num_doc_identidad,
                        FechaNacimiento: fecha_nacimiento,
                        Genero: genero,
                        Parentesco: parentesco,
                        Telefono: telefono,
                        Email: email,
                        Representante: representante,
                    }
                }
            )

            const workSheet = XLSX.utils.json_to_sheet(newCampos)
            workSheet.A1.v = 'Grupo Familiar'
            workSheet.D1.v = 'Tipo de documento de identidad'
            workSheet.E1.v = 'Numero de identificación'
            workSheet.F1.v = 'Fecha de nacimiento'

            const workBook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workBook, workSheet, 'Integrantes')
            XLSX.write(workBook, { bookType: 'xlsx', type: 'binary' })
            XLSX.writeFile(
                workBook,
                'Listado de Integrantes por Grupo Familiar.xlsx'
            )
        }
    }, [dataTable])

    const filtrar = useCallback(() => {
        setInputFilter({
            idGrupoFamiliar:
                equals(idGrupoFamiliarFilter, 0) || isNil(idGrupoFamiliarFilter)
                    ? undefined
                    : idGrupoFamiliarFilter,
            // calle_interseccion: isEmpty(cllInterseccionFilter)
            //   ? undefined
            //   : cllInterseccionFilter,

            // calle_principal: isEmpty(callePrincipalFilter)
            //   ? undefined
            //   : callePrincipalFilter,
            // manzana: isEmpty(manzanaFilter) ? undefined : manzanaFilter,
        })
    }, [idGrupoFamiliarFilter])

    const reset = useCallback(() => {
        setIdGrupoFamiliarFilter(undefined)
        setCallePrincipalFilter('')
        setClleInterseccionFilter('')
        setManzanaFilter('')
        setInputFilter({})
    }, [])

    return (
        <LayoutTituloPagina titulo="Integrante Familiar - Listado ">
            {!loading && (
                <>
                    {openModalMsj && (
                        <ModalAuth
                            openModal={openModalMsj}
                            setOpenModal={setOpenModalMsj}
                            title={titleModalMsj}
                            message={mensajeModalMsj}
                        />
                    )}
                    <Paper className={classes.paperFilter}>
                        <div className={classes.contenFilter}>
                            <div className={classes.contentButtons}>
                                <div className={classes.contentForm}>
                                    <FormControl
                                        variant="filled"
                                        className={classes.formControl}
                                    >
                                        <InputLabel id="idGrupoFamiliar_label">
                                            Grupo Familiar
                                        </InputLabel>
                                        <Select
                                            className={classes.selectFilter}
                                            labelId="idGrupoFamiliar_label"
                                            value={idGrupoFamiliarFilter}
                                            onChange={(e) =>
                                                setIdGrupoFamiliarFilter(
                                                    e.target.value as number
                                                )
                                            }
                                        >
                                            <MenuItem value={undefined}>
                                                {' '}
                                                - Todos -{' '}
                                            </MenuItem>
                                            {!loadingListadoGrupoFamiliar &&
                                                isNotNilOrEmpty(
                                                    dataListadoGrupoFamiliar
                                                ) &&
                                                dataListadoGrupoFamiliar?.ListaGruposFamiliares.map(
                                                    (
                                                        { id, nombre_familiar },
                                                        index
                                                    ) => {
                                                        return (
                                                            <MenuItem
                                                                key={index}
                                                                value={id}
                                                            >
                                                                {
                                                                    nombre_familiar
                                                                }
                                                            </MenuItem>
                                                        )
                                                    }
                                                )}
                                        </Select>
                                    </FormControl>
                                </div>
                                <ActionsButtonsFilterReset
                                    filtrar={filtrar}
                                    reset={reset}
                                />
                            </div>
                        </div>
                    </Paper>

                    <CardTable
                        columns={headIntegranteTable}
                        dataTable={dataTable}
                        ExportExcel={ExportExcel}
                        // data={data}

                        getRowId={getRowId}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        idTable={'integrantesTable'}
                        titlePdf={'Listado de Integrantes por Familias'}
                        columnsPdf={[
                            'Grupo Familiar',
                            'Nombre',
                            'Apellido',
                            'Tipo de identificación',
                            'Numero de Identificación',
                            'Genero',
                            'Fecha de Nacimiento',
                            'Telefono',
                            'Email',
                            'Parentesco',
                            'Representante',
                        ]}
                        search={search}
                        setSearch={setSearch}
                        lengthData={extractData(data!).length}
                        orientacion="landscape"
                    >
                        <Divider />
                        <Divider />
                    </CardTable>
                </>
            )}
        </LayoutTituloPagina>
    )
}

export default ListadoIntegrante
