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
import { useTranslation } from 'react-i18next';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function EmailVerify() {
  const { t } = useTranslation();
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
  const csrfTokenState = localStorage.getItem('csrfToken');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'xsrf-token': csrfTokenState,
    },
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

    await axios
      .get(`/api/auth/verify/${id}/${token}`, config)
      .then(() => {
        setSeverity('success');
        setError('Email Verified');
        setValid(true);
        setOpen(true);
      })
      .catch((error) => {
        setError(error.response.data.error || error.response.data);
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
        <div className="not-found-title">{t('email_verified')}</div>
        <Button
          variant="contained"
          style={btnStyle}
          onClick={() => {
            navigate('/login');
          }}
        >
          {t('login')}
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
        <div className="not-found-title">{t('invalid_link')}</div>
        <Button
          variant="contained"
          style={btnStyle}
          onClick={() => {
            navigate('/login');
          }}
        >
          {t('request_new_link')}
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
