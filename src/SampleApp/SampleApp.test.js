import React from 'react';
import ReactDOM from 'react-dom';
import SampleApp from './SampleApp';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SampleApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
