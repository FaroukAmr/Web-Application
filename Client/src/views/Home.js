import * as React from 'react';
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import buildingImg from '../imgs/buildingImg.jpg';
import phoneImg from '../imgs/phoneImg.jpg';
import cardImg from '../imgs/cardImg.jpg';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import '../css/home.css';
export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');
  const csrfTokenState = localStorage.getItem('csrfToken');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'xsrf-token': csrfTokenState,
    },
  };
  const handleGetUserInfo = async () => {
    await axios.get('/api/user', config).catch((err) => {
      if (err.response.data.error === 'Not authorized to access this route') {
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    });
  };

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate('/login');
      return;
    }
    handleGetUserInfo();
  }, []);
  return (
    <div className="home-container">
      <Card sx={{ maxWidth: 345, marginBottom: '1em' }}>
        <CardActionArea component={Link} to={'/ekeys'}>
          <CardMedia
            component="img"
            height="250"
            src={buildingImg}
            alt="technologies"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {t('technologies')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('c1_txt')}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>

      <Card sx={{ maxWidth: 345, marginBottom: '1em' }}>
        <CardActionArea component={Link} to={'/locks'}>
          <CardMedia component="img" height="250" src={phoneImg} alt="locks" />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {t('locks')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('c2_txt')}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>

      <Card sx={{ maxWidth: 345, marginBottom: '1em' }}>
        <CardActionArea component={Link} to={'/cards'}>
          <CardMedia component="img" height="250" src={cardImg} alt="cards" />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {t('cards')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('c3_txt')}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}
