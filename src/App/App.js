import { Component } from "react";
import { config } from "config";
import './app.scss';
import { mapObject } from "utils/utils";
import { xml2js } from "xml-js";
import { TemperatureFormatter } from './TemperatureFormatter/TemperatureFormatter';
import { WeatherIcon } from './WeatherIcon/WeatherIcon';

class App extends Component {
  constructor() {
    super();
    this.state = {
      params: {
        mode: 'xml',
        lat: 0,
        lon: 0,
        appid: process.env.REACT_APP_WEATHER_KEY,
        units: config.units[0],
      },
    };

    this.setWeatherByCurrentLocation = this.setWeatherByCurrentLocation.bind(this);
    this.setWeatherWithUnits = this.setWeatherWithUnits.bind(this);
    this.getTemperatureUnits = this.getTemperatureUnits.bind(this);
  }

  async fetchWeatherData(params) {
    params = new URLSearchParams(params).toString();
    let data = {};
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`);
      const xml = await res.text();
      data = xml2js(xml, { ignoreComment: true, alwaysChildren: true, compact: true });
      data = this.parseWeatherData(data);
    } catch (err) {
      console.error(err);
    }
    return data;
  }

  async componentDidMount() {
    this.setWeatherByCurrentLocation();
  }

  async currentLocation() {
    let pos = {};
    try {
      pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    } catch (err) {
      console.error(err);
    }
    return pos;
  }

  async setWeatherData() {
    const weather = await this.fetchWeatherData(this.state.params);
    this.setState((state) => ({ ...state, weather: weather.current }));
    // console.log(weather);
  }

  async setWeatherByCurrentLocation() {
    const pos = await this.currentLocation();
    await this.setStateAsync((state) => {
      state.params.lat = pos.coords?.latitude || 0;
      state.params.lon = pos.coords?.longitude || 0;
      return state;
    });
    this.setWeatherData();
  }

  async setWeatherWithUnits(units) {
    await this.setStateAsync((state) => {
      state.params.units = units;
      return state;
    });
    this.setWeatherData();
  }

  getTemperatureUnits() {
    return this.state.params.units;
  }

  setStateAsync(handler) {
    return new Promise(resolve => {
      this.setState(handler, resolve);
    });
  }

  parseWeatherData(obj) {
    return mapObject(obj, (k, v) => {
      if (
        !Number.isNaN(Number(v)) &&
        k !== 'lat' &&
        k !== 'lon'
      ) v = parseInt(v);
      return v;
    });
  }

  render() {
    return (
      <div className={`app app_theme_${this.state.weather?.weather._attributes.value.replace(' ', '-')}`}>
        <div className="container">
          <nav className="main-nav app__nav">
            <div className="main-nav__title-block">
              <h2 className="h2 main-nav__title">{this.state.weather?.city._attributes.name}</h2>
              <TemperatureFormatter setUnits={this.setWeatherWithUnits} getUnits={this.getTemperatureUnits} />
            </div>
            <div className="location-selector main-nav__location-selector secondary">
              <button className="btn location-selector__selector">Сменить город</button>
              <div className="location-selector__current">
                <img className="location-selector__icon" src={require('icons/other/location.svg').default} alt="location" />
                <button
                  className="btn location-selector__location"
                  onClick={this.setWeatherByCurrentLocation}>Моё местоположение</button>
              </div>
            </div>
          </nav>
          <div className="weather-display app__weather-display">
            <div className="weather-display__title">
              <WeatherIcon value={this.state.weather?.weather._attributes.value} />
              <h1 className={`weather-display__temp weather-display__temp_unit_${this.state.weather?.temperature._attributes.unit}`}>
                {this.state.weather?.temperature._attributes.value}
              </h1>
            </div>
            <div className="weather-display__description">
              {this.state.weather?.weather._attributes.value}
            </div>
          </div>
          <div className="weather-details app__weather-details">
            <div className="weather-details__item">
              <h3 className="weather-details__header secondary">Ветер</h3>
              <div>
                <span className={`weather-details__data weather-details__data_windspeed_${this.state.weather?.wind.speed._attributes.unit}`}>
                  {this.state.weather?.wind.speed._attributes.value}
                </span>, {this.state.weather?.wind.direction._attributes.name}
              </div>
            </div>
            <div className="weather-details__item">
              <h3 className="weather-details__header secondary">Давление</h3>
              <p className={`weather-details__data weather-details__data_pressure_${this.state.weather?.pressure._attributes.unit}`}>
                {this.state.weather?.pressure._attributes.value}
              </p>
            </div>
            <div className="weather-details__item">
              <h3 className="weather-details__header secondary">Влажность</h3>
              <p className={`weather-details__data weather-details__data_humidity_${this.state.weather?.humidity._attributes.unit}`}>
                {this.state.weather?.humidity._attributes.value}
              </p>
            </div>
            <div className="weather-details__item">
              <h3 className="weather-details__header secondary">Вероятность осадков</h3>
              {
                this.state.weather?.precipitation._attributes.mode
                  ? <p className="weather-details__data">Нет</p>
                  : <p className="weather-details__data weather-details__data_precipitation_mm">
                    {this.state.weather?.precipitation._attributes.value}
                  </p>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;