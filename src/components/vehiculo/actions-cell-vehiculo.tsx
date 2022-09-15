import { Button, IconButton, Tooltip } from '@material-ui/core'
import React, { useMemo, useState } from 'react'
import { Row } from 'react-table'
import { useRecoilValue } from 'recoil'
import { userInfo } from '../../utils/states'
import { TipoUsuario } from '../core/input/dateSelect'
import {
    FileEdit as FileEditIcon,
    TrashCan as TrashIcon,
    EyeCircle,
} from 'mdi-material-ui'
import { ModalConfirmacion } from '../core/modal/modalConfirmacion'
interface IProps {
    className?: string
    onEdit: any
    onDescargar: any
    onDelete: any
    row: Row
}

const ActionsCellVehiculo: React.FC<IProps> = ({
    onEdit,
    onDescargar,
    onDelete,
    row,
    className,
}) => {
    const usuarioState = useRecoilValue(userInfo)
    const [openModalConfirmacion, setOpenModalConfirmacion] = useState(false)

    const moradorFlag = useMemo(() => {
        if (usuarioState) {
            return usuarioState.tipo_usuario === TipoUsuario.MORADOR
        }
        return false
    }, [usuarioState])

    // const administradorFlag = useMemo(() => {
    //     if (usuarioState) {
    //         return usuarioState.tipo_usuario === TipoUsuario.ADMIN
    //     }
    //     return false
    // }, [usuarioState])
    return (
        <>
            <ModalConfirmacion
                openModal={openModalConfirmacion}
                onConfirm={() => {
                    setOpenModalConfirmacion(false)
                    onDelete(row.original)
                }}
                mensaje="¿Está seguro de eliminar el registro seleccionado?"
                onCancel={() => setOpenModalConfirmacion(false)}
            />
            <>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {!moradorFlag && (
                        <Tooltip className={className} title={'Editar'}>
                            <IconButton
                                // variant="text"
                                // color="secondary"
                                onClick={() => onEdit(row.original)}
                            >
                                <FileEditIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                    )}

                    <Tooltip className={className} title={'Visualizar'}>
                        <IconButton
                            // variant="text"
                            // color="secondary"
                            onClick={() => onDescargar(row.original)}
                        >
                            <EyeCircle color="primary" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip className={className} title={'Eliminar'}>
                        <IconButton
                            // variant="text"
                            // color="secondary"
                            onClick={() => setOpenModalConfirmacion(true)}
                        >
                            <TrashIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                    {/* <Button
                        variant="text"
                        color="secondary"
                        onClick={() => onDescargar(row.original)}
                    >
                        Visualizar
                    </Button> */}
                </div>
            </>
        </>
    )
}

export default ActionsCellVehiculo
