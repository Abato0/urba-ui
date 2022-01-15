import {
  Box,
  Button,
  ButtonGroup,
  makeStyles,
  Modal,
  createStyles,
} from "@material-ui/core";
import { FC } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import Image from "next/image";
import { isEmpty } from "ramda";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import { Paper } from "@material-ui/core";

interface IProps {
  open: boolean;
  handleClose: () => void;
  base64: string;
  classes: ClassNameMap<any>;
}

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        marginTop: theme.spacing(10),
        // marginBottom: theme.spacing(2),
        // borderRadius: "12px",
      },
      paper: {
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      },
    })
  //   contentButtons: {
  //     display: "flex",
  //     flexDirection: "row",
  //     justifyContent: "space-between",
  //     width: "100%",
  //     padding: theme.spacing(2),
  //   },
  //   button: {
  //     marginTop: theme.spacing(1),
  //     height: "100%",
  //     backgroundColor: colors.blueGrey[900],
  //     "&:hover": {
  //       backgroundColor: colors.blueGrey[800],
  //     },
  //   },
  //   textBox: {
  //     backgroundColor: "",
  //   },
  //   container: {
  //     display: "flex",
  //     flexDirection: "column",
  //     alignItems: "center",
  //   },
  //   row: {
  //     display: "flex",
  //     flexDirection: "row",
  //     alignItems: "center",
  //     // paddingTop: theme.spacing(6),
  //     // paddingBottom: theme.spacing(6),
  //   },
  //   formControl: {
  //     margin: theme.spacing(1),
  //     minWidth: 220,
  //   },
  //   image: {
  //     display: "flex",
  //     flexDirection: "column",
  //     alignItems: "center",
  //     paddingTop: theme.spacing(3),
  //   },
  // })
);

const ModalImagen: FC<IProps> = ({ open, handleClose, base64, classes }) => {
  const classesRoot = useStyles();
  return (
    <div className={classesRoot.root}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {!isEmpty(base64) ? (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 500,
              height: 500,
              bgcolor: "background.paper",
              border: "2px solid #000",
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
                      <Button onClick={() => zoomIn()}>+</Button>
                      <Button onClick={() => zoomOut()}>-</Button>
                      <Button onClick={() => resetTransform()}>Reset</Button>
                    </ButtonGroup>
                    <TransformComponent>
                      <Box className={classes.image}>
                        <Image
                          src={"data:image/jpeg;base64," + base64}
                          alt="test"
                          width={400}
                          height={400}
                        />
                      </Box>
                    </TransformComponent>
                  </Box>
                );
              }}
            </TransformWrapper>
          </Box>
        ) : (
          <Paper className={classesRoot.paper}>
            <>
              <h2 id="transition-modal-title">{"Imagen no encontrada"}</h2>
              {/* <p id="transition-modal-description">{}</p> */}
            </>
          </Paper>
        )}
      </Modal>
    </div>
  );
};

export default ModalImagen;
