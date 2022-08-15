import SmartToyIcon from '@mui/icons-material/SmartToy';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../css/notFound.css';
export default function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const iconStyle = {
    margin: '3rem 0 0 0',
    fontSize: '12em',
    color: '#000F14',
  };
  const btnStyle = {
    marginBottom: '6rem',
    marginTop: '1rem',
    minWidth: '25%',
    backgroundColor: '#000F14',
  };
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
