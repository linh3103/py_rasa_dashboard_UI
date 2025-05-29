import {ChangeEvent, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { 
  Container,
  FormControl,
  IconButton, 
  InputLabel, 
  MenuItem, 
  Paper, Select, SelectChangeEvent, Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, TableRow,
  TextField, 
  Typography 
} from '@mui/material';

import { Delete, Edit, PostAdd, RestartAlt, Save } from '@mui/icons-material';
import {get, post, put, del} from '../lib/api';
import { IntentExample } from '../schemas/IntentExample';
import { Intent } from '../schemas/Intent';

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
    const [intents, setIntents] = useState<Intent[]>([]);
    const [exampleForm, setExampleForm] = useState<Partial<IntentExample>>({
      intent_id: 0, example: "", description: ""
    })
    const [editingId, setEditingId] = useState<number | null>(null)

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

    const loadIntents = async () => {
      const data = await get<Intent[]>('/intents');
      setIntents(data);
    };

    useEffect(() => {
      loadIntents();
    }, []);

    const resetExampleForm = () => {

      setEditingId(null)

      setExampleForm((prev) => ({
        ...prev,
        intent_id: intent_id,
        example: "",
        description: ""
      }))
    }

    const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      const {name, value} = e.target
      setExampleForm((prev) => ({
        ...prev,
        [name]: value
      }))
    }

    const onChangeSelect = (e: SelectChangeEvent) => {
      const {name, value} = e.target
      setExampleForm((prev) => ({
        ...prev,
        [name]: value
      }))
    }

    const onSubmitNewExample = async () => {
      if (!exampleForm.example) return alert("Please enter example")
      try {

        if (editingId){
          await put(`/intent_examples/${editingId}`, exampleForm)
        }else{
          await post("/intent_examples", exampleForm)
        }

        resetExampleForm()
        loadExamples()
        alert("OK")
      }catch{
        alert("Error, please check and try later!")
      }
    }

    const deleteExample = async (exampleID: number) => {
      if (confirm("Please confirm")){
        const result = await del(`/intent_examples/${exampleID}`)
        loadExamples()
      }
    }

    const onSetSelectExampleToEdit = (example: IntentExample) => {
      setEditingId(example.id)
      setExampleForm((prev) => ({
        ...prev,
        intent_id: example.intent_id,
        example: example.example,
        description: example.description
      }))
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
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examples.map((example, index) => (
              <TableRow key={example.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{example.example}</TableCell>
                <TableCell>{example.description}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => onSetSelectExampleToEdit(example)}>
                    <Edit />
                  </IconButton>

                  <IconButton color="error" onClick={() => deleteExample(example.id)}>
                    <Delete />
                  </IconButton>

                </TableCell>
              </TableRow>
            ))}

            <TableRow key="form-row">
                <TableCell>
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Intent</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Intent"
                        disabled={editingId == null}
                        name='intent_id'
                        onChange={onChangeSelect}
                        value={editingId ? exampleForm.intent_id : intent_id}
                      >
                        
                        {intents.map(intent => (
                          <MenuItem 
                            key={intent.id} 
                            value={intent.id}
                          >
                              {intent.name}
                          </MenuItem>
                        ))}

                      </Select>
                    </FormControl>
                  </Box>
                </TableCell>

                <TableCell>
                  <TextField
                    id="filled-multiline-flexible-example"
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
                    id="filled-multiline-flexible-desc"
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
                  <IconButton color="success" onClick={() => onSubmitNewExample()}>
                    {editingId != null ? <Save/>: <PostAdd />}
                  </IconButton>

                  <IconButton color="success" onClick={() => resetExampleForm()}>
                    <RestartAlt/>
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