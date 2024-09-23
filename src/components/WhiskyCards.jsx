import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';

export default function WhiskyCards(props) {
    return (
        <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2 }}>
            {props.image && (
                <CardMedia
                    component="img"
                    height="200"
                    image={props.image}
                    alt={props.whiskyName}
                />
            )}
            <CardContent>
                <Typography variant="subtitle2" component="div" gutterBottom>
                    {props.whiskyName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {props.nose}
                </Typography>
            </CardContent>
        </Card>
    );
}
