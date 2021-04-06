import React, { Suspense, useContext, useEffect } from "react";
import { Route, Switch, withRouter, Redirect, useLocation } from "react-router-dom";

import "App.css"; 

import Home from "pages/Home";
import Layout from "hoc/Layout";
import ItemDetail from "pages/ItemDetail/ItemDetail";

import { AuthContext } from "context/AuthContext";

import { createBrowserHistory } from 'history';
// import initializeReactGA from './InitializeReactGA'
import ReactGA from "react-ga";
import InitializeReactGA from "./helper/googleAnalytics";


function usePageViews() {
	let location = useLocation();
	useEffect(() => {
		InitializeReactGA(ReactGA);
		ReactGA.set({ page: location.pathname });
		ReactGA.pageview(location.pathname);
	}, [location]);
}

function App() {
  const asyncMen = React.lazy(() => import("pages/Men"));
  const asyncWomen = React.lazy(() => import("pages/Women"));
  const asyncKids = React.lazy(() => import("pages/Kids"));
  const asyncSale = React.lazy(() => import("pages/Sale"));
  const asyncLimited = React.lazy(() => import("pages/Limited"));
  const asyncCart = React.lazy(() => import("pages/Cart"));
  const asyncCheckout = React.lazy(() => import("pages/Checkout"));
  const asyncLogin = React.lazy(() => import(/* webpackPrefetch: true */ "pages/Account/Login"));
  const asyncRegister = React.lazy(() => import(/* webpackPrefetch: true */ "pages/Account/Register"));
  const asyncProfile = React.lazy(() => import("pages/Profile"));
  const asyncSearch = React.lazy(() => import("pages/Search"));
  
  const { auth, token, userId } = useContext(AuthContext);
  const [isAuth, setIsAuth] = auth;
  const [, setTokenValue] = token;
  const [, setUserIdValue] = userId;
  
  usePageViews()

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    const localUserId = localStorage.getItem("userId");
    const expiryDate = localStorage.getItem("expiryDate");
    const setAutoLogout = (milliseconds) => {
      setTimeout(() => {
        setIsAuth(false);
        setTokenValue(false);
        localStorage.removeItem("token");
        localStorage.removeItem("expiryDate"); 
        localStorage.removeItem("userId");
        return;
      }, milliseconds);
    };
    if (!localToken || !expiryDate) {
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      setIsAuth(false);
      setTokenValue(false);
      localStorage.removeItem("token");
      localStorage.removeItem("expiryDate");
      localStorage.removeItem("userId");
      return;
    }
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    setIsAuth(true);
    setTokenValue(localToken);
    setUserIdValue(localUserId);
    setAutoLogout(remainingMilliseconds);
  }, [setIsAuth, setTokenValue, setUserIdValue]);


  let routes = (
    <Suspense fallback={<div className="loader">Loading...</div>}>
      <Switch>
        <Route path="/men" exact component={asyncMen} />
        <Route path="/women" exact component={asyncWomen} />
        <Route path="/kids" exact component={asyncKids} />
        <Route path="/sale" exact component={asyncSale} />
        <Route path="/limited" exact component={asyncLimited} />
        <Route path="/login" exact component={asyncLogin} />
        <Route path="/register" exact component={asyncRegister} />
        <Route path="/search" exact component={asyncSearch} />
        <Route path="/item/:id" exact component={ItemDetail} />
        <Route path="/" exact component={Home} />
        <Redirect to="/" />
      </Switch>
    </Suspense>
  );
  if (isAuth) {
    routes = (
      <Suspense fallback={<div className="loader">Loading...</div>}>
        <Switch>
          <Route path="/men" exact component={asyncMen} />
          <Route path="/women" exact component={asyncWomen} />
          <Route path="/kids" exact component={asyncKids} />
          <Route path="/sale" exact component={asyncSale} />
          <Route path="/limited" exact component={asyncLimited} />
          <Route path="/cart" exact component={asyncCart} />
          <Route path="/checkout" exact component={asyncCheckout} />
          <Route path="/profile" exact component={asyncProfile} />
          <Route path="/search" exact component={asyncSearch} />
          <Route path="/item/:id" exact component={ItemDetail} />
          <Route path="/" exact component={Home} />
          <Redirect to="/" />
        </Switch>
      </Suspense>
    );
  }

  return (
    <div className="App" alt="App">
      <Layout>{routes}</Layout>
    </div>
  );
}

export default withRouter(App);
