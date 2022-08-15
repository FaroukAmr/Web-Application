import axios from 'axios';
import '../css/forgotPassword.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import logo from '../imgs/logo.png';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import * as React from 'react';
import MailLockOutlinedIcon from '@mui/icons-material/MailLockOutlined';
import { useTranslation } from 'react-i18next';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const ForgotPassword = () => {
  const { t } = useTranslation();
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('');
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');
  const buttonStyle = {
    width: '20em',
    backgroundColor: '#2da44e',
    borderRadius: '6px',
    marginTop: '2em',
    height: '2.5em',
  };
  const paperStyle = {
    minWidth: 'fit-content',
    maxWidth: '25rem',
    margin: '4rem auto 8rem auto',
    backgroundImage: 'linear-gradient(to right, #FFFFFF,#DADDE2)',
    borderRadius: '20px',
  };
  const iconStyle = { fontSize: '5em', color: '#383838', marginBottom: '1rem' };
  const btn = {
    width: '20em',
    backgroundColor: '#2da44e',
    borderRadius: '6px',
  };
  const textfieldStyle = { width: '20em', marginBottom: '1em' };

  const forgotPasswordHandler = async (e) => {
    e.preventDefault();

    const config = {
      header: {
        'Content-Type': 'application/json',
      },
    };

    try {
      await axios.post('/api/auth/forgotpassword', { email }, config);

      setEmailSent(true);
      setSeverity('success');
      setError('Email sent');
      setOpen(true);
    } catch (error) {
      setError(error.response.data.error);
      setSeverity('error');
      setOpen(true);
      setEmail('');
    }
  };
  if (!emailSent) {
    return (
      <Paper elevation={6} style={paperStyle}>
        <form onSubmit={forgotPasswordHandler} className="container">
          <img src={logo} className="logo-md" alt="ASG Logo" />
          <div className="forgot-password-title">
            {t('forgot_password_title')}
          </div>
          <div className="forgot-password-title-bottom">
            {t('forgot_password_txt')}
          </div>
          <div className="forgot-password-title-bottom">
            {' '}
            {t('forgot_password_txt_2')}
          </div>
          <TextField
            style={textfieldStyle}
            type="email"
            label={t('email')}
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          ></TextField>
          <Button variant="contained" type="submit" style={btn}>
            {t('send_email')}
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
  } else {
    return (
      <div className="forgot-password-container">
        <MailLockOutlinedIcon style={iconStyle} />
        <div className="forgot-password-title-confirm">Reset Your Password</div>
        <div>Check your email for a link to reset your password.</div>
        <div>
          If it doesn't appear within a few minutes, check your spam folder.
        </div>

        <Button
          style={buttonStyle}
          onClick={() => {
            navigate('/login');
          }}
          variant="contained"
        >
          Return to sign in
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
};

export default ForgotPassword;
