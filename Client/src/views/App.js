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
import React, { useEffect } from 'react';
import Home from './Home';
import ManageLocks from './ManageLocks';
import Cards from './Cards';
import NewCard from './NewCard';
import EmailVerify from './EmailVerify';
import Logs from './Logs';
import ResponsiveAppBar from './ResponsiveAppBar';
import ScrollToTop from './ScrollToTop';
import 'flag-icons/css/flag-icons.min.css';
const theme = createTheme({
  palette: {
    secondary: {
      main: '#d32f2f',
    },
  },
});

function App() {
  useEffect(() => {
    document.title = 'ASG Smart Lock';
  }, []);
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
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
    </BrowserRouter>
  );
}
export default App;
