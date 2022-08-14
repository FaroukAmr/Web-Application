import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../imgs/logo.png';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import '../css/Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import cookies from 'js-cookie';

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
function ResponsiveNavbar() {
  const currentLanguageCode = cookies.get('i18next') || 'en';
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [signupButton, setsignupButton] = useState(true);
  const rendersignupButton = useCallback(() => {
    return !localStorage.getItem('authToken');
  });

  useEffect(() => {
    document.body.dir = currentLanguage.dir || 'ltr';
    document.title = t('app_title');
    if (!rendersignupButton()) {
      setsignupButton(false);
    } else {
      setsignupButton(true);
    }
  }, [rendersignupButton, currentLanguage]);

  const logoutHandler = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };
  return (
    <Navbar bg="#eee" expand="sm" fixed="top" className="nvbar">
      <Container fluid>
        <Navbar.Brand
          onClick={() => {
            navigate('/signup');
          }}
        >
          <img src={logo} alt="ASG logo" className="logo-lg" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link
              onClick={() => {
                navigate('/');
              }}
              style={{ fontSize: '20px' }}
            >
              {t('home')}
            </Nav.Link>

            <NavDropdown
              title={t('services')}
              id="navbarScrollingDropdown"
              style={{ fontSize: '20px' }}
            >
              <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
                Something else here
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              style={{ fontSize: '20px' }}
              title={t('language')}
              id="navbarScrollingDropdown"
            >
              {languages.map(({ code, name, country_code }) => (
                <NavDropdown.Item
                  key={country_code}
                  onClick={() => {
                    i18next.changeLanguage(code);
                  }}
                  disabled={code === currentLanguageCode}
                >
                  <span
                    className={`fi fi-${country_code} mx-2`}
                    style={{ opacity: code === currentLanguageCode ? 0.5 : 1 }}
                  ></span>
                  {name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
          {signupButton ? (
            <Button
              onClick={() => {
                navigate('/signup');
              }}
              className="btn"
            >
              {t('sign_up')}
            </Button>
          ) : (
            <Button
              className="btn"
              onClick={() => {
                logoutHandler();
                navigate('/login');
              }}
            >
              {t('log_out')}
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default ResponsiveNavbar;
