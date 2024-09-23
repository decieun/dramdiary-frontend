import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, TextField, Button, Typography, Rating, Slider, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import StarIcon from '@mui/icons-material/Star';
import { Radar } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';

// 차트 필수 구성 요소를 ChartJS에 등록
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// 컬러, 슬라이더 마크, 레이더 차트 라벨 정의
const colors = ['Dark Oak', 'Mahogany', 'Copper', 'Amber', 'Gold', 'Honey', 'Straw', 'White Wine', 'Clear'];
const finishMarks = [
    { value: 0, label: 'Short' },
    { value: 100, label: 'Long' }
];
const radarLabels = ['Cereal', 'Fruity', 'Floral', 'Peaty', 'Feinty', 'Sulphury', 'Woody', 'Winey'];

// 필드 라벨 맵핑
const fieldLabels = {
    country: '국가',
    region: '지역',
    distillery: '증류소',
    age: '숙성년도',
    alcohol: '알콜도수',
    openingDate: '개봉일',
    tastingDate: '시음일'
};

const TastingNotesForm = () => {
    const location = useLocation(); // 라우터에서 전달된 상태 데이터 사용

    // 상태: 폼 데이터와 아코디언 상태 관리
    const [formData, setFormData] = useState({
        whiskyName: location.state?.name || '',
        country: '',
        region: '',
        distillery: '',
        age: '',
        alcohol: '',
        openingDate: '',
        tastingDate: '',
        rating: 0,
        color: '',
        noseValues: Array(8).fill(0), // Nose 차트 값 초기화
        tasteValues: Array(8).fill(0), // Taste 차트 값 초기화
        finishValues: 50, // Finish 길이 기본 값
    });

    const [isAccordionOpen, setIsAccordionOpen] = useState(false); // 아코디언 상태 관리

    // 핸들러 함수들
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const toggleAccordion = () => setIsAccordionOpen(!isAccordionOpen);

    const handleRatingChange = (event, newRating) => {
        setFormData({ ...formData, rating: newRating });
    };

    const handleChartDataChange = (index, newValue, section) => {
        const updatedValues = formData[section].map((value, i) => (i === index ? Number(newValue) : value));
        setFormData((prevState) => ({
            ...prevState,
            [section]: updatedValues
        }));
    };

    const handleColorChange = (event) => {
        setFormData({ ...formData, color: event.target.value });
    };

    const handleFinishLengthChange = (event, newLength) => {
        setFormData({ ...formData, finishLength: newLength });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('https://your-backend-api.com/tasting-notes', formData);
            console.log('Data saved successfully:', response.data);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    // 레이더 차트 데이터 구성 함수
    const createRadarData = (data, label, color) => ({
        labels: radarLabels,
        datasets: [
            {
                label,
                data,
                backgroundColor: color.background,
                borderColor: color.border,
                borderWidth: 1

            }
        ],
    });

    // 레이더 차트 옵션 - 범위를 0 ~ 5로 설정
    const radarOptions = {
        scale: {
            r: {
                min: 0, // 최소값
                max: 5, // 최대값
                ticks: {
                    stepSize: 1 // 각 단계의 간격
                }
            }
        }
    };

    // Nose와 Taste 차트 데이터 생성
    const noseRadarData = createRadarData(formData.noseValues, 'Nose', { background: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132, 1)' });
    const tasteRadarData = createRadarData(formData.tasteValues, 'Taste', { background: 'rgba(54, 162, 235, 0.2)', border: 'rgba(54, 162, 235, 1)' });

    // 렌더링되는 JSX
    return (
        <Box sx={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <Grid container spacing={2}>
                {/* 위스키 이름 */}
                <Grid size={{ xs: 10 }}>
                    <TextField
                        label="위스키 이름"
                        fullWidth
                        name="whiskyName"
                        value={formData.whiskyName}
                        onChange={handleInputChange}
                        slotProps={{
                            input: {
                                readOnly: true,
                            },
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />
                </Grid>

                {/* 아코디언 버튼 */}
                <Grid size={{ xs: 1 }}>
                    <Button
                        onClick={toggleAccordion}
                        fullWidth
                        variant="contained"
                        sx={{
                            justifyContent: 'flex-start',
                            typography: 'h6',
                            color: 'primary.main',
                            backgroundColor: isAccordionOpen ? 'transparent' : 'background.paper',
                            '&:hover': {
                                backgroundColor: isAccordionOpen ? 'transparent' : 'background.default'
                            }
                        }}
                    >
                        {isAccordionOpen ? '▲' : '▼'}
                    </Button>
                </Grid>

                {/* 위스키 정보 */}
                {isAccordionOpen &&
                    Object.entries(formData)
                        .filter(([key]) => key !== 'whiskyName' && !key.includes('Date') && key !== 'rating' && key !== 'color' && !key.includes('Values'))
                        .map(([key, value]) => (
                            <Grid size={{ xs: 6 }} key={key}>
                                <TextField
                                    label={fieldLabels[key]}
                                    type='text'
                                    fullWidth
                                    name={key}
                                    value={value}
                                    onChange={handleInputChange}
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                        },
                                        inputLabel: {
                                            shrink: true,
                                        },
                                    }}
                                />
                            </Grid>
                        ))}

                {/* 개봉일, 시음일 */}
                {Object.entries(formData)
                    .filter(([key]) => key.includes('Date'))
                    .map(([key, value]) => (
                        <Grid size={{ xs:12 }} key={key}>
                            <TextField
                                label={fieldLabels[key]}
                                type='date'
                                fullWidth
                                name={key}
                                value={value}
                                onChange={handleInputChange}
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                            />
                        </Grid>
                    ))}

                {/* 평점 */}
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6" component="legend">평점</Typography>
                    <Rating
                        name="rating"
                        value={formData.rating}
                        onChange={handleRatingChange}
                        precision={1}
                        icon={<StarIcon fontSize="inherit" color="primary" />}
                        emptyIcon={<StarIcon fontSize="inherit" color="disabled" />}
                    />
                </Grid>

                {/* color */}
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6" gutterBottom>color</Typography>
                    <TextField
                        label="color"
                        select
                        fullWidth
                        value={formData.color}
                        onChange={handleColorChange}
                    >
                        {colors.map((color) => (
                            <MenuItem key={color} value={color}>
                                {color}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Nose */}
                <Grid container xs={12} rowSpacing={2} columnSpacing={2} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h6" gutterBottom>Nose</Typography>
                        <Radar data={noseRadarData} options={radarOptions} />
                            {formData.noseValues.map((value, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Typography variant="body2">{radarLabels[index]}</Typography>
                                    <Slider
                                        value={value}
                                        onChange={(e, newValue) => handleChartDataChange(index, newValue, 'noseValues')}
                                        min={0}
                                        max={5}
                                    />
                                    <Typography variant="caption">{value}</Typography>
                                </Box>
                            ))}
                    </Grid>

                    {/* Taste */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h6" gutterBottom>Taste</Typography>
                        <Radar data={tasteRadarData} options={radarOptions} />
                            {formData.tasteValues.map((value, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Typography variant="body2">{radarLabels[index]}</Typography>
                                    <Slider
                                        value={value}
                                        onChange={(e, newValue) => handleChartDataChange(index, newValue, 'tasteValues')}
                                        min={0}
                                        max={5}
                                        valueLabelDisplay="auto"
                                        sx={{ width: '100%' }}
                                    />
                                    <Typography variant="caption">{value}</Typography>
                                </Box>
                            ))}
                    </Grid>
                </Grid>

                {/* Finish */}
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6" gutterBottom>Finish Length</Typography>
                    <Slider
                        value={formData.finishLength}
                        onChange={handleFinishLengthChange}
                        marks={finishMarks}
                        min={0}
                        max={5}
                    />
                </Grid>

                {/* 저장 버튼 */}
                <Grid size={{ xs: 12 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                    >
                        저장
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TastingNotesForm;
