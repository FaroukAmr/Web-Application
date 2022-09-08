import * as React from 'react';

import { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MuiAlert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Spinner from './Spinner';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SignUp() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('');
  const navigate = useNavigate();
  const iconStyle = { fontSize: '4em', marginTop: '0.3em', color: '#152a2f' };
  const paperStyle = {
    margin: '3em auto 8rem auto',
    backgroundImage: 'linear-gradient(to right, #FFFFFF,#DADDE2)',
    minWidth: 'fit-content',
    maxWidth: '25rem',
    borderRadius: '20px',
  };
  const btn = {
    width: '20em',
    marginTop: '1em',
    borderRadius: '6px',
    backgroundColor: '#2da44e',
  };
  const textfieldStyle = { width: '20em' };
  const [lockName, setlockName] = useState('');
  const [lockMac, setlockMac] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('authToken');

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const csrfTokenState = localStorage.getItem('csrfToken');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'xsrf-token': csrfTokenState,
    },
  };

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate('/login');
    }
  }, []);

  const registerHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (lockName.length < 3) {
      setlockName('');
      setOpen(true);
      setSeverity('error');
      setLoading(false);

      return setError('Lock name must be atleast 3 characters long');
    }

    try {
      await axios.post('/api/lock/create', { lockName, lockMac }, config);
      setError('Lock added successfully');
      setSeverity('success');
      setOpen(true);

      navigate('/locks');
    } catch (error) {
      if (error.response.data.error === 'Not authorized to access this route') {
        localStorage.removeItem('authToken');
        navigate('/login');
      }
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
      <Paper style={paperStyle} elevation={6}>
        <form onSubmitCapture={registerHandler} className="sign-up-container">
          <LockOutlinedIcon style={iconStyle} />
          <div className="title-signup">{t('add_lock')}</div>
          <div className="title-signup-bottom">{t('')}</div>
          <TextField
            style={textfieldStyle}
            type="input"
            label={t('enter_lock_name')}
            required
            onChange={(e) => setlockName(e.target.value)}
            value={lockName}
          ></TextField>
          <TextField
            style={textfieldStyle}
            type="number"
            label={t('MAC')}
            required
            onChange={(e) => setlockMac(e.target.value)}
            value={lockMac}
          ></TextField>
          <Button type="submit" style={btn} variant="contained">
            {t('add_lock')}
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
}
export default SignUp;
