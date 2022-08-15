import RFID from '../imgs/RFID.png';
import '../css/newCard.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import * as React from 'react';
import AddCardIcon from '@mui/icons-material/AddCard';
import { useTranslation } from 'react-i18next';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function NewCard() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('');
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
    marginTop: '1em',
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

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    await axios
      .post('/api/card/create', { cardNumber, remark, cardName }, config)
      .then(() => {
        navigate('/cards');
      })
      .catch((err) => {
        if (err.response.data.error === 'Not authorized to access this route') {
          localStorage.removeItem('authToken');
          navigate('/login');
        }
        setError(err.response.data.error);
        setSeverity('error');
        setOpen(true);
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
    if (e.key === 'Enter') {
      if (number.length < 9) {
        number = '';
        setValidNumber(false);
        setCardNumber('not valid');
        setError('Card number not valid');
        setSeverity('error');
        setOpen(true);
      } else {
        //success
        setOpen('false');
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
  if (!validNumber) {
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
  } else {
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
