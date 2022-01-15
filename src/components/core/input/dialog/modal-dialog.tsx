import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);

interface IProps{
    openModal : boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
    title: string,
    message: string
}

const ModalAuth: React.FC<IProps>=({openModal, setOpenModal, title, message})=>{
  const classes = useStyles();
  const [open, setOpen] = React.useState(openModal);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <div>
      {/* <button type="button" onClick={handleOpen}>
        react-transition-group
      </button> */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">{title}</h2>
            <p id="transition-modal-description">{message}</p>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default ModalAuth