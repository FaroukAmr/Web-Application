import { useEffect } from 'react';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';
import { useTranslation } from 'react-i18next';

function Spinner() {
  const { t } = useTranslation();
  const color = '#000000';
  useEffect(() => {});
  return (
    <div className="sweet-loading">
      <ClimbingBoxLoader color={color} loading={true} size={20} />
      <span className="sweet-loading-txt">{t('loading')}</span>
    </div>
  );
}

export default Spinner;
