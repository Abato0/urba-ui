import React, {useCallback} from 'react'
import {Box, Card, Paper} from '@material-ui/core'
import {useDropzone} from 'react-dropzone'
import {makeStyles, createStyles, Theme} from '@material-ui/core'


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyItems: "center",
      backgroundColor: "red",
      width: "100%",
    },
    cardRoot: {
      // display: "flex",
      // flexDirection: "column",
      // alignItems: "center",
      // justifyItems: "center",
      // overflow: "visible",
      // position: "relative",
      width: "70%",
    },
  })
);


const DropzoneField = () => {
  const classes = useStyles();
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: Blob) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
      <Box className={classes.root}>
        <Card {...getRootProps()} className={classes.cardRoot}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        </Card>
      </Box>

  );
};


export default DropzoneField