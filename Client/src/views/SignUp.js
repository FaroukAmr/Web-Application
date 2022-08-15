import '../css/signUp.css';
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
import * as React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';
import jwt_decode from 'jwt-decode';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function SignUp() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const linkStyle = {
    textDecoration: 'none',
    color: '#0969da',
  };
  const paperStyle = {
    minWidth: 'fit-content',
    maxWidth: '25rem',
    margin: '4rem auto 8rem auto',
    backgroundImage: 'linear-gradient(to right, #FFFFFF,#DADDE2)',
    borderRadius: '20px',
  };
  const btn = {
    width: '20em',
    marginTop: '1em',
    borderRadius: '6px',
    backgroundColor: '#2da44e',
  };
  const textfieldStyle = { width: '20em' };
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [severity, setSeverity] = useState('error');

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      navigate('/');
    } else {
      /*global google*/
      google.accounts.id.initialize({
        client_id:
          '825032223170-1tks61ufn0kqnicb345f0i9tdi3cve5m.apps.googleusercontent.com',
        callback: handleCallbackResponse,
        state_cookie_domain: 'https://localhost:3000',
      });
      google.accounts.id.renderButton(document.getElementById('signInDiv'), {
        theme: 'outline',
        size: 'large',
      });
      google.accounts.id.prompt();
    }
  }, [navigate]);

  async function handleCallbackFB(response) {
    if (response.status === 'unknown') {
      setError('Could not sign in with Facebook');
      setSeverity('error');
      setOpen(true);
      return;
    }
    try {
      const { data } = await axios.post('/api/auth/login/external', {
        email: response.email,
        username: response.name,
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

  const registerHandler = async (e) => {
    e.preventDefault();

    const config = {
      header: {
        'Content-Type': 'application/json',
      },
    };

    if (password !== confirmPassword) {
      setPassword('');
      setConfirmPassword('');
      setSeverity('error');
      setOpen(true);
      return setError('Passwords do not match');
    }

    if (password.length < 8) {
      setPassword('');
      setConfirmPassword('');
      setSeverity('error');
      setOpen(true);
      return setError('Password length must be atleast 8 characters long');
    }

    if (username.length < 3) {
      setUsername('');
      setSeverity('error');
      setOpen(true);
      return setError('Username length must be atleast 3 characters long');
    }

    try {
      await axios.post(
        '/api/auth/register',
        { username, email, password },
        config
      );
      localStorage.removeItem('authToken');
      setError('Verification email sent');
      setSeverity('success');
      setOpen(true);
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
    <Paper style={paperStyle} elevation={6}>
      <form onSubmitCapture={registerHandler} className="sign-up-container">
        <img src={logo} className="logo-md" alt="ASG Logo" />
        <div className="title-signup">{t('sign_up')}</div>
        <div className="title-signup-bottom">{t('create_asg_account')}</div>

        <TextField
          style={textfieldStyle}
          type="name"
          label={t('name')}
          required
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        ></TextField>
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
          label={t('password')}
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
        <Button type="submit" style={btn} variant="contained">
          {t('sign_up')}
        </Button>

        <Link className="signup-link" style={linkStyle} to="/login">
          {t('already_have_account')}
        </Link>
        <div class="title-or">
          <div class="title-row">
            <div class="bar-container">
              <div class="bar"></div>
            </div>
            <div class="text-or">OR</div>
            <div class="bar-container">
              <div class="bar"></div>
            </div>
          </div>
        </div>
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

export default SignUp;
