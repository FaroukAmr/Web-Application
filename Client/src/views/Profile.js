import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import axios from 'axios';
import * as React from 'react';
import '../css/profile.css';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import FormLabel from '@mui/material/FormLabel';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import DialogTitle from '@mui/material/DialogTitle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Spinner from './Spinner';
import { Typography } from '@mui/material';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function Profile() {
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [date, setDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [severity, setSeverity] = useState('error');
  const [loading, setLoading] = useState(true);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const [open, setOpen] = useState(false);
  const btn = {
    width: '20em',
    backgroundColor: '#2da44e',
    borderRadius: '6px',
  };
  const token = localStorage.getItem('authToken');

  const csrfTokenState = localStorage.getItem('csrfToken');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'xsrf-token': csrfTokenState,
    },
  };

  const handleGetUserInfo = async () => {
    setLoading(true);
    await axios
      .get('/api/user', config)
      .then((res) => {
        setImage(res.data.data.image);
        setName(res.data.data.username);
        setEmail(res.data.data.email);
        setDate(res.data.data.updatedAt);
        if (res.data.data.gender) {
          setGender(res.data.data.gender);
        } else {
          setGender('male');
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error.response.data.error || error.response.data);
        setSeverity('error');
        setOpen(true);
        setLoading(false);
      });
  };
  const handleChangePassword = async () => {
    setLoading(true);
    if (password.length < 8) {
      setError('Password length must be greather than 8 characters');
      setSeverity('error');
      setOpen(true);
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setSeverity('error');
      setOpen(true);
      setLoading(false);
      return;
    }

    await axios
      .post('/api/user/updatepassword', { password }, config)
      .then((res) => {
        setError('Password updated');
        setSeverity('success');
        setOpen(true);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.response.data.error || error.response.data);
        setSeverity('error');
        setOpen(true);
        setLoading(false);
      });
  };
  const handleUpdateUser = async () => {
    setLoading(true);
    await axios
      .post('/api/user', { username: name, gender }, config)
      .then((res) => {
        setError('User updated');
        setSeverity('success');
        setOpen(true);
        handleGetUserInfo();
      })
      .catch((error) => {
        setError(error.response.data.error || error.response.data);
        setSeverity('error');
        setOpen(true);
        setLoading(false);
      });
  };

  const handleDate = (date) => {
    return moment(date).calendar({
      sameDay: '[today] [at] h:mm a',
      lastDay: '[yesterday] [at] h:mm a',
      lastWeek: '[last] dddd [at] h:mm a',
      sameElse: 'DD/MM/YYYY [at] h:mm a',
    });
  };
  useEffect(() => {
    handleGetUserInfo();
  }, []);
  if (loading) {
    return <Spinner />;
  }
  if (!loading) {
    return (
      <>
        <Paper className="main-profile" style={{ backgroundColor: '#eee' }}>
          <Avatar
            alt={name.charAt(0)}
            src={image}
            sx={{ width: 56, height: 56 }}
            className="profile-avatar"
          >
            {name.charAt(0)}
          </Avatar>
          <Typography style={{ alignSelf: 'center' }} variant="caption">
            {`Updated ` + handleDate(date)}
          </Typography>

          <TextField
            variant="standard"
            label={t('name')}
            style={{ minWidth: '100%' }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            variant="standard"
            label={t('email')}
            style={{ minWidth: '100%' }}
            value={email}
            disabled
            required
          />
          <FormControl>
            <FormLabel id="radio-buttons-group-label">{t('gender')}</FormLabel>
            <RadioGroup
              aria-labelledby="radio-buttons-group-label"
              value={gender.length > 0 ? gender : 'male'}
              name="radio-buttons-group"
              onChange={(e) => setGender(e.target.value)}
            >
              <FormControlLabel
                value="male"
                control={<Radio />}
                label={t('male')}
              />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label={t('female')}
              />
            </RadioGroup>
          </FormControl>
          <Divider style={{ width: '100%' }}></Divider>
          <Button onClick={handleClickOpenDialog}>
            {t('change_password')}
          </Button>
          <Button onClick={handleUpdateUser} variant="contained" style={btn}>
            {t('confirm')}
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
        </Paper>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{t('change_password')}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={t('password')}
              fullWidth
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
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              required
              variant="standard"
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              margin="dense"
              id="name"
              label={t('confirm_password')}
              fullWidth
              variant="standard"
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>{t('go_back')}</Button>
            <Button
              onClick={() => {
                handleCloseDialog();
                handleChangePassword();
              }}
              color="error"
            >
              {t('confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
