import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Autocomplete, TextField, Box } from '@mui/material';

export default function WhiskyList() {
    const navigate = useNavigate();
    const [whiskyList, setWhiskyList] = useState([]);
    const [selectedWhisky, setSelectedWhisky] = useState(null);

    useEffect(() => {
        getWhiskyList();
    }, []);

    const getWhiskyList = async () => {
        try {
            const response = await axios.get('http://localhost:8080/all-whisky-list');
            if (response.data.length > 0) {
                const itemList = response.data.map(item => ({ label: item.whiskyName, value: item.whiskyName }));
                setWhiskyList(itemList);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const selectWhisky = (event, selectedOption) => {
        setSelectedWhisky(selectedOption);
        if (selectedOption) {
            navigate('/add-whisky', { state: { name: selectedOption.value } });
        }
    };

    return (
        <Box sx={{ width: 300, margin: '0 auto' }}>
            <Autocomplete
                id="whisky-select"
                options={whiskyList}
                value={selectedWhisky}
                onChange={selectWhisky}
                renderInput={(params) => <TextField {...params} label="위스키" variant="outlined" />}
            />
        </Box>
    );
}
