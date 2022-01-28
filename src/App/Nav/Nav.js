import './nav.scss';
import { Component } from "react";
import { MetricSelector } from "App/MetricSelector/MetricSelector";

class Nav extends Component {
  constructor() {
    super();
    this.state = {
      form: 'hidden',
      city: '',
      disabled: true,
    };
    this.changeCity = this.changeCity.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setFormClass(className) {
    this.setState(state => {
      state.form = className;
      return state;
    });
  }

  setClickable(event) {
    const cond = event.target.value === '';
    this.setState(state => {
      state.disabled = cond;
      return state;
    });  
  }

  changeCity(event) {
    this.setState(state => {
      state.city = event.target.value;
      return state;
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setFormClass('hidden');
    this.props.setCity(this.state.city);
  }

  render() {
    return (
      <nav className={`nav ${this.props.className}`}>
        <div className="nav__title-block">
          <h2 className="h2 nav__title">{this.props.cityName}</h2>
          <MetricSelector 
            setUnits={this.props.setUnits} 
            getUnits={this.props.getUnits} 
            className="nav__metric-selector secondary"/>
        </div>
        <div className="location-selector nav__location-selector secondary">
          <button
            className="btn location-selector__selector"
            onClick={() => this.setFormClass('visible')}>
            Сменить город
          </button>
          <div className="location-selector__current">
            <button
              className="btn location-selector__location"
              onClick={this.props.current}>
              <img className="location-selector__icon" src={require('icons/other/location.svg').default} alt="location" />
              <span className="location-selector__label">Моё местоположение</span>
            </button>
          </div>
        </div>
        <form
          action="POST"
          className={`form nav__search-form nav__search-form_${this.state.form}`}
          onSubmit={this.handleSubmit}>
          <input
            className="input form__input nav__search-input"
            type="text"
            placeholder="Желаемый адрес"
            onChange={(e) => {
              this.setClickable(e);
              this.changeCity(e);
            }} />
            <div className="form__actions">
              <button className="btn form__submit" type="submit" disabled={this.state.disabled}>Сменить</button>
              <button className="btn" type="button" onClick={() => this.setFormClass('hidden')}>Отмена</button>
            </div>
        </form>
      </nav>
    );
  }
}

export { Nav };