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
import logo from '../imgs/logo.png';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import cookies from 'js-cookie';
import axios from 'axios';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import '../css/Navbar.css';
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
  {
    code: 'fr',
    name: 'Français',
    country_code: 'fr',
  },
];
const settings = ['Profile', 'Account', 'Logout'];
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

  useEffect(() => {
    document.body.dir = currentLanguage.dir || 'ltr';
    document.title = t('app_title');
    if (!rendersignupButton()) {
      handleGetUserInfo();
      setsignupButton(false);
    } else {
      setsignupButton(true);
    }
  }, [rendersignupButton, currentLanguage]);

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logoutHandler = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleMenuClick = (req) => {
    if (req === 'Logout') {
      logoutHandler();
      return;
    }
  };
  const token = localStorage.getItem('authToken');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const handleGetUserInfo = async () => {
    await axios
      .get('/api/auth/user', config)
      .then((res) => {
        setImage(res.data.data.image);
        setName(res.data.data.name);
      })
      .catch((err) => {
        console.log(err);
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

  return (
    <AppBar position="sticky">
      <div className="nvbar">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <div className="nv-2">
              <img
                src={logo}
                alt="ASG logo"
                className="logo-lg"
                onClick={() => {
                  navigate('/');
                }}
              />
              <Typography
                className="hover"
                variant="h6"
                noWrap
                sx={{
                  mr: 1,
                  ml: 1,
                  mt: 0,
                  textDecoration: 'none',
                }}
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                {t('language')}
                <ArrowDropDownIcon />
              </Typography>
              <Menu
                id="language-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                {languages.map(({ code, name, country_code }) => (
                  <MenuItem
                    key={code}
                    onClick={() => {
                      handleClose();
                      i18next.changeLanguage(code);
                    }}
                    disabled={code === currentLanguageCode}
                  >
                    <Typography textAlign="center">
                      <span
                        className={`fi fi-${country_code} mx-2`}
                        style={{
                          opacity: code === currentLanguageCode ? 0.5 : 1,
                        }}
                      ></span>
                      {name}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
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
                <Box>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt={name} src={image} />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {settings.map((setting) => (
                      <MenuItem
                        key={setting}
                        onClick={() => {
                          handleCloseUserMenu();
                          handleMenuClick(setting);
                        }}
                      >
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              )}
            </div>
          </Toolbar>
        </Container>
      </div>
    </AppBar>
  );
};
export default ResponsiveAppBar;
