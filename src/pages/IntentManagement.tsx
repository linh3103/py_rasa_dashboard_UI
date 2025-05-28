import { useEffect, useState } from 'react';
import { get, post, put, del } from '../lib/api';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container, IconButton, Box, Typography, Button } from '@mui/material'
import { Delete, Edit } from '@mui/icons-material';
import Modal from '../components/CustomModal.tsx';
import ExampleModal from '../components/IntentExamplesModal.tsx'
import { Intent } from '../schemas/Intent.ts';

export default function IntentManager() {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [form, setForm] = useState<Partial<Intent>>({ name: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setEditingId(null)
    setForm({name: "", description: ""})
    setOpen(false);
  };

  useEffect(() => {
    loadIntents();
  }, []);

  const loadIntents = async () => {
    const data = await get<Intent[]>('/intents');
    setIntents(data);
  };

  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setForm((prev) => ({
        ...prev,
        [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    if (!form.name) return alert('Tên không được để trống');

    try {
      if (editingId) {
        await put(`/intents/${editingId}`, form);
      } else {
        await post('/intents', form);
      }
      setForm({ name: '', description: '' });
      setEditingId(null);
      loadIntents();
      alert("OK")
    } catch (err) {
      alert('Lỗi khi lưu intent');
    }
  };

  const handleEdit = (intent: Intent) => {
    setForm(intent);
    setEditingId(intent.id);
    handleOpen()
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc muốn xoá?')) {
      await del(`/intents/${id}`);
      loadIntents();
    }
  };

  const [intentID, setIntentID] = useState<number | null>(null)
  const [intentName, setIntentName] = useState<string | null>(null)

  const onSelectIntent = (id: number, name: string) => {
    setIntentID(id)
    setIntentName(name)
  }

  return (
    <div>
        <Container maxWidth="xl" sx={{ mt: 8 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Danh sách Intents
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Thêm mới
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={5}>
        <Table size='medium'>
          <TableHead>
            <TableRow>
              <TableCell><strong>STT</strong></TableCell>
              <TableCell><strong>Intent</strong></TableCell>
              <TableCell><strong>Mô tả</strong></TableCell>
              <TableCell align="center"><strong>Hành động</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {intents.map((intent, index) => (
              <TableRow key={intent.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{intent.name}</TableCell>
                <TableCell>{intent.description}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleEdit(intent)}>
                    <Edit />
                  </IconButton>

                  <IconButton color="error" onClick={() => handleDelete(intent.id)}>
                    <Delete />
                  </IconButton>

                  <IconButton color='info' onClick={() => onSelectIntent(intent.id, intent.name)}>
                    Examples
                  </IconButton>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>

    <Modal 
        open={open} 
        handleClose={handleClose} 
        handleSubmit={handleSubmit} 
        form={form} 
        handleChangeForm={handleChangeForm}
        id={editingId}
    />

    <ExampleModal
        intent_id={intentID}
        intent_name={intentName}
    />
    </div>
  );
}
