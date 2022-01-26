import { Component } from "react";
import './app.scss';
import { mapIcons } from "../utils/utils";

class App extends Component {
  constructor() {
    super();
    this.icons = mapIcons(require.context('/src/icons'), false, /\.svg$/);
  }

  render() {
    return (
      <div className="app container">
        <nav className="main-nav app__nav">
          <div className="main-nav__title-block">
            <h2 className="h2 main-nav__title">Омск</h2>
            <div className="temperature-formatter main-nav__temperature-formatter secondary">
              <button className="btn temperature-formatter__item temperature-formatter__item_selected">C</button>
              <button className="btn temperature-formatter__item">F</button>
            </div>
          </div>
          <div className="location-selector main-nav__location-selector secondary">
            <button className="btn location-selector__selector">Сменить город</button>
            <div className="location-selector__current">
              <img className="location-selector__icon" src={this.icons?.['location']} alt="location" />
              <p className="location-selector__location">Моё местоположение</p>
            </div>
          </div>
        </nav>
        <div className="weather-display app__weather-display">
          <div className="weather-display__title">
            <img className="weather-display__icon" src={this.icons?.['sunny']} alt="location" />
            <h1 className="weather-display__temp">19</h1>
          </div>
          <div className="weather-display__description">Преимущественно солнечно</div>
        </div>
        <div className="weather-details app__weather-details">
          <div className="weather-details__item">
            <h3 className="weather-details__header secondary">Ветер</h3>
            <p className="weather-details__data">5 м/c, западный</p>
          </div>
          <div className="weather-details__item">
            <h3 className="weather-details__header secondary">Давление</h3>
            <p className="weather-details__data">752 мм рт. ст.</p>
          </div>
          <div className="weather-details__item">
            <h3 className="weather-details__header secondary">Влажность</h3>
            <p className="weather-details__data">60%</p>
          </div>
          <div className="weather-details__item">
            <h3 className="weather-details__header secondary">Вероятность осадков</h3>
            <p className="weather-details__data">10%</p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;