import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import logo from '../imgs/logo.webp';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import cookies from 'js-cookie';
import axios from 'axios';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import '../css/Navbar.css';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
const languages = [
  {
    code: 'en',
    name: 'English',
    country_code: 'us',
  },
  {
    code: 'ar',
    name: 'العربية',
    country_code: 'eg',
    dir: 'rtl',
  },
];
const ResponsiveAppBar = () => {
  const currentLanguageCode = cookies.get('i18next') || 'en';
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [signupButton, setsignupButton] = useState(true);
  const rendersignupButton = useCallback(() => {
    return !localStorage.getItem('authToken');
  });
  const [csrfTokenState, setCsrfTokenState] = useState('');
  const token = localStorage.getItem('authToken');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'xsrf-token': csrfTokenState,
    },
  };

  async function handleCsrf() {
    await axios.get('/api/csrf', config).then((res) => {
      setCsrfTokenState(res.data.csrfToken);
      localStorage.setItem('csrfToken', res.data.csrfToken);
    });
  }
  useEffect(() => {
    handleCsrf();
    document.body.dir = currentLanguage.dir || 'ltr';
    document.title = t('app_title');
    if (!rendersignupButton()) {
      handleGetUserInfo();
      setsignupButton(false);
    } else {
      setsignupButton(true);
    }
  }, [currentLanguage, token]);
  const logoutHandler = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleGetUserInfo = async () => {
    await axios
      .get('/api/user', config)
      .then((res) => {
        setImage(res.data.data.image);
        setName(res.data.data.username);
      })
      .catch((err) => {
        setName('');
      });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorElLang, setAnchorElLang] = React.useState(null);
  const openLang = Boolean(anchorElLang);
  const handleClickLang = (event) => {
    setAnchorElLang(event.currentTarget);
  };
  const handleCloseLang = () => {
    setAnchorElLang(null);
  };

  return (
    <AppBar position="sticky">
      <div className="nvbar">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <div className="nv-2">
              <img
                style={{ width: '8em', height: '3.1em' }}
                src={logo}
                alt="ASG logo"
                className="logo-lg"
                onClick={() => {
                  navigate('/');
                }}
              />
            </div>
            <div className="nv-3">
              {signupButton ? (
                <>
                  <Button
                    // variant="contained"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.55)',
                      color: '#eee',
                    }}
                    onClick={() => {
                      navigate('/signup');
                    }}
                    className="btn"
                  >
                    {t('sign_up')}
                  </Button>
                </>
              ) : (
                <React.Fragment>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <Tooltip title={t('account_settings')}>
                      <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                      >
                        <Avatar
                          sx={{ width: 42, height: 42 }}
                          src={image}
                          alt="profile image"
                        >
                          {name.charAt(0)}
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    // onClick={handleClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        navigate('/profile');
                      }}
                    >
                      <Avatar
                        sx={{ width: 32, height: 32 }}
                        src={image}
                        alt="profile image"
                      >
                        {name.charAt(0)}
                      </Avatar>
                      <span style={{ marginRight: '1em' }}>{name}</span>
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                      <ListItemIcon onClick={handleClickLang}>
                        <ArrowDropDownIcon fontSize="small" />
                      </ListItemIcon>

                      <Typography
                        variant="inherit"
                        id="basic-button"
                        aria-controls={openLang ? 'language-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openLang ? 'true' : undefined}
                        onClick={handleClickLang}
                        style={{ width: '100%' }}
                      >
                        {t('language')}
                      </Typography>
                      <Menu
                        id="language-menu"
                        anchorEl={anchorElLang}
                        open={openLang}
                        onClose={handleCloseLang}
                        MenuListProps={{
                          'aria-labelledby': 'basic-button',
                        }}
                      >
                        {languages.map(({ code, name, country_code }) => (
                          <MenuItem
                            key={code}
                            onClick={() => {
                              handleCloseLang();
                              handleClose();
                              i18next.changeLanguage(code);
                            }}
                            disabled={code === currentLanguageCode}
                          >
                            <Typography component={'div'} textAlign="center">
                              <ListItemIcon>
                                <span
                                  className={`fi fi-${country_code}`}
                                  style={{
                                    opacity:
                                      code === currentLanguageCode ? 0.5 : 1,
                                  }}
                                ></span>
                              </ListItemIcon>
                              {name}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Menu>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        navigate('/cards/new');
                      }}
                    >
                      <ListItemIcon>
                        <AddIcon fontSize="small" />
                      </ListItemIcon>
                      {t('issue_card')}
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        navigate('/locks/new');
                      }}
                    >
                      <ListItemIcon>
                        <AddIcon fontSize="small" />
                      </ListItemIcon>
                      {t('add_lock')}
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        navigate('/lockgroups');
                      }}
                    >
                      <ListItemIcon>
                        <FormatListBulletedIcon fontSize="small" />
                      </ListItemIcon>
                      {t('lock_groups')}
                    </MenuItem>

                    <MenuItem
                      onClick={() => {
                        handleClose();
                        navigate('/profile');
                      }}
                    >
                      <ListItemIcon>
                        <Settings fontSize="small" />
                      </ListItemIcon>
                      {t('settings')}
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        logoutHandler();
                      }}
                    >
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      {t('log_out')}
                    </MenuItem>
                  </Menu>
                </React.Fragment>
              )}
            </div>
          </Toolbar>
        </Container>
      </div>
    </AppBar>
  );
};
export default ResponsiveAppBar;
