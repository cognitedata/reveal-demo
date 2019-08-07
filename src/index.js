import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import SampleApp from './SampleApp/SampleApp.tsx';
import {BrowserRouter as Router} from 'react-router-dom';
import {Route} from 'react-router';
import Authentication from './Authentication/Authentication.tsx';

ReactDOM.render(
 <Router>
  <div>
    <Route exact path = '/' component = {Authentication}/>
    <Route exact path='/sampleApp' component={SampleApp}/>
  </div>
</Router>,
document.getElementById('root'));

{/* <Router>
  <div>
    <Route exact path = '/' component = {Authentication}/>
    <Route exact path='/sampleApp' component={SampleApp}/>
  </div>
</Router>, */}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
