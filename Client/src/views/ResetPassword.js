import '../css/resetPassword.css';

import * as React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MuiAlert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Spinner from './Spinner';
import TextField from '@mui/material/TextField';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import logo from '../imgs/logo.webp';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [severity, setSeverity] = useState('');
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { resetToken } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const paperStyle = {
    minWidth: 'fit-content',
    maxWidth: '25rem',
    margin: '4rem auto 8rem auto',
    backgroundImage: 'linear-gradient(to right, #FFFFFF,#DADDE2)',
    borderRadius: '20px',
  };
  const btn = {
    width: '20em',
    backgroundColor: '#2da44e',
    marginTop: '1em',
    borderRadius: '6px',
  };
  const textfieldStyle = { width: '20em' };
  const csrfTokenState = localStorage.getItem('csrfToken');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'xsrf-token': csrfTokenState,
    },
  };
  const resetPasswordHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setPassword('');
      setConfirmPassword('');
      setSeverity('error');
      setOpen(true);
      setLoading(false);

      return setError("Passwords don't match");
    }

    try {
      await axios.put(
        `/api/auth/passwordreset/${resetToken}`,
        {
          password,
        },
        config
      );
      setSeverity('success');
      setError('Password changed');
      setOpen(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.error || error.response.data);
      setSeverity('error');
      setOpen(true);
      setLoading(false);
    }
  };
  if (loading) {
    return <Spinner />;
  }
  if (!loading) {
    return (
      <Paper elevation={6} style={paperStyle}>
        <form onSubmit={resetPasswordHandler} className="container">
          <img src={logo} className="logo-md" alt="ASG Logo" />
          <div className="reset-password-title">{t('change_password')}</div>
          <div className="reset-password-title-bottom">
            {t('make_sure_8_chars')}
          </div>
          <TextField
            style={textfieldStyle}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                    // onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            label={t('password')}
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          ></TextField>
          <TextField
            style={textfieldStyle}
            type={showPassword ? 'text' : 'password'}
            label={t('confirm_password')}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          ></TextField>
          <Button variant="contained" type="submit" style={btn}>
            {t('change_password')}
          </Button>
          <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity={severity}
              sx={{ width: '100%' }}
            >
              {error}
            </Alert>
          </Snackbar>
        </form>
      </Paper>
    );
  }
};

export default ResetPassword;
