import '../css/App.css';
import Login from './Login';
import Locks from './Locks';
import SignUp from './SignUp';
import ResetPassword from './ResetPassword';
import ForgotPassword from './ForgotPassword';
import Footer from './Footer';
import NewLock from './NewLock';
import NotFound from './NotFound';
import LockGroups from './LockGroups';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import Home from './Home';
import ManageLocks from './ManageLocks';
import Cards from './Cards';
import NewCard from './NewCard';
import EmailVerify from './EmailVerify';
import Logs from './Logs';
import ResponsiveAppBar from './ResponsiveAppBar';
import ScrollToTop from './ScrollToTop';
import Profile from './Profile';
import 'flag-icons/css/flag-icons.min.css';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import cookies from 'js-cookie';

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
    document.title = 'ASG Smart Lock';
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
