import axios from 'axios';
import '../css/resetPassword.css';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useNavigate, useParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import VerifiedIcon from '@mui/icons-material/Verified';
import * as React from 'react';
import Spinner from './Spinner';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function EmailVerify() {
  const navigate = useNavigate();
  const [severity, setSeverity] = useState('');
  const [open, setOpen] = useState(false);
  const [valid, setValid] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { id, token } = useParams();
  const iconStyle = {
    margin: '3rem 0 0 0',
    fontSize: '10em',
    color: '#000F14',
  };
  const btnStyle = {
    marginBottom: '6rem',
    marginTop: '1rem',
    minWidth: '25%',
    backgroundColor: '#000F14',
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  useEffect(() => {
    emailVerifyHandler();
  }, []);
  const emailVerifyHandler = async () => {
    setLoading(true);
    const config = {
      header: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      },
    };

    await axios
      .get(`/api/auth/verify/${id}/${token}`, config)
      .then(() => {
        setSeverity('success');
        setError('Email Verified');
        setValid(true);
        setOpen(true);
        navigate('/login');
      })
      .catch((error) => {
        setError(error.response.data.error);
        setSeverity('error');
        setOpen(true);
        setValid(false);
        setLoading(false);
      });
  };
  if (loading) {
    return <Spinner />;
  }
  if (valid && !loading) {
    return (
      <div className="not-found">
        <VerifiedIcon style={iconStyle} />
        <div className="not-found-title">Email Verified</div>
        <Button
          variant="contained"
          style={btnStyle}
          onClick={() => {
            navigate('/login');
          }}
        >
          Login
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
      </div>
    );
  }
  if (!valid && !loading) {
    return (
      <div className="not-found">
        <SmartToyIcon style={iconStyle} />
        <div className="not-found-title">404</div>
        <div className="not-found-title">Invalid Link</div>
        <Button
          variant="contained"
          style={btnStyle}
          onClick={() => {
            navigate('/login');
          }}
        >
          Request a new link
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
      </div>
    );
  }
}
