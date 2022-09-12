import '../css/App.css';
import 'flag-icons/css/flag-icons.min.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { CacheProvider } from '@emotion/react';
import Cards from './Cards';
import EmailVerify from './EmailVerify';
import Footer from './Footer';
import ForgotPassword from './ForgotPassword';
import Home from './Home';
import LockGroups from './LockGroups';
import Locks from './Locks';
import Login from './Login';
import Logs from './Logs';
import ManageLocks from './ManageLocks';
import NewCard from './NewCard';
import NewLock from './NewLock';
import NotFound from './NotFound';
import Profile from './Profile';
import ResetPassword from './ResetPassword';
import ResponsiveAppBar from './ResponsiveAppBar';
import ScrollToTop from './ScrollToTop';
import SignUp from './SignUp';
import cookies from 'js-cookie';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { useTranslation } from 'react-i18next';

const themeLtr = createTheme({
  palette: {
    secondary: {
      main: '#d32f2f',
    },
  },
  direction: 'ltr',
});

const themeRtl = createTheme({
  palette: {
    secondary: {
      main: '#d32f2f',
    },
  },
  direction: 'rtl',
});

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const cacheLtr = createCache({
  key: 'muiltr',
});

function App() {
  const { t } = useTranslation();
  const [value, setValue] = useState(cacheRtl);
  const [themeValue, setThemeValue] = useState(themeRtl);
  let currentLanguageCode = cookies.get('i18next') || 'en';

  function listenCookieChange(callback, interval = 1000) {
    let lastCookie = document.cookie;
    setInterval(() => {
      let cookie = document.cookie;
      if (cookie !== lastCookie) {
        try {
          callback({ oldValue: lastCookie, newValue: cookie });
        } finally {
          lastCookie = cookie;
        }
      }
    }, interval);
  }

  useEffect(() => {
    document.title = t('app_title');
    currentLanguageCode = cookies.get('i18next') || 'en';
    if (currentLanguageCode === 'ar') {
      setValue(cacheRtl);
      setThemeValue(themeRtl);
    } else {
      setValue(cacheLtr);
      setThemeValue(themeLtr);
    }
  }, []);

  useEffect(() => {
    listenCookieChange(({ oldValue, newValue }) => {
      currentLanguageCode = cookies.get('i18next') || 'en';
      if (currentLanguageCode === 'ar') {
        setValue(cacheRtl);
        setThemeValue(themeRtl);
      } else {
        setValue(cacheLtr);
        setThemeValue(themeLtr);
      }
    }, 1000);
  }, []);

  return (
    <BrowserRouter>
      <CacheProvider value={value}>
        <ThemeProvider theme={themeValue}>
          <ScrollToTop />
          <ResponsiveAppBar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/cards" element={<Cards />} />
            <Route exact path="/cards/new" element={<NewCard />} />
            <Route exact path="/locks" element={<Locks />} />
            <Route exact path="/locks/new" element={<NewLock />} />
            <Route exact path="/locks/:lockId" element={<ManageLocks />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/forgotpassword" element={<ForgotPassword />} />
            <Route exact path="/lockgroups" element={<LockGroups />} />
            <Route exact path="/logs/:lockId" element={<Logs />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route
              exact
              path="/passwordreset/:resetToken"
              element={<ResetPassword />}
            />
            <Route exact path="/verify/:id/:token" element={<EmailVerify />} />
            {/*keep last  */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </ThemeProvider>
      </CacheProvider>
    </BrowserRouter>
  );
}
export default App;
