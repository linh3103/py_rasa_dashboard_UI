import React, {useEffect, useState, useRef} from 'react';
import { EntityExample } from '../schemas/EntityExample';
import { Entity } from '../schemas/Entity';
import { Box, Button, Container, FormControl, IconButton, InputLabel, MenuItem, Popover, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { PostAdd, RestartAlt, Save, Delete } from '@mui/icons-material';
import { put, del, post, get } from '../lib/api';
import { handleChangeInput, handleChangeSelect, getTextSelectionOffset } from '../lib/ultilities';

export default function IntentExampleItem({example_id, text, entityExamples, loadExamples}){

    const [entities, setEntities] = useState<Entity[]>([])

    const loadEntities = async() => {
        const data = await get<Entity[]>("/entity")
        setEntities(data)
    }

    useEffect(() => {
        loadEntities()
    }, [])

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const textRef = useRef<HTMLParagraphElement>(null)

    const [form, setForm] = useState<Partial<EntityExample>>({
        entity_id: 0, example_id, role: "", value: "", char_start: -1, char_end: -1
    })

    const [editingId, setEditingId] = useState<number | null>(null)

    const resetForm = () => {
        setForm(prev => ({
            ...prev,
            entity_id: 0,
            example_id,
            role: "", 
            value: "", 
            char_start: -1, 
            char_end: -1
        }))
    }

    const handleOpenPopover = (event, ee?: EntityExample) => {
        setAnchorEl(event.currentTarget);
        if(ee){
            setEditingId(ee.id)
            setForm(prev => ({
                ...prev,
                id:        ee.id,
                entity_id: ee.entity_id,
                role:      ee.role,
                value:     ee.value
            }))
            return
        }
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
        resetForm()
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleSubmitEntityExample = async () => {
        
        if(!form.entity_id){
            alert("Please select entity")
            return
        }

        try{
            if(editingId){
                await put<EntityExample>(`/entity_examples/${editingId}`, form)
            }else{
                await post<EntityExample>("/entity_examples", form)
                handleClosePopover()
            }
            alert("Update success")
            loadExamples()
        }catch{
            alert("Error, please try later")
        }
    }

    const handleDeleteEntityExample = async (eeID: number | null) => {

        if(!eeID) return

        if (confirm("Please confirm")){
            const result = await del(`/entity_examples/${eeID}`)
            if (result){
                alert("Đã xóa")
                loadExamples()
            }else{
                alert("Đã xảy ra lỗi, vui lòng thử lại sau")
            }
        }
        setEditingId(null)
        handleClosePopover()
    }

    const intentExampleEntity = (text: string, entityExamples: EntityExample[]) => {

        let parts: React.ReactNode[] = [];
        
        if (entityExamples.length > 0) {
            let lastIndex = 0;

            // Sắp xếp các entity theo vị trí bắt đầu
            const sortedEntities = [...entityExamples].sort((a, b) => a.char_start - b.char_start);

            sortedEntities.forEach((ee, index) => {
                const start = ee.char_start;
                const end = ee.char_end + 1; // +1 vì substring không bao gồm end
                const entityText = text.slice(start, end);
                const { entity_name, value } = ee;

                if (lastIndex < start) {
                    parts.push(text.slice(lastIndex, start));
                }
                
                const replacement = (
                    <span
                        aria-describedby={id}
                        onMouseUp={(e) => {e.stopPropagation()}} 
                        onClick={event => {handleOpenPopover(event, ee)}}
                        style={{
                            color: "teal",
                            cursor: "pointer",
                            backgroundColor: "yellow"
                        }}
                    >
                        {entityText}
                    </span>
                );

                parts.push(replacement);
                lastIndex = end;
            });
            
            if (lastIndex < text.length) {
                parts.push(text.slice(lastIndex));
            }
        }else{
            parts.push(text)
        }

        return (
            <>
                <Typography 
                    ref={textRef} 
                    onMouseUp={event => {
                        const range = getTextSelectionOffset(textRef.current!)
                        const start = range?.[0]
                        const end = range?.[1]
                        
                        if(end! > start!){
                            setForm(prev => ({
                                ...prev,
                                char_start: start,
                                char_end: end
                            }))

                            handleOpenPopover(event)
                        }
                    }}
            >
                    {parts}
                </Typography>

                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClosePopover}
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                    }}
                >

                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        display="flex"
                        flexDirection="column"
                        sx={{padding: "10px"}}
                        gap={2}
                    >

                        <FormControl variant="standard">
                            <InputLabel id="demo-simple-select-standard-label">Entity</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                label="Age"
                                name='entity_id'
                                onChange={(e: SelectChangeEvent) => handleChangeSelect(e, setForm)}
                                value={String(form.entity_id)}
                            >
                            <MenuItem value={0}></MenuItem>
                            {entities.map(item => (
                                <MenuItem key={item.id} value={item.id}>{item.entity_name}</MenuItem>
                            ))}
                            </Select>
                        </FormControl>

                        <TextField 
                            id="standard-basic-role" 
                            label="Role" 
                            variant="standard" 
                            size='small'
                            name="role"
                            value={form.role}
                            onChange={(e) => handleChangeInput(e, setForm)}
                        />

                        <TextField 
                            id="standard-basic-value" 
                            label="Value" 
                            variant="standard" 
                            size='small'
                            name='value'
                            value={form.value}
                            onChange={(e) => handleChangeInput(e, setForm)}
                        />

                        <Box
                            display="flex"
                        >
                            <IconButton
                                size="small" 
                                color='success'
                                onClick={() => {handleSubmitEntityExample()}}
                            >
                                <Save/>
                            </IconButton>

                            <IconButton 
                                onClick={() => 
                                    {
                                        console.log(form)
                                        resetForm()
                                    }
                                }
                            >
                                <RestartAlt/>
                            </IconButton>
                            
                            {editingId && 
                                <IconButton 
                                    size="small" 
                                    color='error' 
                                    onClick={() => handleDeleteEntityExample(editingId)}
                                >
                                    <Delete/>
                                </IconButton>
                            }
                        </Box>
                    </Box>
                </Popover>
            </>
        )
    }

    return (
        <Container>
            {intentExampleEntity(text, entityExamples)}
        </Container>
    )
}