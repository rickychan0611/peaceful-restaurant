import React from 'react';
import App from 'next/app';
import { RecoilRoot } from 'recoil';
import '../.semantic/dist/semantic.min.css';
import SideMenu from '../components/SideMenu';
import TopBar from '../components/TopBar';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <RecoilRoot>
        <SideMenu>
          <TopBar/>
          <Component {...pageProps} />
        </SideMenu>
      </RecoilRoot>
    );
  }
}

export default MyApp;
