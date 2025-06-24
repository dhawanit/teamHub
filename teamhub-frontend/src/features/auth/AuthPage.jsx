import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
  Link as MuiLink
} from '@mui/material';
import { styled } from 'styled-components';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../services/api';
import authService from '../../services/authService';
import { toast } from 'react-toastify';

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/auth/login' : '/auth/signup';

    try {
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const { data } = await api.post(endpoint, payload);
      console.log(data);
      toast.success(`${isLogin ? 'Login' : 'Signup'} successful`);
      localStorage.setItem('token', data.token);
      authService.saveToken(data.token);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: 4,
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Box textAlign="center" mb={4}>
          <Logo>
            <img src="/logo.svg" alt="Logo" width={50} />
            TeamHub – A Collaborative Project Tracker
          </Logo>
          <Typography variant="h4" fontWeight="bold">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {isLogin ? 'Login to stay connected.' : 'Create your account.'}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <Box mb={2}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Box>
          )}

          <Box mb={2}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Password"
              name="password"
              type="password"
              inputProps={{ minLength: 8 }}
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
            />
          </Box>
          <Button type="submit" variant="contained" fullWidth>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            {isLogin ? (
              <>
                Don’t have an account?{' '}
                <Link
                  to="/signup"
                  style={{
                    color: '#1976d2',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
                >
                  Click here to sign up.
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link
                  to="/login"
                  style={{
                    color: '#1976d2',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
                >
                  Sign in.
                </Link>
              </>
            )}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default AuthPage;
