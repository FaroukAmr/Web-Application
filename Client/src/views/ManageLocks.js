import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TableHead from '@mui/material/TableHead';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import '../css/manageLocks.css';
import TextField from '@mui/material/TextField';
import Battery80RoundedIcon from '@mui/icons-material/Battery80Rounded';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useTranslation } from 'react-i18next';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function ManageLocks() {
  const { t } = useTranslation();
  const iconStyle = {
    margin: '8rem 0 0 0',
    fontSize: '12em',
    color: '#000F14',
  };
  const btnStyle = {
    marginBottom: '6rem',
    marginTop: '1rem',
    minWidth: '25%',
    backgroundColor: '#000F14',
  };
  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };
  const [error, setError] = useState('');
  const [openSnack, setOpenSnack] = useState(false);
  const [openDialoge, setOpenDialoge] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const handleClickOpenEdit = (admin) => {
    admin === 'false' ? setAuthorizedAdmin(false) : setAuthorizedAdmin(true);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleClickOpenDialoge = () => {
    setAuthorizedAdmin(false);
    setOpenDialoge(true);
  };

  const handleCloseDialoge = () => {
    setOpenDialoge(false);
  };
  const [severity, setSeverity] = useState('error');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);
  const [openEkey, setOpenEkey] = React.useState(false);
  const [eKeys, seteKeys] = useState([]);
  const [eKeyToDelete, setEKeyToDelete] = useState('');
  const [email, setEmail] = useState('');
  const [eKeyName, setEKeyName] = useState('');
  const [hasAccess, setHasAccess] = useState(true);
  const [authorizedAdmin, setAuthorizedAdmin] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickOpenEkey = () => {
    setOpenEkey(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseEkey = () => {
    setOpenEkey(false);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - eKeys.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const navigate = useNavigate();
  const [lock, setLock] = useState([]);
  const { lockId } = useParams();
  const [edit, setEdit] = useState('');
  const [editId, setEditId] = useState('');
  const token = localStorage.getItem('authToken');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const getLock = async () => {
    await axios
      .post('/api/lock/getLock', { lockId }, config)
      .then((res) => {
        setLock(res.data.data);
        setHasAccess(true);
      })
      .catch((err) => {
        if (err.response.data.error === 'Not authorized to access this route') {
          localStorage.removeItem('authToken');
          navigate('/login');
        }
        setHasAccess(false);
        setError('Cannot access this lock');
        setSeverity('error');
        setOpenSnack(true);
      });
  };

  const getEkeys = async () => {
    await axios.post('/api/ekey/lock', { lockId }, config).then((res) => {
      seteKeys(res.data.data);
    });
  };

  const handleUpdateEkey = async () => {
    if (edit === '') {
      setError('eKey name cannot be empty!');
      setSeverity('error');
      setOpenSnack(true);
    }
    const _id = editId;
    await axios
      .post(
        '/api/ekey/update',
        { _id, name: edit, authorizedAdmin, lockId },
        config
      )
      .then(() => {
        setSeverity('success');
        setError('eKey updated');
        setOpenSnack(true);
        getEkeys();
      })
      .catch((e) => {
        setError(e.response.data.error);
        setSeverity('error');
        setOpenSnack(true);
      });
  };

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate('/login');
    }
    getLock();
    getEkeys();
  }, []);

  const handleDate = (date) => {
    return moment(date).calendar({
      sameDay: '[today] [at] h:mm a',
      lastDay: '[yesterday] [at] h:mm a',
      lastWeek: '[last] dddd [at] h:mm a',
      sameElse: 'DD/MM/YYYY [at] h:mm a',
    });
  };

  const handleDelete = async () => {
    await axios
      .post('/api/lock/delete', { lockId }, config)
      .then(() => {
        handleEkeysDelete();
        navigate('/');
      })
      .catch((err) => {
        setError(err.response.data.error);
        setSeverity('error');
        setOpenSnack(true);
      });
  };

  const handleEkeyDelete = async () => {
    await axios
      .post('/api/ekey/delete', { _id: eKeyToDelete, lockId }, config)
      .then((res) => {
        if (res.data.data === 'Same user') {
          navigate('/');
        } else {
          setSeverity('success');
          setError('eKey deleted');
          setOpenSnack(true);
          getEkeys();
        }
      })
      .catch((err) => {
        setError(err.response.data.error);
        setSeverity('error');
        setOpenSnack(true);
      });
  };

  const handleEkeysCreate = async () => {
    if (eKeyName === '' || email === '') {
      setError('eKey name and recipient email cannot be empty');
      setSeverity('error');
      setOpenSnack(true);
      return;
    }

    await axios
      .post(
        '/api/ekey/create',
        {
          lockId,
          name: eKeyName,
          recipient: email,
          authorizedAdmin,
        },
        config
      )
      .then(() => {
        setSeverity('success');
        setError('eKey created');
        setOpenSnack(true);
        getEkeys();
      })

      .catch((err) => {
        setError(err.response.data.error);
        setSeverity('error');
        setOpenSnack(true);
      });
  };

  const handleEkeysDelete = async () => {
    await axios
      .post('/api/ekey/deletemany', { lockId }, config)
      .catch((err) => {
        setError(err.response.data.error);
        setSeverity('error');
        setOpenSnack(true);
      });
  };
  if (hasAccess) {
    return (
      <Card className="mlocks-main-container">
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {lock.lockName}{' '}
            <Battery80RoundedIcon
              style={{
                color: '#00ff00',
                transform: 'rotate(90deg)',
                fontSize: '2rem',
              }}
            />{' '}
            <span style={{ color: '#00ff00', fontSize: '1.5rem' }}>
              {t('80')}
            </span>
          </Typography>
          <Typography gutterBottom variant="body1" component="div">
            {t('owner')} <span style={{ color: '#666' }}>{lock.userId}</span>
          </Typography>
          <Typography gutterBottom variant="body1" component="div">
            {t('ID')} <span style={{ color: '#666' }}>{lock._id}</span>
          </Typography>
          <Typography gutterBottom variant="body1" component="div">
            {t('MAC')} <span style={{ color: '#666' }}>{lock.lockMac}</span>
          </Typography>
          <Typography gutterBottom variant="body1" component="div">
            {t('created')}{' '}
            <span style={{ color: '#666' }}>{handleDate(lock.createdAt)}</span>
          </Typography>
        </CardContent>
        <CardContent>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
              <TableHead>
                <TableRow>
                  <StyledTableCell style={{ backgroundColor: '#152a2f' }}>
                    {t('ekey')}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ backgroundColor: '#152a2f' }}
                    align="right"
                  >
                    {t('issued_by')}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ backgroundColor: '#152a2f' }}
                    align="right"
                  >
                    {t('recipient')}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ backgroundColor: '#152a2f' }}
                    align="right"
                  >
                    {t('assigned_time')}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ backgroundColor: '#152a2f' }}
                    align="right"
                  >
                    {t('admin')}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ backgroundColor: '#152a2f' }}
                    align="center"
                  >
                    {t('options')}
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? eKeys.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : eKeys
                ).map((eKeys) => (
                  <TableRow key={eKeys._id}>
                    <TableCell component="th" scope="row">
                      {eKeys.name}
                    </TableCell>
                    <TableCell style={{ Minwidth: '10em' }} align="right">
                      {eKeys.userId}
                    </TableCell>
                    <TableCell style={{ Minwidth: '10em' }} align="right">
                      {eKeys.recipient}
                    </TableCell>
                    <TableCell style={{ Minwidth: '10em' }} align="right">
                      {handleDate(eKeys.createdAt)}
                    </TableCell>
                    <TableCell style={{ Minwidth: '10em' }} align="right">
                      {eKeys.authorizedAdmin === 'true'
                        ? t('true')
                        : t('false')}
                    </TableCell>
                    <TableCell style={{ Minwidth: '10em' }} align="right">
                      <Button
                        onClick={() => {
                          setEKeyToDelete(eKeys._id);
                          handleClickOpenEkey();
                        }}
                      >
                        {t('delete')}
                      </Button>{' '}
                      <Button
                        onClick={() => {
                          setEdit(eKeys.name);
                          setEditId(eKeys._id);
                          handleClickOpenEdit(eKeys.authorizedAdmin);
                        }}
                      >
                        {t('edit')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    labelRowsPerPage={t('rows_per_page')}
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: 'All', value: -1 },
                    ]}
                    colSpan={3}
                    count={eKeys.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            onClick={() => {
              handleClickOpenDialoge();
            }}
          >
            {t('send_ekey')}
          </Button>
          <Button
            size="small"
            onClick={() => {
              navigate(`/logs/${lockId}`);
            }}
          >
            {t('logs')}
          </Button>
          <Button
            size="small"
            onClick={() => {
              handleClickOpen();
            }}
          >
            {t('delete')}
          </Button>
        </CardActions>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {t('delete_lock_title')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t('delete_lock_txt')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('go_back')}</Button>
            <Button
              color="error"
              onClick={() => {
                handleClose();
                handleDelete();
              }}
              autoFocus
            >
              {t('delete')}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openEkey}
          onClose={handleCloseEkey}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-ekeys">
            {t('delete_ekey_title')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t('delete_ekey_txt')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEkey}>{t('go_back')}</Button>
            <Button
              color="error"
              onClick={() => {
                handleCloseEkey();
                handleEkeyDelete();
              }}
              autoFocus
            >
              {t('delete')}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDialoge} onClose={handleCloseDialoge}>
          <DialogTitle>{t('send_new_ekey')}</DialogTitle>
          <DialogContent>
            <DialogContentText>{t('ekey_txt')}</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={t('ekey_name')}
              type="email"
              fullWidth
              required
              variant="standard"
              onChange={(e) => setEKeyName(e.target.value)}
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={t('recipient_email')}
              type="email"
              required
              fullWidth
              variant="standard"
              onChange={(e) => setEmail(e.target.value)}
            />
          </DialogContent>
          <DialogContent>
            <FormControlLabel
              onChange={(e) => setAuthorizedAdmin(e.target.checked)}
              control={<Switch />}
              label={t('admin')}
              checked={authorizedAdmin ? true : false}
            />

            <DialogContentText>{t('ekey_txt_2')}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialoge}>{t('go_back')}</Button>
            <Button
              color="error"
              onClick={() => {
                handleCloseDialoge();
                handleEkeysCreate();
              }}
            >
              {t('add')}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openEdit} onClose={handleCloseEdit}>
          <DialogTitle>{t('edit_ekey')}</DialogTitle>
          <DialogContent>
            <DialogContentText>{t('edit_ekey_title')}</DialogContentText>
          </DialogContent>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              required
              id="name"
              label={t('ekey_name')}
              type="email"
              fullWidth
              variant="standard"
              value={edit}
              onChange={(e) => setEdit(e.target.value)}
            />
          </DialogContent>
          <DialogContent>
            <FormControlLabel
              onChange={(e) => setAuthorizedAdmin(e.target.checked)}
              control={<Switch />}
              label={t('admin')}
              checked={authorizedAdmin ? true : false}
            />

            <DialogContentText>{t('ekey_txt_2')}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit}>{t('go_back')}</Button>
            <Button
              color="error"
              onClick={() => {
                handleCloseEdit();
                handleUpdateEkey();
              }}
            >
              {t('update')}
            </Button>
          </DialogActions>
        </Dialog>

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
      </Card>
    );
  } else {
    return (
      <div className="not-found">
        <SmartToyIcon style={iconStyle} />
        <div className="not-found-title">404</div>
        <div className="not-found-title">{t('page_not_found')}</div>
        <Button
          variant="contained"
          style={btnStyle}
          onClick={() => {
            navigate('/');
          }}
        >
          {t('return_home')}
        </Button>
      </div>
    );
  }
}
