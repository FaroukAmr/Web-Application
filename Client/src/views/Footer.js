import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import '../css/footer.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
export default function Footer() {
  const containerStyle = {};
  const socialStyle = { fontSize: '2em', marginRight: '0.3em' };
  const linkStyle = { textDecoration: 'none' };
  const { t } = useTranslation();
  const Navigate = useNavigate();
  return (
    <footer className="footer">
      <Box
        px={{ xs: 3, sm: 10 }}
        py={{ xs: 5, sm: 10 }}
        bgcolor="#383838"
        color="#FAF8FF"
      >
        <Container style={containerStyle} maxWidth="lg">
          <Grid container spacing={5}>
            <Grid item xs={12} sm={4}>
              <Box borderBottom={1}>{t('info')}</Box>
              <Box>
                <Link style={linkStyle} href="/" color="inherit">
                  {t('terms')}
                </Link>
              </Box>
              <Box>
                <Link
                  onClick={() => {
                    Navigate('/privacy');
                  }}
                  className="link"
                  style={linkStyle}
                  color="inherit"
                >
                  {t('privacy')}
                </Link>
              </Box>
              <Box>
                <Link style={linkStyle} href="/" color="inherit">
                  {t('security')}
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box borderBottom={1}>{t('products')}</Box>
              <Box>
                <Link style={linkStyle} href="/" color="inherit">
                  {t('locks')}
                </Link>
              </Box>
              <Box>
                <Link style={linkStyle} href="/" color="inherit">
                  {t('cards')}
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box borderBottom={1}>{t('socials')}</Box>

              <Link
                className="link"
                href="https://www.linkedin.com/company/ahram-security-group/"
                target="_blank"
                color="#0072b1"
                alt="LinkedIn"
              >
                <LinkedInIcon style={socialStyle} />
              </Link>

              <Link
                className="link"
                href="https://www.facebook.com/AhramSecurity/"
                target="_blank"
                color="#4267b2 "
                alt="Facebook"
              >
                <FacebookIcon style={socialStyle} />
              </Link>

              <Link
                className="link"
                href="https://www.youtube.com/user/AhramAd2007/"
                target="_blank"
                color="#FF0000 "
                alt="Youtube"
              >
                <YouTubeIcon style={socialStyle} />
              </Link>
            </Grid>
          </Grid>
          <Box textAlign="center" pt={{ xs: 5, sm: 10 }} pb={{ xs: 5, sm: 0 }}>
            {t('asg')} &reg; {new Date().getFullYear()}
          </Box>
        </Container>
      </Box>
    </footer>
  );
}
