import '../css/login.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import logo from '../imgs/logo.png';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';
import jwt_decode from 'jwt-decode';
import * as React from 'react';
import Divider from '@mui/material/Divider';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function Login() {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [severity, setSeverity] = useState('error');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const paperStyle = {
    minWidth: 'fit-content',
    maxWidth: '25rem',
    margin: '4em auto 8rem auto',
    backgroundImage: 'linear-gradient(to right, #FFFFFF,#DADDE2)',
    borderRadius: '20px',
  };
  const linkStyle = {
    color: '#0969da',
    marginBottom: '1em',
    textDecoration: 'none',
  };
  const btn = {
    width: '20em',
    backgroundColor: '#2da44e',
    borderRadius: '6px',
  };
  const textfieldStyle = { width: '20em' };

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      navigate('/');
    }
    /*global google*/
    google.accounts.id.initialize({
      client_id:
        '825032223170-1tks61ufn0kqnicb345f0i9tdi3cve5m.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
      SameSite: 'Lax',
      callback: handleCallbackResponse,
    });
    google.accounts.id.renderButton(document.getElementById('signInDiv'), {
      theme: 'dark',
      width: '20em',
    });
    google.accounts.id.prompt();
  }, []);
  const loginHandler = async (e) => {
    e.preventDefault();
    const config = {
      header: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      },
    };
    try {
      const { data } = await axios.post(
        '/api/auth/login',
        { email, password },
        config
      );
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        navigate('/');
      } else {
        setError('Verification email sent');
        setSeverity('success');
        setOpen(true);
      }
    } catch (error) {
      setError(error.response.data.error);
      setSeverity('error');
      setOpen(true);
    }
  };
  async function handleCallbackResponse(response) {
    var userObject = jwt_decode(response.credential);
    try {
      const { data } = await axios.post('/api/auth/login/external', {
        email: userObject.email,
        username: userObject.name,
        image: userObject.picture,
      });
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        navigate('/');
      } else {
        setError('Error signing in with Google');
        setSeverity('error');
        setOpen(true);
      }
    } catch (error) {
      setError(error.response.data.error);
      setSeverity('error');
      setOpen(true);
    }
  }

  return (
    <Paper elevation={6} style={paperStyle}>
      <form onSubmit={loginHandler} className="container">
        <img src={logo} className="logo-md" alt="ASG Logo" />
        <div className="title">{t('sign_in')}</div>
        <div className="title-bottom">{t('sign_in_txt')}</div>
        <TextField
          style={textfieldStyle}
          type="email"
          label={t('email')}
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        ></TextField>
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
        <Link to={'/forgotpassword'} style={linkStyle}>
          {t('forgot_password')}
        </Link>
        <Button variant="contained" type="submit" style={btn}>
          {t('sign_in')}
        </Button>
        <div className="login-link">
          {t('new_to_app')}{' '}
          <Link to={'/signup'} style={linkStyle}>
            {t('sign_up')}
          </Link>
        </div>
        <Divider style={{ width: '100%' }}>OR</Divider>
        <div id="signInDiv" style={{ margin: '0em 0em 2em 0em' }}></div>
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
export default Login;
