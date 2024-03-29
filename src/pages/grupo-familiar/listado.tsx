import React, { useCallback, useEffect, useState } from 'react'
import {
    useListarGrupoFamiliar,
    useDeleteGrupoFamiliarMutatio,
    useListarGrupoFamiliarFilterQuery,
    IListaGruposFamiliaresFilter,
    IGrupoFamiliarFilterInput,
} from '../../components/grupo-familiar/use-grupo-familia'
// import AppLayout from '../../components/layout/app-layout'
//import { head, rows } from "../../components/core/input/data";
// import DataTable from "../../components/table/dataTable";
import { head } from '../../components/grupo-familiar/grupo-familiar-dataTable'
// import { Fade, LinearProgress, Tooltip } from '@material-ui/core';
import { isNil, isEmpty, prop, pluck, omit, map, equals } from 'ramda'
import { IGrupoFamiliar } from '../../interface/grupo-familiar.interface'
import Fuse from 'fuse.js'
import { useRouter } from 'next/router'
import useDebounce from '../../utils/useDebounce'
import CardTable from '../../components/table/card-table'
import ModalAuth from '../../components/core/input/dialog/modal-dialog'
import XLSX from 'xlsx'
import { isNotNilOrEmpty } from '../../utils/is-nil-empty'
// import { IIntegranteFilterInput } from '../../components/integrante/use-intergrante'
import {
    colors,
    makeStyles,
    MenuItem,
    createStyles,
    FormControl,
    InputLabel,
    Select,
    Paper,
} from '@material-ui/core'
import { useListaCallesQuery } from '../../components/mantenimento/calle/use-calle'
import { useListaManzanaQuery } from '../../components/mantenimento/manzana/use-manzana'
import LayoutTituloPagina from '../../components/layout/tituloPagina-layout'
import { ActionsButtonsFilterReset } from '../../components/core/actions/actionsButtonsFilterReset'
import { getFormatoGrupoFamiliar } from '../../utils/keys'

const getRowId: any = prop('id')

const optionsFuse: Fuse.IFuseOptions<IGrupoFamiliarNormalize> = {
    keys: ['nombre_familiar', 'calle_principal', 'calle_interseccion'],
}

export interface IGrupoFamiliarNormalize {
    id?: number
    nombre_familiar: string
    // tipo_edificacion: string;
    // color_fachada: string;
    calle_principal: string
    calle_interseccion: string
    manzana: string
    villa: string
}

const extractData = (data: IGrupoFamiliar[]): IGrupoFamiliarNormalize[] => {
    return !isNil(data)
        ? data.map(
              ({
                  calle_interseccion,
                  calle_principal,
                  // color_fachada,
                  manzana,
                  // tipo_edificacion,
                  nombre_familiar,
                  villa,
                  extension,
                  id,
                  usuario,
              }) => {
                  return {
                      id,
                      calle_interseccion: isNil(calle_interseccion)
                          ? ''
                          : calle_interseccion,
                      calle_principal: isNil(calle_principal)
                          ? ''
                          : calle_principal.calle,
                      // color_fachada: isNil(color_fachada) ? "" : color_fachada.color,
                      manzana: isNil(manzana) ? '' : manzana.manzana,
                      // tipo_edificacion: isNil(tipo_edificacion)
                      //   ? ""
                      //   : tipo_edificacion.tipo_edificacion ?? "",
                      villa:
                          isNil(villa) && isEmpty(extension)
                              ? ''
                              : extension && !isEmpty(extension)
                              ? `${villa}-${extension}`
                              : `${villa}`,
                      nombre_familiar: getFormatoGrupoFamiliar({
                          calle_interseccion,
                          calle_principal,
                          extension,
                          manzana,
                          nombre_familiar,
                          villa,
                          usuario,
                          id,
                      }),
                  }
              }
          )
        : []
}

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            borderRadius: '12px',
            margin: '30px',
        },
        contentButtons: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            // alignContent: "center",
            alignItems: 'center',
            width: '100%',
            // padding: theme.spacing(2),
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
            marginBottom: theme.spacing(2),
            marginTop: theme.spacing(2),

            // display: "flex",
            // alignItems: "center",
            // justifyContent: "center",
        },
        contentForm: {
            marginTop: theme.spacing(3),
        },
        labelButton: {
            fontSize: theme.typography.pxToRem(11),
            fontFamily: 'Roboto',
        },
        paperFilter: {
            width: '80%',
            borderRadius: 8,
        },
    })
)

