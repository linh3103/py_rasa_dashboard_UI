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
import { IntentExample } from '../schemas/IntentExample.ts';

export default function IntentExamleManager() {
  const [examples, setExamples] = useState<IntentExample[]>([]);
  const [form, setForm] = useState<Partial<IntentExample>>({ intent_id: 0, example: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadIntentExamples();
  }, []);

  const loadIntentExamples = async () => {
    const data = await get<IntentExample[]>('/intent_examples');
    setExamples(data);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  
  const clearForm = () => {
    setForm({intent_id: 0, example: '', description: ''})
  }

  const handleClose = () => {
    setEditingId(null)
    clearForm()
    setOpen(false);
  };

  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setForm((prev) => ({
        ...prev,
        [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    if (!form.intent_id) return alert('Xác định ý định cho câu hỏi này');
    if (!form.example) return alert('Nhập câu hỏi');

    try {
      if (editingId) {
        await put(`/intent_examples/${editingId}`, form);
      } else {
        await post('/intent_examples', form);
      }
      clearForm()
      setEditingId(null);
      loadIntentExamples();
      alert("OK")
    } catch (err) {
      alert('Lỗi khi lưu intent');
    }
  };

  const handleEdit = (example: IntentExample) => {
    setForm(example);
    setEditingId(example.id);
    handleOpen()
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc muốn xoá?')) {
      await del(`/intent_examples/${id}`);
      loadIntentExamples();
    }
  };

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
              <TableCell><strong>Examples</strong></TableCell>
              <TableCell><strong>Mô tả</strong></TableCell>
              <TableCell align="center"><strong>Hành động</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examples.map((example, index) => (
              <TableRow key={example.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{example.intent_name}</TableCell>
                <TableCell>{example.example}</TableCell>
                <TableCell>{example.description}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleEdit(example)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(example.id)}>
                    <Delete />
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
    </div>
  );
}
