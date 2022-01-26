import { Component } from "react";
import { config } from "../config";
import './app.scss';
import { mapIcons } from "../utils/utils";

class App extends Component {
  constructor() {
    super();
    this.state = {
      city: {
        searchName: 'omsk',
        name: 'Омск',
      },
      weather_api: process.env.REACT_APP_WEATHER_KEY,
    };
    this.icons = mapIcons(require.context('/src/icons'), false, /\.svg$/);
    this.getWeather = this.getWeather.bind(this);
  }

  async getWeather(city, units) {
    let data = {};
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.state.weather_api}&units=${units}`);
      data = await res.json();
    } catch (err) {
      console.error(err);
    }
    return data;
  }

  async componentDidMount() {
    const weather = await this.getWeather('omsk', config.units.celcious);
    this.setState((state) => ({ ...state, weather }));
  }

  componentDidUpdate() {
    console.log(this.state.weather);
  }

  render() {
    return (
      <div className="app container">
        <nav className="main-nav app__nav">
          <div className="main-nav__title-block">
            <h2 className="h2 main-nav__title">{this.state.city?.name}</h2>
            <div className="temperature-formatter main-nav__temperature-formatter secondary">
              <button className="btn temperature-formatter__item temperature-formatter__item_selected">C</button>
              <button className="btn temperature-formatter__item">F</button>
            </div>
          </div>
          <div className="location-selector main-nav__location-selector secondary">
            <button className="btn location-selector__selector">Сменить город</button>
            <div className="location-selector__current">
              <img className="location-selector__icon" src={this.icons?.['location']} alt="location" />
              <button className="btn location-selector__location">Моё местоположение</button>
            </div>
          </div>
        </nav>
        <div className="weather-display app__weather-display">
          <div className="weather-display__title">
            <img className="weather-display__icon" src={this.icons?.['sunny']} alt="location" />
            <h1 className="weather-display__temp">{this.state.weather?.main.temp}</h1>
          </div>
          <div className="weather-display__description">
            {this.state.weather?.weather[0].description}
          </div>
        </div>
        <div className="weather-details app__weather-details">
          <div className="weather-details__item">
            <h3 className="weather-details__header secondary">Ветер</h3>
            <div>
              <span className="weather-details__data weather-details__data_windspeed_ms">
                {this.state.weather?.wind.speed}
              </span>
              <span className="weather-details__data">
                {this.state.weather?.wind.direction}
              </span>
            </div>
          </div>
          <div className="weather-details__item">
            <h3 className="weather-details__header secondary">Давление</h3>
            <p className="weather-details__data weather-details__data_pressure_mmgh">
              {this.state.weather?.main.pressure * 0.75}
            </p>
          </div>
          <div className="weather-details__item">
            <h3 className="weather-details__header secondary">Влажность</h3>
            <p className="weather-details__data weather-details__data_humidity_percentage">
              {this.state.weather?.main.humidity}
            </p>
          </div>
          <div className="weather-details__item">
            <h3 className="weather-details__header secondary">Вероятность осадков</h3>
            <p className="weather-details__data weather-details__data_precipitation_percentage">10</p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;