const ListadoGrupoFamiliar = () => {
    const classes = useStyles()

    const [dataTable, setDataTable] = React.useState<IGrupoFamiliarNormalize[]>(
        []
    )
    const [search, setSearch] = React.useState<string>('')
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const router = useRouter()
    const debounceSearch = useDebounce(search, 300)
    const [mutate] = useDeleteGrupoFamiliarMutatio(0)

    const [inputFilter, setInputFilter] = useState<IGrupoFamiliarFilterInput>(
        {}
    )
    const [callePrincipalFilter, setCallePrincipalFilter] = useState<string>('')
    const [manzanaFilter, setManzanaFilter] = useState<string>('')

    const { data, loading, error } =
        useListarGrupoFamiliarFilterQuery(inputFilter)

    const {
        data: dataListadoManzana,
        loading: loadingListadoManzana,
        error: errorListadoManzana,
    } = useListaManzanaQuery()

    const {
        data: dataListadoCalles,
        loading: loadingListadoCalles,
        error: errorListadoCalles,
    } = useListaCallesQuery()

    const fuse = React.useMemo(() => {
        if (!loading && !isEmpty(data) && !isNil(data)) {
            const myIndex = Fuse.createIndex(
                optionsFuse.keys!,
                extractData(data.ListaGruposFamiliaresFilter)
            )
            return new Fuse(
                extractData(data.ListaGruposFamiliaresFilter),
                optionsFuse,
                myIndex
            )
        }
    }, [data, loading])

    React.useEffect(() => {
        if (
            !isEmpty(debounceSearch) &&
            !isNil(debounceSearch) &&
            !isNil(fuse)
        ) {
            const result = pluck('item', fuse.search(String(debounceSearch)))
            // console.log("result:", fuse.search(String(debounceSearch)));
            setDataTable(result)
        } else {
            if (!loading && !isNil(data)) {
                setDataTable(extractData(data.ListaGruposFamiliaresFilter))
            } else {
                setDataTable([])
            }
        }
    }, [data, debounceSearch, fuse, loading])

    React.useEffect(() => {
        if (!loading && !isNil(data)) {
            setDataTable(extractData(data.ListaGruposFamiliaresFilter))
            // console.log("extractData: ", extractData(data!));
            // console.log("datas: ", data);
        }
    }, [loading, data])

    const onEdit = ({ id }: any) => {
        console.log('id:', id)
        // Navigate to corresponding filing wizard page to resume filing draft
        if (!isNil(id)) {
            router.push(
                { pathname: '/grupo-familiar/registrar/[id]' },
                `/grupo-familiar/registrar/${encodeURIComponent(id)}`
            )
        }
    }

    const onDelete = async ({ id }: any) => {
        try {
            // await mutate({ variables: { id: Number(id) } })
            // setTitleModalMsj('Grupo Familiar Eliminado')
            // setMensajeModalMsj(
            //     'El Grupo Familiar seleccionado se ha eliminado correctamente'
            // )
            // setOpenModalMsj(true)
            // setDataTable(extractData(data?.ListaGruposFamiliaresFilter!));
            const { data } = await mutate({
                variables: {
                    id,
                },
            })
            if (data) {
                const { code, message } = data.DeleteGrupoFamiliar
                setTitleModalMsj(message)

                if (code === 200) {
                    setErrorModal(false)
                } else {
                    setErrorModal(true)
                }
                // await refetch()
                setOpenModalMsj(true)
            } else {
                setTitleModalMsj('Usuario no autorizado')
                setErrorModal(true)
                setOpenModalMsj(true)
            }
        } catch (error) {
            setTitleModalMsj('Envio Fallido')
            setErrorModal(true)
            setMensajeModalMsj('' + (error as Error).message)
            setOpenModalMsj(true)
        }

        // console.log("data onDelete:", data, error);
    }

    const ExportExcel = () => {
        if (isNotNilOrEmpty(dataTable)) {
            const newCampos = dataTable.map(
                ({
                    id,
                    nombre_familiar,
                    calle_interseccion,
                    calle_principal,
                    manzana,
                    villa,
                }) => {
                    return {
                        id,
                        GrupoFamiliar: String(nombre_familiar).toUpperCase(),
                        CallePrincipal: String(calle_principal).toUpperCase(),
                        CalleInterseccion:
                            String(calle_interseccion).toUpperCase(),
                        Manzana: String(manzana).toUpperCase(),
                        Villa: String(villa).toUpperCase(),
                    }
                }
            )

            const workSheet = XLSX.utils.json_to_sheet(newCampos)
            workSheet.A1.v = 'ID'
            workSheet.B1.v = 'Grupo Familiar'
            workSheet.C1.v = 'Calle Principal'
            workSheet.D1.v = 'Calle Intersección'

            const workBook = XLSX.utils.book_new()

            XLSX.utils.book_append_sheet(
                workBook,
                workSheet,
                'Grupos Familiares'
            )
            XLSX.write(workBook, { bookType: 'xlsx', type: 'binary' })
            XLSX.writeFile(workBook, 'Listado de Grupos Familiares.xlsx')
        }
    }

    const filtrar = useCallback(() => {
        setInputFilter({
            calle_principal: isEmpty(callePrincipalFilter)
                ? undefined
                : callePrincipalFilter,
            manzana: isEmpty(manzanaFilter) ? undefined : manzanaFilter,
        })
    }, [callePrincipalFilter, manzanaFilter])

    const reset = useCallback(() => {
        setCallePrincipalFilter('')
        setManzanaFilter('')
        setInputFilter({})
    }, [])

    return (
        <LayoutTituloPagina titulo="Grupos Familiares - Listado">
            {!loading && (
                <>
                    {openModalMsj && (
                        <ModalAuth
                            openModal={openModalMsj}
                            onClose={() => setOpenModalMsj(false)}
                            title={titleModalMsj}
                            message={mensajeModalMsj}
                            error={errorModal}
                        />
                    )}
                    {}
                    <Paper className={classes.paperFilter}>
                        <div className={classes.contenFilter}>
                            <div className={classes.contentButtons}>
                                <div className={classes.contentForm}>
                                    <FormControl
                                        variant="filled"
                                        className={classes.formControl}
                                    >
                                        <InputLabel id="callerPrincipal_label">
                                            Calle Principal
                                        </InputLabel>
                                        <Select
                                            className={classes.selectFilter}
                                            labelId="callerPrincipal_label"
                                            value={callePrincipalFilter}
                                            onChange={(e) =>
                                                setCallePrincipalFilter(
                                                    e.target.value as string
                                                )
                                            }
                                        >
                                            <MenuItem
                                                style={{
                                                    textTransform: 'uppercase',
                                                }}
                                                value={''}
                                            >
                                                {' '}
                                                - Todos -{' '}
                                            </MenuItem>
                                            {!loadingListadoCalles &&
                                                !isNil(dataListadoCalles) &&
                                                dataListadoCalles.ListaCalle.map(
                                                    ({ id, calle }) => {
                                                        return (
                                                            <MenuItem
                                                                key={
                                                                    'integranteListado' +
                                                                    calle
                                                                }
                                                                style={{
                                                                    textTransform:
                                                                        'uppercase',
                                                                }}
                                                                value={calle}
                                                            >
                                                                {calle}
                                                            </MenuItem>
                                                        )
                                                    }
                                                )}
                                        </Select>
                                    </FormControl>

                                    <FormControl
                                        variant="filled"
                                        className={classes.formControl}
                                    >
                                        <InputLabel id="manzana_label">
                                            Manzana
                                        </InputLabel>
                                        <Select
                                            className={classes.selectFilter}
                                            labelId="manzana_label"
                                            value={manzanaFilter}
                                            onChange={(e) =>
                                                setManzanaFilter(
                                                    e.target.value as string
                                                )
                                            }
                                        >
                                            <MenuItem
                                                style={{
                                                    textTransform: 'uppercase',
                                                }}
                                                value={''}
                                            >
                                                {' '}
                                                - Todos -{' '}
                                            </MenuItem>
                                            {!loadingListadoManzana &&
                                                !isNil(dataListadoManzana) &&
                                                dataListadoManzana.ListaManzana.map(
                                                    ({ manzana }) => {
                                                        return (
                                                            <MenuItem
                                                                key={
                                                                    'integranteListado' +
                                                                    manzana
                                                                }
                                                                value={manzana}
                                                                style={{
                                                                    textTransform:
                                                                        'uppercase',
                                                                }}
                                                            >
                                                                {manzana}
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
                        columns={head}
                        dataTable={dataTable}
                        ExportExcel={ExportExcel}
                        getRowId={getRowId}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        idTable={'listadoGrupoFamiliarTable'}
                        titlePdf={'Listado de Grupos Familiares'}
                        columnsPdf={[
                            'Nombre Familiar',
                            'Tipo de edificacion',
                            'Color',
                            'Calle Principal',
                            'Calle Interseccion',
                            'Manzana',
                            'Villa',
                        ]}
                        search={search}
                        setSearch={setSearch}
                        lengthData={
                            !isNil(data)
                                ? extractData(data.ListaGruposFamiliaresFilter)
                                      .length
                                : 0
                        }
                    ></CardTable>
                </>
            )}
        </LayoutTituloPagina>
    )
}

// ListadoGrupoFamiliar.getLayout = function getLayout(page: React.ReactElement) {
//   return (
//     <>
//       {page}
//     </>
//   );
// };

export default ListadoGrupoFamiliar
