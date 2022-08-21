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
import Spinner from './Spinner';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const LockGroups = () => {
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
  const [lockGroups, setlockGroups] = useState([]);
  const txtStyle = { width: '20em' };
  const handleClickOpenCreate = () => {
    setopenCreate(true);
  };

  const handleCloseCreate = () => {
    setopenCreate(false);
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
    const res = await axios.get('/api/lockgroup/', config);
    setlockGroups(res.data.data);
    setLoading(false);
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
      .catch((err) => {
        setError(err.response.data.error);
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
      })
      .catch((err) => {
        if (err.response.data.error === 'Not authorized to access this route') {
          localStorage.removeItem('authToken');
          navigate('/login');
        }
        setError(err.response.data.error);
        setSeverity('error');
        setOpenSnack(true);
      });
    setLoading(false);
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
      .catch((err) => {
        setError(err.response.data.error);
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
  if (lockGroups?.length > 0 && !loading) {
    return (
      <>
        <div className="home-locks-container">
          <TextField
            label="Enter a group name"
            style={txtStyle}
            variant="outlined"
            onChange={(e) => setSearch(e.target.value)}
          ></TextField>
          <Button variant="contained" onClick={handleClickOpenCreate}>
            New Group
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
                <>
                  <Card className="locks-item">
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
                        Remark: {d.remark}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Updated {handleDate(d.updatedAt)}
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
                        Edit
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          handleClickOpen();
                          setDeleteId(d._id);
                        }}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>

                  <Dialog open={openForm} onClose={handleCloseForm}>
                    <DialogTitle>Edit</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Edit lock group name, remark, and locks
                      </DialogContentText>
                      <TextField
                        autoFocus
                        required
                        margin="dense"
                        label="Name"
                        fullWidth
                        variant="standard"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <TextField
                        autoFocus
                        margin="dense"
                        label="Remark"
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
                        isOptionEqualToValue={(option, value) =>
                          option._id === value._id
                        }
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
                            label="Locks"
                            placeholder="Choose locks to issue"
                          />
                        )}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseForm}>Cancel</Button>
                      <Button
                        onClick={() => {
                          handleCloseForm();
                          handleUpdate(d._id);
                        }}
                      >
                        Confirm
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
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
            {'Are you sure you want to delete this card?'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Deleting a lock group is irreversible, are you sure you want to
              continue?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Go Back</Button>
            <Button
              color="error"
              onClick={() => {
                handleClose();
                handleDelete(deleteId);
              }}
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openCreate} onClose={handleCloseCreate}>
          <DialogTitle>Lock Group</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="input"
              required
              fullWidth
              variant="standard"
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Remark"
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
                  label="Locks"
                  placeholder="Choose Locks"
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCreate}>Cancel</Button>
            <Button
              onClick={() => {
                handleCloseCreate();
                handleSubmit();
              }}
            >
              Create
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
        <div className="not-found-title">No lock groups</div>
        <Button
          variant="contained"
          style={btnStyle}
          onClick={handleClickOpenCreate}
        >
          Create new lock group
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
          <DialogTitle>Lock Group</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="input"
              required
              fullWidth
              variant="standard"
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Remark"
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
                  label="Locks"
                  placeholder="Choose Locks"
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCreate}>Cancel</Button>
            <Button
              onClick={() => {
                handleCloseCreate();
                handleSubmit();
              }}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
};

export default LockGroups;
