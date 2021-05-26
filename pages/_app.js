import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import '../.semantic/dist/semantic.min.css';
import './styles.css';
import { CookiesProvider, useCookies } from 'react-cookie';
import axios from 'axios';
import { HOST_URL } from '../env';
import { RecoilRoot, useRecoilState } from 'recoil';
import { appReady as appReadyAtom } from '../data/atoms';
import { user as userAtom, userdata } from '../data/userAtom';
import { orderItems as orderItemsAtom } from '../data/orderAtoms.js';
import { currentPosition as currentPositionAtom, addresses as addressAtom } from '../data/atoms';

import SideMenu from '../components/SideMenu';
import CheckOutListPusher from '../components/CheckOutListPusher';
import TopBar from '../components/TopBar';
import GooglePlacesAutocomplete, { geocodeByLatLng } from 'react-google-places-autocomplete';
import { MAP_API } from '../env';

import { validateAddress } from '../components/CurrentAddress/CurrentAddress';

const InitApp = ({ children }) => {
  const router = useRouter();
  const [appReady, setAppReady] = useRecoilState(appReadyAtom);
  const [user, setUser, userdata] = useRecoilState(userAtom);
  const [cookies, setCookie, removeCookie] = useCookies();
  const [, setOrderItems] = useRecoilState(orderItemsAtom);
  const [addresses, setAddresses] = useRecoilState(addressAtom);
  const [currentPosition, setCurrentPosition] = useRecoilState(currentPositionAtom);

  // initial app
  useEffect(async () => {
    console.log('initiate');
    //check user cookie

    if (!cookies.userToken) {
      console.log('cookies not found');
      setUser();
      localStorage.removeItem('user');
      setAppReady(true);
    } else if (cookies.userToken) {
      //login user and store user in localstorage
      const getUser = await axios.get(HOST_URL + '/api/user/info', {
        headers: { Authorization: cookies.userToken }
      });
      console.log('USER DATA', getUser.data);

      // if (getUser.data === 'token invalid') {
      // removeCookie('userToken');
      // localStorage.removeItem('user');
      // setUser(null);
      // setAddresses(null);
      // router.push('/sign-in');
      // setAppReady(true);
      // } else {
      localStorage.setItem('user', JSON.stringify(getUser.data));
      setUser(getUser.data);
      setAddresses(getUser.data.addresses);
      setAppReady(true);
      // }
    }
    //orderItems localstorage
    const orderItems = localStorage.getItem('orderItems');
    orderItems ? setOrderItems(JSON.parse(orderItems)) : setOrderItems([]);

    //currentPosition localstorage
    const localStoragePosition = localStorage.getItem('currentPosition');
    // console.log(currentPosition);

    // if (!localStoragePosition) {
    function showPosition(position) {
      console.log(
        'Latitude: ' + position.coords.latitude + 'Longitude: ' + position.coords.longitude
      );
      geocodeByLatLng({ lat: position.coords.latitude, lng: position.coords.longitude })
        .then(async (results) => {
          console.log('GPS location: ', results);

          const body = {
            detail_address: results[2].address_components[0].long_name, 
            city:  results[2].address_components[1].long_name
          }

          setCurrentPosition(body);
          console.log('GPS location body: ', body);
        })
        .catch((error) => console.error(error));
    }

    function error(err) {
      console.log(err);
      alert(
        'Please enable geolocation of your browser, so that we can find restaurants close to you :)'
      );
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, error);
    } else {
      console.log('blocked');
    }

    // }
    // else {
    //   console.log(localStoragePosition);
    //   setCurrentPosition(JSON.parse(localStoragePosition));
    // }
  }, []);

  return children;
};

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <CookiesProvider>
        <InitApp>
          <Head>
            <title>Peaceful Mall Restaurant</title>
            <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
            <script
              type="text/javascript"
              src={'https://maps.googleapis.com/maps/api/js?key=' + MAP_API + '&libraries=places'}
            />
          </Head>
          <TopBar />
          <div className="contents" style={{ paddingTop: 60, width: '100vw' }}>
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
