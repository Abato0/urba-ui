import { Button, IconButton, Tooltip } from '@material-ui/core'
import { Row } from "react-table"
import { FileEdit as FileEditIcon, TrashCan as TrashCanIcon, AccountSettings as AccountSettingsIcon, EyeCircle } from 'mdi-material-ui';

interface IProps {
    className?: string
    onSee: any;
    onDelete: any
    row: Row
}

const ActionsCell: React.FC<IProps> = ({
    // onEdit,
    onDelete,
    row,
    className,
    onSee
}) => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            // alignItems: "center"

        }}>
            <Tooltip title="Ver" placement="top">
                <IconButton
                    // variant="text"
                    //   disabled={disable || !onVerificar(row.original)}

                    onClick={() => onSee(row.original)}
                // onClick={() => onVincular(row.original)}
                >
                    <EyeCircle color="primary" />
                </IconButton>
            </Tooltip>
            <Tooltip className={className} placement="right" title={'Editar'}>
                <IconButton onClick={() => onDelete(row.original)}>
                    <TrashCanIcon color="primary" />
                </IconButton>
            </Tooltip>

        </div>
    )
}


export default ActionsCell