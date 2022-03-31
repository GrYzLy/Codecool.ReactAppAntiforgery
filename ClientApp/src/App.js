import React, { Component } from 'react';
import { FetchData } from './components/FetchData';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
           <FetchData />
      );
  }
}
