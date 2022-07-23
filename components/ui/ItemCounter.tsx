import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material"
import { Box, IconButton, Typography } from "@mui/material"
import { FC, useEffect, useState } from 'react';

interface Props {
  currentValue: number;
  maxValue: number;

  // Methods
  updateQuantity: (quntity: number) => void;
}

export const ItemCounter:FC<Props> = ({ currentValue, maxValue, updateQuantity }) => {
  
  const increase = () => {
    if (currentValue >= maxValue) return;
    updateQuantity(currentValue + 1);
  }

  const diminish = () => {
    if (currentValue <= 1) return;
    updateQuantity(currentValue - 1);
  }

  return (
    <Box
      display='flex'
      alignItems='center'
    >
      <IconButton
        onClick={diminish}
      >
        <RemoveCircleOutline />
      </IconButton>
      
      <Typography sx={{ width: 40, textAlign: 'center' }}>
        { currentValue }
      </Typography>
      
      <IconButton
        onClick={increase}
      >
        <AddCircleOutline />
      </IconButton>
    </Box>
  )
}
