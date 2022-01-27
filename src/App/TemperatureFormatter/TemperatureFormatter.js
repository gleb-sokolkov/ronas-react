import './temperatureFormatter.scss'
import { Component } from 'react';
import { config } from 'config';

class TemperatureFormatter extends Component {
  render() {
    return (
      <div className="temperature-formatter main-nav__temperature-formatter secondary">
        { 
          config.units.map((value, i) => (
            <button 
              key={i}
              className={`btn temperature-formatter__item ${
                this.props.getUnits() === value
                ? "temperature-formatter__item_selected"
                : ""
              }`} 
              onClick={() => {
                this.props.setUnits(value);
              }}>
                {value}
            </button>
          ))
        }
      </div>
    );
  }
}

export { TemperatureFormatter };