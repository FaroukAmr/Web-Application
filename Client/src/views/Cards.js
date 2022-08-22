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
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import { useTranslation } from 'react-i18next';
import Spinner from './Spinner';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Cards = () => {
  const { t } = useTranslation();
  const [severity, setSeverity] = useState('error');
  const [chosenLocks, setChosenLocks] = useState([]);
  const [editLocks, setEditLocks] = useState('');
  const [shareEmail, setShareEmail] = useState('');
  const [openForm, setOpenForm] = React.useState(false);
  const [openShare, setOpenShare] = React.useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardRemark, setCardRemark] = useState('');
  const [editId, setEditId] = useState('');
  const [locks, setLocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleShareOpen = (cardName, remark, cardNumber) => {
    setCardName(cardName);
    setCardRemark(remark);
    setCardNumber(cardNumber);
  };
  const handleClickOpenForm = (cardName, remark, locksP) => {
    setCardName(cardName);
    setCardRemark(remark);
    let tempArray = [];
    for (let i = 0; i < locksP.length; i++) {
      tempArray.push({ _id: locksP[i] });
    }
    const result = locks?.filter((o) =>
      tempArray.some(({ _id }) => o._id === _id)
    );
    setChosenLocks(result);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleCloseShare = () => {
    setOpenShare(false);
  };

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const iconStyle = {
    margin: '3rem 0 0 0',
    fontSize: '12em',
    color: '#000F14',
  };
  const btnStyle = {
    marginBottom: '6rem',
    marginTop: '1rem',
    minWidth: '25%',
    backgroundColor: '#000F14',
  };
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [cards, setCards] = useState([]);
  const txtStyle = { width: '20em' };

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
      .get('/api/card/', config)
      .then((res) => {
        setCards(res.data.data);
        allLocks();
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response.data.error);
        setSeverity('error');
        setOpenSnack(true);
      });
  };

  const allLocks = async () => {
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
        }
        setError(err.response.data.error);
        setSeverity('error');
        setOpenSnack(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate('/login');
    }
    allData();
  }, []);

  const handleDelete = async () => {
    setLoading(true);
    await axios
      .post('/api/card/delete', { _id: deleteId }, config)
      .then(() => {
        setError('Card deleted');
        setSeverity('success');
        setOpenSnack(true);
        allData();
      })
      .catch((err) => {
        setError(err.response.data.error);
        setSeverity('error');
        setOpenSnack(true);
        setLoading(false);
      });
  };

  const handleShare = async () => {
    setLoading(true);
    if (shareEmail.length < 3) {
      setError('Invalid email');
      setSeverity('error');
      setOpenSnack(true);
      setLoading(false);
      return;
    }
    await axios
      .post(
        '/api/card/share',
        { cardName, cardRemark, cardNumber, recipient: shareEmail },
        config
      )
      .then(() => {
        setError(`Card shared with ${shareEmail}`);
        setSeverity('success');
        setOpenSnack(true);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response.data.error);
        setOpenSnack(true);
        setLoading(false);
      });
    setShareEmail('');
  };
  const handleUpdate = async () => {
    setLoading(true);
    if (cardName === '') {
      setError('Card name cannot be empty');
      setSeverity('error');
      setOpenSnack(true);
      return;
    }
    await axios
      .post(
        '/api/card/update',
        { cardName, cardRemark, cardId: editId, locks: editLocks },
        config
      )
      .then(() => {
        setError('Card updated');
        setSeverity('success');
        setOpenSnack(true);
        allData();
      })
      .catch((err) => {
        setError(err.response.data.error);
        setOpenSnack(true);
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

  const randomNumber = (id) => {
    id = id.replace(/\D/g, '');
    id = id.slice(id.length - 6);
    return id;
  };
  if (loading) {
    return <Spinner />;
  }
  if (cards?.length > 0 && !loading) {
    return (
      <>
        <div className="home-locks-container">
          <TextField
            label={t('enter_card_name')}
            style={txtStyle}
            variant="outlined"
            onChange={(e) => setSearch(e.target.value)}
          ></TextField>
          <Button
            variant="contained"
            onClick={() => {
              navigate('/cards/new');
            }}
          >
            {t('new_card')}
          </Button>
        </div>
        <div className="locks-container">
          {cards
            ?.filter((val) => {
              if (search === '') {
                return val;
              } else if (
                val.cardName.toLowerCase().includes(search.toLowerCase())
              ) {
                return val;
              }
            })
            .map(function (d, idx) {
              return (
                <div key={d._id} className="locks-item">
                  <Card>
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
                        {d.cardName}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        component="div"
                      >
                        {t('number')} {d.cardNumber}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        component="div"
                      >
                        {t('remark')} {d.remark}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('updated')} {handleDate(d.updatedAt)}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        onClick={() => {
                          setOpenShare(true);
                          handleShareOpen(d.cardName, d.remark, d.cardNumber);
                        }}
                      >
                        {t('share')}
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          handleClickOpenForm(d.cardName, d.remark, d.locks);
                          setEditId(d._id);
                        }}
                      >
                        {t('edit')}
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

                  <Dialog open={openForm} onClose={handleCloseForm}>
                    <DialogTitle>{t('edit')}</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        {t('card_edit_title')}
                      </DialogContentText>
                      <TextField
                        autoFocus
                        required
                        margin="dense"
                        label="Card Name"
                        fullWidth
                        variant="standard"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                      <TextField
                        autoFocus
                        margin="dense"
                        label="Remark"
                        fullWidth
                        variant="standard"
                        value={cardRemark}
                        onChange={(e) => setCardRemark(e.target.value)}
                      />
                    </DialogContent>
                    <DialogContent>
                      <Autocomplete
                        multiple
                        limitTags={3}
                        id="locks-tags"
                        options={locks}
                        disableCloseOnSelect
                        onChange={(event, value) => setEditLocks(value)}
                        getOptionLabel={(option) => option.lockName}
                        isOptionEqualToValue={(option, value) =>
                          option._id === value._id
                        }
                        defaultValue={chosenLocks}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option.lockName}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={t('locks')}
                            placeholder={t('choose_locks')}
                          />
                        )}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseForm}>{t('go_back')}</Button>
                      <Button
                        onClick={() => {
                          handleCloseForm();
                          handleUpdate(d._id);
                        }}
                      >
                        {t('confirm')}
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
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
            severity={severity}
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
            {t('card_delete_warning')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t('card_delete_warning_txt')}
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

        <Dialog open={openShare} onClose={handleCloseShare}>
          <DialogTitle>{t('share_card')}</DialogTitle>
          <DialogContent>
            <DialogContentText>{t('share_card_txt')}</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label={t('recipient_email')}
              fullWidth
              variant="standard"
              onChange={(e) => setShareEmail(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseShare}>{t('go_back')}</Button>
            <Button
              color="error"
              onClick={() => {
                handleCloseShare();
                handleShare();
              }}
              autoFocus
            >
              {t('share')}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
  if (!loading && cards?.length === 0) {
    return (
      <div className="not-found">
        <CreditCardOffIcon style={iconStyle} />
        <div className="not-found-title">{t('no_cards_here')}</div>
        <Button
          variant="contained"
          style={btnStyle}
          onClick={() => {
            navigate('/cards/new');
          }}
        >
          {t('issue_card')}
        </Button>
        <Snackbar
          open={openSnack}
          autoHideDuration={4000}
          onClose={handleCloseSnack}
        >
          <Alert
            onClose={handleCloseSnack}
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

export default Cards;
