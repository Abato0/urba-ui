import {
    Box,
    Card,
    CardHeader,
    CardMedia,
    Container,
    makeStyles,
    Paper,
    Typography,
    ButtonGroup,
    Button,
    Modal,
} from '@material-ui/core'
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { head, isEmpty, isNil } from 'ramda'
import { getBase64 } from '../../../utils/file-base64'
import Image from 'next/image'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { usePostPago, useSubirFoto } from '../../pago/use-pago'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',

        alignItems: 'center',
        justifyItems: 'center',
        // paddingLeft: theme.spacing(8),
        // paddingRight: theme.spacing(8),
        // // minHeight: "100vh",
        // paddingTop: theme.spacing(16),
        // paddingBottom: theme.spacing(16),
        backgroundColor: theme.palette.background.default,
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
    image: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: theme.spacing(3),
        // maxWidth: "500px",
        // maxHeight: "500px",
    },
    icon: {
        marginTop: theme.spacing(10),
        maxWidth: '100%',
        maxHeight: 300,
        height: 'auto',
    },
    button: {
        marginTop: theme.spacing(12),
    },
}))

const MyDropzone: React.FC = () => {
    const [base64, setBase64] = useState<string>('')
    const [file, setFile] = useState<File>()
    const [mutate] = usePostPago()
    // const [mutate] = useSubirFoto();

    // usePostPago()
    const onDrop = React.useCallback(
        ([file]: [File]) => {
            // Do something with the files
            // console.log("accept: ", head(acceptedFiles));

            setFile(file)
            // setFile(acceptedFiles[0]);

            // const result: any = await getBase64(acceptedFiles[0]);
            // // console.log("result: ", result);
            // // const handleClose = () => setOpen(false);

            // setBase64(String(result));
            // handleClose();

            // base64_decode(String(result));
        },
        [mutate]
    )

    // const onDrop = React.useCallback(
    //   async ([file]) => {
    //     console.log("file: ", file);
    //     mutate({ variables: { file: file } });
    //   },
    //   [mutate]
    // );

    const Guardar = async () => {
        if (!isNil(file)) {
            // console.log("file: ", file);
            // const { data } = await mutate({
            //   variables: {
            //     file
            //   },
            // });
            // console.log("data: ", data);
            const { data } = await mutate({
                variables: {
                    idGrupoFamiliar: 1,
                    descripcion: 'null',
                    fecha_pago: '11/11/11',
                    fecha_subida: '11/11/12',
                    imagen_recibo: file,
                    monto: 10,
                    tipo_aporte: 'Implementacion',
                },
            })
        }

        // if (!isEmpty(base64)) {
        //   const { data } = await mutate({
        //     variables: {
        //       idGrupoFamiliar: 1,
        //       descripcion: "null",
        //       fecha_pago: "11/11/11",
        //       fecha_subida: "11/11/12",
        //       imagen_recibo: base64,
        //       monto: 10,
        //       tipo_aporte: "Implementacion",
        //     },
        //   });
        //   console.log("data: Pago", data);
        // }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/jpeg , image/png',
        noKeyboard: true,

        multiple: false,
        onDrop,
    })
    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    function onChange({
        target: {
            validity,
            files: [file],
        },
    }) {
        if (validity.valid) mutate({ variables: { file } })
    }

    const classes = useStyles()
    return (
        <Container className={classes.root}>
            <Box className={classes.container}>
                <Paper {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Typography variant="overline">
                        {
                            "Drag 'n' drop some files here, or click to select files"
                        }
                    </Typography>
                </Paper>
                <Button variant="outlined" onClick={handleOpen}>
                    {' '}
                    Open Modal
                </Button>
                <Button onClick={Guardar}>Guardar</Button>
                <Modal
                    open={open && !isEmpty(base64)}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <TransformWrapper>
                            {({ zoomIn, zoomOut, resetTransform, ...rest }) => {
                                return (
                                    <Box className={classes.container}>
                                        <ButtonGroup
                                            variant="contained"
                                            aria-label="outlined primary button group"
                                            className={classes.row}
                                        >
                                            <Button onClick={() => zoomIn()}>
                                                +
                                            </Button>
                                            <Button onClick={() => zoomOut()}>
                                                -
                                            </Button>
                                            <Button
                                                onClick={() => resetTransform()}
                                            >
                                                Reset
                                            </Button>
                                        </ButtonGroup>
                                        <TransformComponent>
                                            <Box className={classes.image}>
                                                <Image
                                                    src={base64}
                                                    alt="test"
                                                    width={800}
                                                    height={800}
                                                />
                                            </Box>
                                        </TransformComponent>
                                    </Box>
                                )
                            }}
                        </TransformWrapper>
                    </Box>
                </Modal>
                <input type="file" required onChange={onChange} />;
            </Box>
        </Container>
    )
}

export default MyDropzone
