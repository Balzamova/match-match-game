import './style.css';
import App from './app';
import DataBase from './database';

window.onload = async () => {
  const appElement = document.querySelector('body');

  if (!appElement) {
    throw Error('App element not found');
  }

  await new DataBase().readDB();
  await new App(appElement).openPageAbout();
};
