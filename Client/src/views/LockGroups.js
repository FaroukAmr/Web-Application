import '../css/locks.css';

import * as React from 'react';

import { useEffect, useState } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Checkbox from '@mui/material/Checkbox';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Spinner from './Spinner';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const LockGroups = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [severity, setSeverity] = useState('error');
  const [defaultLocks, setdefaultLocks] = useState([]);
  const [editLocks, setEditLocks] = useState('');
  const [openForm, setOpenForm] = React.useState(false);
  const [name, setName] = useState('');
  const [remark, setRemark] = useState('');
  const [_id, set_id] = useState('');
  const [locks, setLocks] = useState([]);
  const [openCreate, setopenCreate] = React.useState(false);

  const handleClickOpenForm = (name, remark, locksP) => {
    setName(name);
    setRemark(remark);
    let tempArray = [];
    for (let i = 0; i < locksP.length; i++) {
      tempArray.push({ _id: locksP[i] });
    }
    const result = locks.filter((o) =>
      tempArray.some(({ _id }) => o._id === _id)
    );
    setdefaultLocks(result);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
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
  const [editGroup, setEditGroup] = useState('');

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
  const [lockGroups, setlockGroups] = useState('');
  const txtStyle = { width: '20em' };
  const handleClickOpenCreate = () => {
    setopenCreate(true);
  };

  const handleCloseCreate = () => {
    setopenCreate(false);
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
  const allData = async () => {
    setLoading(true);
    await axios
      .get('/api/lockgroup/', config)
      .then((res) => {
        setlockGroups(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.response.data.error || error.response.data);
        setSeverity('error');
        setOpenSnack(true);
        setLoading(false);
      });
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (name === '') {
      setError('Name cannot be empty');
      setSeverity('error');
      setOpenSnack(true);
      setLoading(false);

      return;
    }
    await axios
      .post(
        '/api/lockgroup/create',
        {
          name,
          remark,
          locks: editLocks,
        },
        config
      )
      .then(() => {
        allData();
        setError('Group created successfully');
        setSeverity('success');
        setOpenSnack(true);
      })
      .catch((error) => {
        setError(error.response.data.error || error.response.data);
        setSeverity('error');
        setOpenSnack(true);
        setLoading(false);
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
      .catch((error) => {
        if (
          error.response.data.error === 'Not authorized to access this route'
        ) {
          localStorage.removeItem('authToken');
          navigate('/login');
        }
        setError(error.response.data.error || error.response.data);
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
    allLocks();
  }, []);

  const handleDelete = async () => {
    setLoading(true);
    await axios
      .post('/api/lockgroup/delete', { _id: deleteId }, config)
      .then(() => {
        setError('Lock group deleted');
        setSeverity('success');
        setOpenSnack(true);
        allData();
      })
      .catch((error) => {
        setError(error.response.data.error || error.response.data);
        setSeverity('error');
        setOpenSnack(true);
        setLoading(false);
      });
  };

  const handleUpdate = async () => {
    setLoading(true);
    if (name === '') {
      setError('Lock group name cannot be empty');
      setSeverity('error');
      setOpenSnack(true);
      setLoading(true);
      return;
    }
    await axios
      .post(
        '/api/lockgroup/update',
        { name, remark, _id, locks: editLocks },
        config
      )
      .then(() => {
        setError('Lock group updated');
        setSeverity('success');
        setOpenSnack(true);
        allData();
      })
      .catch((error) => {
        setError(error.response.data.error || error.response.data);
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
  if (lockGroups?.length > 0 && !loading) {
    return (
      <>
        <div className="home-locks-container">
          <TextField
            label={t('enter_group_name')}
            style={txtStyle}
            variant="outlined"
            onChange={(e) => setSearch(e.target.value)}
          ></TextField>
          <Button variant="contained" onClick={handleClickOpenCreate}>
            {t('new_group')}
          </Button>
        </div>
        <div className="locks-container">
          {lockGroups
            ?.filter((val) => {
              if (search === '') {
                return val;
              } else if (
                val.name.toLowerCase().includes(search.toLowerCase())
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
                      {d.name}
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
                        handleClickOpenForm(d.name, d.remark, d.locks);
                        set_id(d._id);
                      }}
                    >
                      {t('edit')}
                    </Button>
                    <Button
                      color="error"
                      size="small"
                      onClick={() => {
                        setEditGroup(d);
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
        <Dialog open={openForm} onClose={handleCloseForm}>
          <DialogTitle>{t('edit')}</DialogTitle>
          <DialogContent>
            <DialogContentText>{t('edit_lock_group_text')}</DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              label={t('name')}
              fullWidth
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="dense"
              label={t('remark')}
              fullWidth
              variant="standard"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
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
              isOptionEqualToValue={(option, value) => option._id === value._id}
              defaultValue={defaultLocks}
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
                handleUpdate(editGroup._id);
              }}
            >
              {t('confirm')}
            </Button>
          </DialogActions>
        </Dialog>
        ;
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
            {t('delete_lock_group_tite')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t('delete_lock_group_warning')}
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
        <Dialog open={openCreate} onClose={handleCloseCreate}>
          <DialogTitle>{t('create_new_lock_group')}</DialogTitle>
          <DialogContent>
            <DialogContentText>{t('new_lock_group_title')}</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={t('name')}
              type="input"
              required
              fullWidth
              variant="standard"
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="dense"
              id="name"
              label={t('remark')}
              type="input"
              fullWidth
              variant="standard"
              onChange={(e) => setRemark(e.target.value)}
            />
          </DialogContent>
          <DialogContent>
            <Autocomplete
              required
              multiple
              id="checkboxes"
              onChange={(event, value) => setEditLocks(value)}
              options={locks}
              disableCloseOnSelect
              getOptionLabel={(option) => option.lockName}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    //   style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.lockName}
                </li>
              )}
              // style={{ width: 500 }}
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
            <Button onClick={handleCloseCreate}>{t('go_back')}</Button>
            <Button
              onClick={() => {
                handleCloseCreate();
                handleSubmit();
              }}
            >
              {t('confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
  if (lockGroups?.length === 0 && !loading) {
    return (
      <div className="not-found">
        <CreditCardOffIcon style={iconStyle} />
        <div className="not-found-title">{t('no_lock_groups')}</div>
        <Button
          variant="contained"
          style={btnStyle}
          onClick={handleClickOpenCreate}
        >
          {t('create_new_lock_group')}
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
        <Dialog open={openCreate} onClose={handleCloseCreate}>
          <DialogTitle>{t('create_new_lock_group')}</DialogTitle>
          <DialogContent>
            <DialogContentText>{t('new_lock_group_title')}</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={t('name')}
              type="input"
              required
              fullWidth
              variant="standard"
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="dense"
              id="name"
              label={t('remark')}
              type="input"
              fullWidth
              variant="standard"
              onChange={(e) => setRemark(e.target.value)}
            />
          </DialogContent>
          <DialogContent>
            <Autocomplete
              required
              multiple
              id="checkboxes"
              onChange={(event, value) => setEditLocks(value)}
              options={locks}
              disableCloseOnSelect
              getOptionLabel={(option) => option.lockName}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    //   style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.lockName}
                </li>
              )}
              // style={{ width: 500 }}
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
            <Button onClick={handleCloseCreate}>{t('go_back')}</Button>
            <Button
              onClick={() => {
                handleCloseCreate();
                handleSubmit();
              }}
            >
              {t('confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
};

export default LockGroups;
