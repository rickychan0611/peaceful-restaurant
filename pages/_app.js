import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import '../.semantic/dist/semantic.min.css';
import './styles.css';
import { CookiesProvider, useCookies } from 'react-cookie';
import axios from 'axios';

import { RecoilRoot, useRecoilState } from 'recoil';
import { appReady as appReadyAtom } from '../data/atoms';
import { user as userAtom, userdata } from '../data/userAtom';
import { orderItems as orderItemsAtom } from '../data/orderAtoms.js';
import { currentPosition as currentPositionAtom, addresses as addressAtom } from '../data/atoms';
import { currentTime as currentTimeAtom } from '../data/atoms.js';

import SideMenu from '../components/SideMenu';
import CheckOutListPusher from '../components/CheckOutListPusher';
import TopBar from '../components/TopBar';
import GooglePlacesAutocomplete, { geocodeByLatLng } from 'react-google-places-autocomplete';

import { validateAddress } from '../components/CurrentAddress/CurrentAddress';

import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress

import useCurrentTime from '../util/useCurrentTime';

//Binding events for NProgress bar //
NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const InitApp = ({ children }) => {
  const router = useRouter();
  const [appReady, setAppReady] = useRecoilState(appReadyAtom);
  const [user, setUser, userdata] = useRecoilState(userAtom);
  const [cookies, setCookie, removeCookie] = useCookies();
  const [, setOrderItems] = useRecoilState(orderItemsAtom);
  const [addresses, setAddresses] = useRecoilState(addressAtom);
  const [currentPosition, setCurrentPosition] = useRecoilState(currentPositionAtom);
  // const [currentTime, setCurrentTime] = useRecoilState(currentTimeAtom);

  const initialUser = async () => {
    //check user cookie
    if (!cookies.userToken) {
      console.log('cookies not found');
      setUser();
      localStorage.removeItem('user');
      setAppReady(true);
      return;
    } else if (cookies.userToken) {
      //login user and store user in localstorage
      const getUser = await axios.get(process.env.NEXT_PUBLIC_HOST_URL + '/api/user/info', {
        headers: { Authorization: cookies.userToken }
      });
      console.log('USER DATA', getUser);
      if (getUser.data.code === 200) {
        localStorage.setItem('user', JSON.stringify(getUser.data.data));
        setUser(getUser.data.data);
        setAddresses(getUser.data.data.addresses);
        setAppReady(true);
        return;
      }
      else {
        console.log("User Error: " + getUser.data.message);
        removeCookie('userToken');
        setUser();
        localStorage.removeItem('user');
        setAppReady(true);
        return;
      }
      // }
    }
  };

  const initialOrder = () => {
    //check orderItems localstorage
    const orderItems = localStorage.getItem('orderItems');
    orderItems ? setOrderItems(JSON.parse(orderItems)) : setOrderItems([]);
  };

  const initialPosition = () => {
    // //check currentPosition localstorage
    // const localStoragePosition = localStorage.getItem('currentPosition');
    // setCurrentPosition(JSON.parse(localStoragePosition));

    // //if currentPosition localstorage empty, get GPS position. 
    // if (!localStoragePosition) {
    //   console.log('getting GPS location body');

    //   function showPosition(position) {
    //     console.log(
    //       'Latitude: ' + position.coords.latitude + 'Longitude: ' + position.coords.longitude
    //     );

    //     geocodeByLatLng({ lat: position.coords.latitude, lng: position.coords.longitude })
    //       .then(async (results) => {
    //         console.log('GPS location: ', results);

    //         const body = await validateAddress(results[0].address_components, user, true);

    //         // const body = {
    //         //   detail_address: results[2].address_components[0].long_name,
    //         //   city: results[2].address_components[1].long_name,
    //         //   name: ""
    //         // };

    //         console.log('GPS location body: ', body);
    //         setCurrentPosition({...body, lat: position.coords.latitude, lng: position.coords.longitude});
    //       })
    //       .catch((error) => console.error(error));
    //   }

    //   function error(err) {
    //     console.log(err);
    //     alert(
    //       'Please enable geolocation of your browser, so that we can find restaurants close to you :)'
    //     );
    //   }

    //   //Get location from browser, then send to show Poistion function above to get lag lnt and geocode
    //   if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(showPosition, error);
    //   } else {
    //     console.log('GPS access deined');
    //   }
    // }
  };

  useEffect(async () => {
    await initialUser();
    initialOrder();
    initialPosition();
  }, []);

  return children;
};

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <CookiesProvider>
        <InitApp>
          <Head>
            <title>Peaceful Restaurant</title>
            < meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
            <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
          </Head>
          <TopBar />
          <div className="contents" style={{ paddingTop: 80, width: '100vw' }}>
            <SideMenu>
              <CheckOutListPusher>
                <Component {...pageProps} />
              </CheckOutListPusher>
            </SideMenu>
          </div>
        </InitApp>
      </CookiesProvider>
    </RecoilRoot>
  );
}

export default MyApp;
