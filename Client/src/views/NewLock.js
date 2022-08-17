import '../css/newLock.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import * as React from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SignUp() {
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

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate('/login');
    }
  }, []);

  const registerHandler = async (e) => {
    e.preventDefault();

    if (lockName.length < 3) {
      setlockName('');
      setOpen(true);
      setSeverity('error');
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
      setError(error.response.data.error);
      setSeverity('error');
      setOpen(true);
    }
  };

  return (
    <Paper style={paperStyle} elevation={6}>
      <form onSubmitCapture={registerHandler} className="sign-up-container">
        <LockOutlinedIcon style={iconStyle} />
        <div className="title-signup">Add Lock</div>
        <div className="title-signup-bottom">To your ASG App account</div>
        <TextField
          style={textfieldStyle}
          type="input"
          label="Lock Name"
          required
          onChange={(e) => setlockName(e.target.value)}
          value={lockName}
        ></TextField>
        <TextField
          style={textfieldStyle}
          type="number"
          label="Mac Address"
          required
          onChange={(e) => setlockMac(e.target.value)}
          value={lockMac}
        ></TextField>
        <Button type="submit" style={btn} variant="contained">
          Add Lock
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
export default SignUp;
