import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './views/App';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
document.cookie = 'SameSite=None';
document.cookie = 'Secure';
i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs: ['en', 'ar', 'fr'],
    fallbackLng: 'en',
    detection: {
      order: ['cookie', 'htmlTag', 'localStorage', 'path', 'subdomain'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: '/assets/locales/{{lng}}/translation.json',
    },
  });

const root = ReactDOM.createRoot(document.getElementById('root'));
const loadingMarkup = (
  <div style={{ display: 'flex', justifyContent: 'center', margin: '4em 0' }}>
    <h3>Loading content..</h3>
  </div>
);
root.render(
  <Suspense fallback={loadingMarkup}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Suspense>
);
