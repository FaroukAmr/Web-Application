import '../css/newCard.css';

import * as React from 'react';

import { useEffect, useState } from 'react';

import AddCardIcon from '@mui/icons-material/AddCard';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MuiAlert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import RFID from '../imgs/RFID.webp';
import Snackbar from '@mui/material/Snackbar';
import Spinner from './Spinner';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function NewCard() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('');
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const iconStyle = { fontSize: '4em', marginTop: '1rem', color: '#152a2f' };
  const paperStyle = {
    margin: '4rem auto 8rem auto',
    backgroundImage: 'linear-gradient(to right, #FFFFFF,#DADDE2)',
    minWidth: 'fit-content',
    maxWidth: '25rem',
    borderRadius: '20px',
  };
  const btn = {
    width: '20em',
    margin: '0.5em 0em 2.5em 0em',
    borderRadius: '6px',
    backgroundColor: '#2da44e',
  };
  const textfieldStyle = { width: '20em' };
  const [cardName, setCardName] = useState('');
  const [remark, setRemark] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('authToken');
  const [cardNumber, setCardNumber] = useState('');
  const [validNumber, setValidNumber] = useState(false);
  let number = '';

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

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    let masterRemark = remark;
    if (masterRemark === '' && checked) {
      masterRemark = 'MASTER KEY';
    }
    await axios
      .post(
        '/api/card/create',
        { cardNumber, remark: masterRemark, cardName, checked },
        config
      )
      .then(() => {
        navigate('/cards');
      })
      .catch((err) => {
        if (err.response.data.error === 'Not authorized to access this route') {
          localStorage.removeItem('authToken');
          navigate('/login');
        }
        setError(err.response.data.error || err.response.data);
        setSeverity('error');
        setOpen(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!validNumber) {
      document.addEventListener('keydown', detectKeyDown);
    } else {
      document.removeEventListener('keydown', detectKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', detectKeyDown);
    };
  }, [validNumber]);

  const detectKeyDown = (e) => {
    const isOnlyNumbers = /^\d+$/;
    if (e.key === 'Enter') {
      if (number.length < 9 || !isOnlyNumbers.test(number)) {
        number = '';
        setValidNumber(false);
        setError('Card number not valid');
        setSeverity('error');
        setOpen(true);
      } else {
        //success
        setError('Card number added');
        setSeverity('success');
        setOpen(true);
        setValidNumber(true);
        setCardNumber(number);
        number = '';
      }
    } else {
      number += e.key;

      setTimeout(() => {
        number = '';
      }, 500);
    }
  };
  if (loading) {
    return <Spinner />;
  }
  if (!validNumber && !loading) {
    return (
      <div className="new-card-container">
        <img className="new-card-img" alt="" src={RFID} />
        <div className="new-card-title">{t('issue_card')}</div>
        <div className="new-card-txt">{t('place_card_rfid')}</div>
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
  if (validNumber && !loading) {
    return (
      <Paper style={paperStyle} elevation={6}>
        <form onSubmitCapture={handleCreate} className="new-card-container">
          <AddCardIcon style={iconStyle} />
          <div className="title-new-card">{t('issue_card')}</div>
          <TextField
            style={textfieldStyle}
            type="input"
            label={t('card_number')}
            value={cardNumber}
            disabled
            required
          ></TextField>
          <TextField
            style={textfieldStyle}
            type="input"
            label={t('card_name')}
            required
            onChange={(e) => setCardName(e.target.value)}
          ></TextField>
          <TextField
            style={textfieldStyle}
            type="input"
            label={t('remark')}
            onChange={(e) => setRemark(e.target.value)}
          ></TextField>
          <FormControlLabel
            control={<Checkbox />}
            onChange={(e) => setChecked(e.target.checked)}
            label="Master Key"
          />

          <Button type="submit" style={btn} variant="contained">
            {t('add_card')}
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
