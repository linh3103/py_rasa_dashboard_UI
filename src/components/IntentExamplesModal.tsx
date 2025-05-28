import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { IntentExample } from '../schemas/IntentExample';
import {get, post, put, del} from '../lib/api'
import { Delete, Edit } from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function NestedModal({intent_id, intent_name}) {

    const [examples, setExamples] = useState<IntentExample[]>([]);

    const loadExamples = async () => {
        const data = await get<IntentExample[]>(`/intent_examples/${intent_id}`)
        setExamples(data)
    }

    useEffect(() => {
        loadExamples()
    }, [])

  return (
    <Modal
        open={intent_id && intent_name}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

    <>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          {intent_name}
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={5}>
        <Table size='medium'>
          <TableHead>
            <TableRow>
              <TableCell><strong>STT</strong></TableCell>
              <TableCell><strong>Câu hỏi/Yêu cầu</strong></TableCell>
              <TableCell><strong>Mô tả</strong></TableCell>
              <TableCell align="center"><strong>Hành động</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examples.map((example, index) => (
              <TableRow key={example.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{example.example}</TableCell>
                <TableCell>{example.description}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary">
                    <Edit />
                  </IconButton>

                  <IconButton color="error">
                    <Delete />
                  </IconButton>

                  <IconButton color='info'>
                    Examples
                  </IconButton>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
    </Modal>
  );
}