import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { TextField, Typography } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function NestedModal({open, handleClose, handleSubmit, form, handleChangeForm, id}) {

  return (
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

      <>
          <Box
              component="form"
              sx={style}
              noValidate
              autoComplete="off"
              action={handleSubmit}
          >

              <Typography variant='h6' component="h6"color='black'>
                  {id ? "Cập nhật intent" : "Thêm 01 intent"}
              </Typography>

              <TextField id="standard-basic" label="Intent" variant="filled" name='name' value={form.name} onChange={handleChangeForm}/>
              <TextField id="standard-basic" label="Mô tả" variant="filled" name='description' value={form.description} onChange={handleChangeForm}/>

              <br/>
              <br/>

              <Button color="success" variant='outlined' className='mt-10' onClick={(e) => {handleSubmit()}}>
                  {id ? "Cập nhật" : "Thêm"}
              </Button>
          </Box>
      </>

    </Modal>
  );
}

