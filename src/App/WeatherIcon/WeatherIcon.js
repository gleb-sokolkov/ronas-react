import { Component } from 'react';
import { mapIcons } from "utils/utils";

class WeatherIcon extends Component {
  constructor() {
    super();
    this.state = {};
    this.state.icons = mapIcons(require.context('/src/icons'), false, /\.svg$/);
  }

  getIcon(value) {
    return this.state.icons?.[value] || this.state.icons['default'];
  }

  render() {
    return (
      <img 
        className="weather-display__icon" 
        src={this.getIcon(this.props.value)} 
        alt={this.props.value} />
    );
  }
}

export { WeatherIcon };