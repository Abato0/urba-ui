import {
    makeStyles,
    createStyles,
    colors,
    Tooltip,
    IconButton,
} from '@material-ui/core'
import { FC } from 'react'
import { ExportTablePdf } from '../../table/export-table-pdf'
import { FileExcelBox as FileExcelBoxIcon } from 'mdi-material-ui'

const useStyles = makeStyles((theme) =>
    createStyles({
        button: {
            marginTop: theme.spacing(1),
            color: 'white',
            margin: theme.spacing(1),
            // height: "50%",
            backgroundColor: colors.blueGrey[900],
            '&:hover': {
                backgroundColor: colors.blueGrey[800],
            },
            maxHeight: theme.spacing(6),
            padding: theme.spacing(3),
            // minWidth: 100,
            // maxHeight: 40,
        },
    })
)

interface IProps {
    idTable: string
    titlePdf: string
    columnsPdf: string[]
    orientacion: 'landscape' | 'portrait'
    ExportExcel: () => void
}

export const ActionsButtonsExcelPdf: FC<IProps> = ({
    ExportExcel,
    columnsPdf,
    idTable,
    orientacion,
    titlePdf,
}) => {
    const classes = useStyles()
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
            }}
        >
            <ExportTablePdf
                classes={classes.button}
                idTable={idTable}
                title={titlePdf}
                columns={columnsPdf}
                orientacion={orientacion}
            />
            <Tooltip title="Exportar a Excel">
                <IconButton>
                    <FileExcelBoxIcon
                        fontSize="large"
                        style={{
                            color: colors.green[800],
                        }}
                        onClick={ExportExcel}
                    />
                </IconButton>
            </Tooltip>
        </div>
    )
}
