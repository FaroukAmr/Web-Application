import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableFooter from '@mui/material/TableFooter';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableHead from '@mui/material/TableHead';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import moment from 'moment';
import Snackbar from '@mui/material/Snackbar';
import { saveAs } from 'file-saver';
import MuiAlert from '@mui/material/Alert';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorIcon from '@mui/icons-material/Error';
import { useTranslation } from 'react-i18next';

import '../css/logs.css';
import Spinner from './Spinner';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function Logs() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [severity, setSeverity] = useState('error');
  const [open, setOpen] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [logs, setLogs] = useState([]);
  const [lockName, setLockName] = useState('');
  const { lockId } = useParams();
  const [hasAccess, setHasAccess] = useState(true);
  const [loading, setLoading] = useState(true);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - logs.length) : 0;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleDate = (date) => {
    return moment(date).calendar({
      sameDay: '[Today] [at] h:mm a',
      lastDay: '[Yesterday] [at] h:mm a',
      lastWeek: '[Last] dddd [at] h:mm a',
      sameElse: 'DD/MM/YYYY [at] h:mm a',
    });
  };

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
      .post('/api/logs/export', { lockId }, configPDF)
      .then((res) => {
        const { data } = res;
        const blob = new Blob([data], { type: 'application/pdf' });
        saveAs(blob, `${lockName}_logs.pdf`);
      })
      .catch((err) => {
        setError('Could not export logs');
        setSeverity('error');
        setOpen(true);
      });
    setLoading(false);
  };

  const allData = async () => {
    setLoading(true);
    await axios
      .post('/api/logs', { lockId }, config)
      .then((res) => {
        setLogs(res.data.data);
        setLockName(res.data.lockName);
        setHasAccess(true);
      })
      .catch((err) => {
        if (err.response.data.error === 'Not authorized to access this route') {
          localStorage.removeItem('authToken');
          setLoading(false);

          navigate('/login');
        } else {
          setHasAccess(false);
          setError(err.response.data.error);
          setSeverity('error');
          setOpen(true);
        }
      });
    setLoading(false);
  };

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate('/login');
    }
    allData();
  }, []);
  if (loading) {
    return <Spinner />;
  }
  if (hasAccess && !loading) {
    return (
      <>
        <TableContainer component={Paper} className="logs-container">
          <Table aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <StyledTableCell style={{ backgroundColor: '#152a2f' }}>
                  Name
                </StyledTableCell>
                <StyledTableCell
                  style={{ backgroundColor: '#152a2f' }}
                  align="left"
                >
                  Action
                </StyledTableCell>
                <StyledTableCell
                  style={{ backgroundColor: '#152a2f' }}
                  align="left"
                >
                  Details
                </StyledTableCell>
                <StyledTableCell
                  style={{ backgroundColor: '#152a2f' }}
                  align="left"
                >
                  Time
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? logs.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : logs
              ).map((log) => (
                <TableRow key={log._id}>
                  <TableCell component="th" scope="row">
                    {log.userId}
                  </TableCell>
                  <TableCell style={{ Minwidth: '10em' }} align="left">
                    {log.action}
                  </TableCell>
                  <TableCell style={{ Minwidth: '10em' }} align="left">
                    {log.detail}
                  </TableCell>
                  <TableCell style={{ Minwidth: '10em' }} align="left">
                    {handleDate(log.createdAt)}
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
                <td>
                  <Button
                    variant="contained"
                    style={{ margin: '0.5em 0em 0em 0.5em' }}
                    onClick={() => {
                      handleExport();
                    }}
                  >
                    EXPORT AS PDF
                  </Button>
                </td>
                <TablePagination
                  labelRowsPerPage={t('rows_per_page')}
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={3}
                  count={logs.length}
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
        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={severity}
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      </>
    );
  }
  if (!loading && !hasAccess) {
    return (
      <div className="not-found">
        <ErrorIcon style={iconStyle} />
        <div className="not-found-title">Unauthorized</div>
        <Button
          variant="contained"
          style={iconBtnStyle}
          onClick={() => {
            navigate('/');
          }}
        >
          Return to home
        </Button>
        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </div>
    );
  }
}

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
