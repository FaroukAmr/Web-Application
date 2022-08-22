import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import '../css/locks.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ErrorIcon from '@mui/icons-material/Error';
import { saveAs } from 'file-saver';
import { useTranslation } from 'react-i18next';
import Spinner from './Spinner';
import { formLabelClasses } from '@mui/material';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Locks = () => {
  const { t } = useTranslation();
  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };
  const [openSnack, setOpenSnack] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = React.useState(false);
  const [deleteId, setDeleteId] = useState('');
  const txtStyle = { width: '20em' };
  const [loading, setLoading] = useState(true);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [locks, setLocks] = useState([]);
  const iconStyle = {
    margin: '3rem 0 0 0',
    fontSize: '12em',
    color: '#000F14',
  };
  const iconBtnStyle = {
    marginBottom: '6rem',
    marginTop: '1rem',
    minWidth: '25%',
    backgroundColor: '#000F14',
  };

  const token = localStorage.getItem('authToken');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const allData = async () => {
    setLoading(true);
    await axios
      .get('/api/lock/all', config)
      .then((res) => {
        setLocks(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.data.error === 'Not authorized to access this route') {
          localStorage.removeItem('authToken');
          navigate('/login');
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate('/login');
    }
    allData();
  }, []);

  const handleDelete = async (lockId) => {
    setLoading(true);
    await axios
      .post('/api/lock/delete', { lockId }, config)
      .then(() => {
        handleEkeysDelete(lockId);
        allData();

        setLoading(false);
      })
      .catch((err) => {
        setError(err.response.data.error);
        setOpenSnack(true);
        setLoading(false);
      });
  };

  const handleEkeysDelete = async (lockId) => {
    await axios
      .post('/api/ekey/deletemany', { lockId }, config)
      .catch((err) => {
        setError(err.response.data.error);
        setOpenSnack(true);
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

  const configPDF = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    responseType: 'arraybuffer',
  };

  const handleExport = async () => {
    setLoading(true);
    await axios
      .get('/api/lock/export', configPDF)
      .then((res) => {
        const { data } = res;
        const blob = new Blob([data], { type: 'application/pdf' });
        saveAs(blob, `locks.pdf`);
        setLoading(false);
      })
      .catch((err) => {
        setError('Could not export locks');
        setOpenSnack(true);
        setLoading(false);
      });
  };

  const randomNumber = (id) => {
    id = id.replace(/\D/g, '');
    id = id.slice(id.length - 6);
    return id;
  };
  if (locks?.length > 0 && !loading) {
    return (
      <>
        <div className="home-locks-container">
          <TextField
            label={t('enter_lock_name')}
            style={txtStyle}
            variant="outlined"
            onChange={(e) => setSearch(e.target.value)}
          ></TextField>
          <Button
            variant="contained"
            onClick={() => {
              handleExport();
            }}
          >
            {t('export_pdf')}
          </Button>
        </div>
        <div className="locks-container">
          {locks
            ?.filter((val) => {
              if (search === '') {
                return val;
              } else if (
                val.lockName.toLowerCase().includes(search.toLowerCase())
              ) {
                return val;
              }
            })
            .map(function (d, idx) {
              return (
                <Card className="locks-item" key={d._id}>
                  <CardMedia
                    component="img"
                    height="8"
                    style={{
                      backgroundColor: `#${randomNumber(d._id)}`,
                      borderRadius: '0px',
                      width: '100%',
                      margin: '0 auto',
                    }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {d.lockName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('owner')}{' '}
                      <span style={{ color: '#666' }}>{d.userId}</span>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('ID')} {d._id}
                      <br /> {t('updated')} {handleDate(d.updatedAt)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => {
                        navigate(`/locks/${d._id}`);
                      }}
                    >
                      {t('manage')}
                    </Button>
                    <Button
                      color="error"
                      size="small"
                      onClick={() => {
                        handleClickOpen();
                        setDeleteId(d._id);
                      }}
                    >
                      {t('delete')}
                    </Button>
                  </CardActions>
                </Card>
              );
            })}
        </div>
        <Snackbar
          open={openSnack}
          autoHideDuration={4000}
          onClose={handleCloseSnack}
        >
          <Alert
            onClose={handleCloseSnack}
            severity="error"
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {t('delete_lock_warning')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t('delete_lock_warning_2')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('go_back')}</Button>
            <Button
              color="error"
              onClick={() => {
                handleClose();
                handleDelete(deleteId);
              }}
              autoFocus
            >
              {t('delete')}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
  if (loading) {
    return <Spinner />;
  }
  if (!loading && locks?.length === 0) {
    return (
      <div className="not-found">
        <ErrorIcon style={iconStyle} />
        <div className="not-found-title">{t('no_locks')}</div>
        <Button
          variant="contained"
          style={iconBtnStyle}
          onClick={() => {
            navigate('/locks/new');
          }}
        >
          {t('add_lock')}
        </Button>
        <Snackbar
          open={openSnack}
          autoHideDuration={4000}
          onClose={handleCloseSnack}
        >
          <Alert
            onClose={handleCloseSnack}
            severity="error"
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      </div>
    );
  }
};

export default Locks;
