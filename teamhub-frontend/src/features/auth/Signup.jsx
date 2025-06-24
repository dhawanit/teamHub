import React from 'react';
import { useForm } from 'react-hook-form';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../services/api';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/signup', data);
      alert('Signup successful! Please login.');
      navigate('/dashboard'); 
    } catch (err) {
      alert(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={8}>
        <Typography variant="h4" align="center" gutterBottom>Signup</Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Create Account
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Signup;
