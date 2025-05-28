import {ChangeEvent, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { 
  Container,
  IconButton, 
  Paper, Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, TableRow,
  TextField, 
  Typography 
} from '@mui/material';

import { Delete, Edit } from '@mui/icons-material';
import {get, post, put, del} from '../lib/api';
import { IntentExample } from '../schemas/IntentExample';

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

export default function NestedModal({intent_id, intent_name, handleClose}) {

    const [examples, setExamples] = useState<IntentExample[]>([]);
    const [exampleForm, setExampleForm] = useState<Partial<IntentExample>>({
      intent_id: 0, example: "", description: ""
    })

    const loadExamples = async () => {
        const data = await get<IntentExample[]>(`/intent_examples/${intent_id}`)
        setExamples(data)
    }

    useEffect(() => {
        if (intent_id) {
          loadExamples()
          resetExampleForm()
        }
    }, [intent_id])

    const resetExampleForm = () => {
      setExampleForm((prev) => ({
        ...prev,
        intent_id: intent_id,
        example: "",
        description: ""
      }))
    }

    const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target
      setExampleForm((prev) => ({
        ...prev,
        [name]: value
      }))
    }

    const onSubmitNewExample = async () => {
      if (!exampleForm.example) return alert("Please enter example")
      try {
        await post("/intent_examples", exampleForm)
        resetExampleForm()
        loadExamples()
        alert("OK")
      }catch{
        alert("Error, please check and try later!")
      }
    }

  return (
    <Modal
        open={intent_id && intent_name}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={() => handleClose()}
      >
    <Container maxWidth="md" sx={{ mt: 8, backgroundColor: "black" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} pt={3}>
        <Typography variant="h5" fontWeight="bold">
          Các câu hỏi liên quan đến: {intent_name}
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

            <TableRow key="form-row">
                <TableCell></TableCell>

                <TableCell>
                  <TextField
                    id="filled-multiline-flexible"
                    label="Enter new example"
                    multiline
                    maxRows={4}
                    variant="standard"
                    name='example'
                    onChange={onChangeInput}
                    value={exampleForm.example}
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    id="filled-multiline-flexible"
                    label="Enter description (optional)"
                    multiline
                    maxRows={4}
                    variant="standard"
                    name='description'
                    onChange={onChangeInput}
                    value={exampleForm.description}
                  />
                </TableCell>

                <TableCell align="center">
                  <IconButton color="primary" onClick={() => onSubmitNewExample()}>
                    <Edit />
                  </IconButton>
                </TableCell>

              </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
    </Modal>
  );
}