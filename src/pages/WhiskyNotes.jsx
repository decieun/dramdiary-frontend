import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import WhiskyCards from '../components/WhiskyCards';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';

export default function WhiskyNotes() {
    const navigate = useNavigate();
    const [whiskyNoteList, setWhiskyNoteList] = useState([]);

    useEffect(() => {
        getWhiskyNoteList();
    }, []);

    const getWhiskyNoteList = async () => {
        try {
            const response = await axios.get('http://localhost:8080/all-whisky-notes');
            if (response.data.length > 0) {
                setWhiskyNoteList(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const clickAddBtn = () => {
        navigate('/whisky-list');
    };

    return (
        <>
            <Grid container rowSpacing={2} columnSpacing={2} sx={{ mb: 4 }}>
                {whiskyNoteList.map((element) => (
                    <Grid size={{ xs: 4, md: 2 }} key={element.id}>
                        <WhiskyCards
                            whiskyName={element.whiskyName}
                            nose={element.nose}
                            image={element.image}
                        />
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={clickAddBtn}
                    sx={{ fontWeight: 'bold', p: 2 }}
                >
                    Add
                </Button>
            </Box>
        </>
    );
}
