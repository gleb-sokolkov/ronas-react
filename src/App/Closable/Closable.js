import './closable.scss';
import { Component } from "react";

class Closable extends Component {
  render() {
    return (
      <div className={`closable ${this.props.className}`}>
        <p className="closable__message">{this.props.message}</p>
        <button 
          className="btn btn_theme_blue closable__btn" 
          onClick={this.props.callback}>OK</button>
      </div>
    );
  }
}

export { Closable };