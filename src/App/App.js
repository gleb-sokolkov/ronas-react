import { Component } from "react";
import { config } from "config";
import './app.scss';
import { mapObject } from "utils/utils";
import { xml2js } from "xml-js";
import { Nav } from "./Nav/Nav";
import { WeatherIcon } from './WeatherIcon/WeatherIcon';
import { Closable } from 'App/Closable/Closable';

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
      firstVisit: true,
    };

    this.setWeatherByCurrentLocation = this.setWeatherByCurrentLocation.bind(this);
    this.setWeatherByCityName = this.setWeatherByCityName.bind(this);
    this.setWeatherWithUnits = this.setWeatherWithUnits.bind(this);
    this.getTemperatureUnits = this.getTemperatureUnits.bind(this);
    this.setAsVisited = this.setAsVisited.bind(this);
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
      delete state.params.q;
      state.params.lat = pos.coords?.latitude || 0;
      state.params.lon = pos.coords?.longitude || 0;
      return state;
    });
    this.setWeatherData();
  }

  async setWeatherByCityName(name) {
    await this.setStateAsync((state) => {
      delete state.params.lat;
      delete state.params.lon;
      state.params.q = name;
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

  setAsVisited() {
    this.setState((state) => ({ ...state, firstVisit: false }));
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
          <div className="app__nav-container">
            {
              this.state.firstVisit
                ? <Closable
                  className="app__current-location"
                  message={this.state.weather?.city._attributes.name}
                  callback={this.setAsVisited}
                />
                : <Nav
                  cityName={this.state.weather?.city._attributes.name}
                  setUnits={this.setWeatherWithUnits}
                  getUnits={this.getTemperatureUnits}
                  current={this.setWeatherByCurrentLocation}
                  setCity={this.setWeatherByCityName} />
            }
          </div>
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