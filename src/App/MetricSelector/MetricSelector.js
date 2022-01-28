import './metricSelector.scss'
import { Component } from 'react';
import { config } from 'config';

class MetricSelector extends Component {
  render() {
    return (
      <div className={`metric-selector ${this.props.className}`}>
        { 
          config.units.map((value, i) => (
            <button 
              key={i}
              className={`btn metric-selector__item ${
                this.props.getUnits() === value
                ? "metric-selector__item_selected"
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

export { MetricSelector };