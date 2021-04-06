import * as React from 'react'

import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./AuthContext";
import { SideDrawerProvider } from "./SideDrawerContext";


import ReactGa from 'react-ga'
import { createBrowserHistory } from 'history';

let history = createBrowserHistory()

history.listen((location) => {
  window.ga('set', 'page', location.pathname + location.search);
  window.ga('send', 'pageview');
});

function AppProviders({children}) {
    return (
      <React.StrictMode>
        <AuthProvider>
          <SideDrawerProvider>
            <BrowserRouter history={history}>
              {children}
            </BrowserRouter>
          </SideDrawerProvider>
        </AuthProvider>
      </React.StrictMode>
    )
  }
  
  export default AppProviders