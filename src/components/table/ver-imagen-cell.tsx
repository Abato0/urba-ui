import React, { useMemo, useState } from 'react'
import {
    Button,
    createStyles,
    Fab,
    IconButton,
    makeStyles,
    Theme,
    Tooltip,
} from '@material-ui/core'
import { Row } from 'react-table'

import { EyeCircle, TrashCan } from 'mdi-material-ui'
import { TipoUsuario } from '../core/input/dateSelect'
import { useRecoilValue } from 'recoil'
import { userInfo } from '../../utils/states'
import { ModalConfirmacion } from '../core/modal/modalConfirmacion'

interface IProps {
    className?: string
    onSeeImg: any
    row: Row
    onDelete: any
}
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fab: {
            // margin: theme.spacing(2),
        },
        absolute: {
            position: 'absolute',
            bottom: theme.spacing(2),
            right: theme.spacing(3),
        },
    })
)

const VisualizarActionsCell: React.FC<IProps> = ({
    onSeeImg,
    row,
    className,
    onDelete,
}) => {
    const classes = useStyles()
    const usuarioState = useRecoilValue(userInfo)
    const [openModalConfirmacion, setOpenModalConfirmacion] = useState(false)

    const administradorFlag = useMemo(() => {
        if (usuarioState) {
            return usuarioState.tipo_usuario === TipoUsuario.ADMIN
        }
        return false
    }, [usuarioState])

    return (
        <div
            style={{
                display: 'flex',
                flex: 'row',
                // justifyContent: 'space-evenly',
            }}
        >
            <ModalConfirmacion
                openModal={openModalConfirmacion}
                onConfirm={() => {
                    setOpenModalConfirmacion(false)
                    onDelete(row.original)
                }}
                mensaje="¿Está seguro de eliminar el registro seleccionado?"
                onCancel={() => setOpenModalConfirmacion(false)}
            />
            <Tooltip className={className} placement="top" title="Visualizar">
                <IconButton
                    color="secondary"
                    onClick={() => onSeeImg(row.original)}
                    className={classes.fab}
                >
                    <EyeCircle />
                </IconButton>
            </Tooltip>
            {administradorFlag && (
                <Tooltip className={className} placement="top" title="Eliminar">
                    <IconButton
                        color="secondary"
                        onClick={() => setOpenModalConfirmacion(true)}
                        //   onClick={() => onDelete(row.original)}
                        className={classes.fab}
                    >
                        <TrashCan />
                    </IconButton>
                </Tooltip>
            )}
        </div>
    )
}

export default VisualizarActionsCell
