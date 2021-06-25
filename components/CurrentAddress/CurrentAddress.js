import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useIsMobile } from '../../util/useScreenSize';
import { useIsDesktop } from '../../util/useScreenSize';
import useTranslation from 'next-translate/useTranslation';
import { getAddressesQuery } from '../../pages/consumer/edit-profile';
import { Button, Divider, Icon, Radio } from 'semantic-ui-react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  currentPosition as currentPositionAtom,
  addresses as addressAtom,
  useDefaultAddress as useDefaultAddressAtom
} from '../../data/atoms';
import LocationInput from '../LocationInput';
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
  geocodeByLatLng
} from 'react-google-places-autocomplete';

import { useCookies } from 'react-cookie';
import { user as userAtom } from '../../data/userAtom';

export const validateAddress = (address, user, initial) => {
  return new Promise((resolve, reject) => {
    let obj = !initial
      ? {
          type: 'create',
          default_status: 0,
          name: user.first_name + ' ' + user.last_name
        }
      : { name: '' };

    console.log('address', address);
    const street_number = address.findIndex((item) => item.types[0] === 'street_number');
    if (street_number === -1 && !initial) {
      throw 'no street number';
    }
    const route = address.findIndex((item) => item.types[0] === 'route');
    if (route === -1 && !initial) {
      throw 'no street name';
    }
    address.forEach((item, i) => {
      console.log(item.types[0]);
      let name = item.long_name;
      if (item.types[0] === 'street_number') {
        obj.detail_address = name;
      }
      if (item.types[0] === 'route') {
        obj.detail_address = obj.detail_address ? obj.detail_address + ' ' + name : name;
      }
      if (item.types[0] === 'locality') {
        obj.city = name;
      }
      if (item.types[0] === 'administrative_area_level_1') {
        obj.province = name;
      }
      if (item.types[0] === 'country') {
        obj.country = name;
      }
      if (item.types[0] === 'postal_code') {
        obj.post_code = name;
      }
    });
    console.log('objobjobj', obj);
    resolve(obj);
  });
};

const CurrentAddress = () => {
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  const [currentPosition, setCurrentPosition] = useRecoilState(currentPositionAtom);
  const { t } = useTranslation('home');
  const [openAddressMenu, setOpenAddressMenu] = useState(false);
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(null);
  const [user, setUser] = useRecoilState(userAtom);
  const [cookies] = useCookies(null);
  const [addresses, setAddresses] = useRecoilState(addressAtom);
  const [useDefaultAddress, setUseDefaultAddress] = useRecoilState(useDefaultAddressAtom);
  const [openNew, setOpenNew] = useState(false);
  const [color, setColor] = useState(0);
  const [err, setErr] = useState(false);

  const addAddressQuery = async () => {
    console.log(value);
    setErr(false);
    setLoading(true);
    try {
      const results = await geocodeByAddress(value.label);
      console.log('restult:', results[0]);

      const body = await validateAddress(results[0].address_components, user);
      console.log('current address body:', body);

      await axios.post(process.env.NEXT_PUBLIC_HOST_URL + '/api/user/address/set', body, {
        headers: { Authorization: cookies.userToken }
      });

      const newAddresses = await axios.get(process.env.NEXT_PUBLIC_HOST_URL + '/api/user/address', {
        headers: { Authorization: cookies.userToken }
      });
      setAddresses(newAddresses.data.data);
      setLoading(false);
      setOpenNew(false);
      colorChange();
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErr(true);
    }
  };

  const colorChange = () => {
    let i = 100;
    const countDown = setInterval(() => {
      i--;
      setColor(i / 100);
      if (i <= 0) clearInterval(countDown);
    }, 10);
  };

  // useEffect(() => {
  //   console.log(color);
  //   console.log('currentPosition');
  // }, [color]);

  return (
    <>
      <>
        <CurrentAddressContainer
          isMobile={isMobile}
          onClick={() => setOpenAddressMenu(!openAddressMenu)}>
          <div>
            <Icon name="map marker alternate" size="large" style={{ marginRight: 10 }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <Address isMobile={isMobile}>
              <span style={{ fontSize: 12 }}>
                {currentPosition ? t('currentAddress') : t('chooseAddress')}
              </span>
              {isMobile && <br />}
              <span>
                {' '}
                {currentPosition &&
                  currentPosition.detail_address + ', ' + currentPosition.city}{' '}
                {/* {useDefaultAddress
                    ? useDefaultAddress.detail_address + ', ' + useDefaultAddress.city
                    : currentPosition.address}{' '} */}
              </span>
            </Address>
          </div>
          <div>
            <Icon
              name={openAddressMenu ? 'chevron up' : 'chevron down'}
              style={{ marginLeft: 10 }}
            />
          </div>
        </CurrentAddressContainer>
      </>

      {openAddressMenu && (
        <AddAddressContainer>
          <AddAddressMenu>
            <ChooseAddressContainer>
              {addresses &&
                addresses[0] &&
                addresses.map((address, i) => {
                  if (address.detail_address) {
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          // setUseDefaultAddress(address);
                          setCurrentPosition(address);
                          localStorage.setItem('currentPosition', JSON.stringify(address));
                          setOpenAddressMenu(false);
                          console.log(
                            'address',
                            address.detail_address + ', ' + address.city + ', ' + address.province
                          );
                        }}
                        style={{ backgroundColor: i === 0 && 'rgba(255, 241, 82,' + color + ')' }}>
                        <H4
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: 10,
                            borderBottom: '1px solid #dbdbd7'
                          }}>
                          <Radio checked={address === currentPosition} style={{ marginRight: 7 }} />
                          {address.detail_address}, {address.city}
                        </H4>
                      </div>
                    );
                  }
                })}
            </ChooseAddressContainer>
            <LocationInputContainer>
              <H4 style={{ marginBottom: 6 }} onClick={() => setOpenNew(!openNew)}>
                <a>+ Add a new address</a>
              </H4>
              {openNew && (
                <>
                  <IuputWrapper>
                    <LocationInput value={value} setValue={setValue} />
                  </IuputWrapper>
                  <Button
                    loading={loading}
                    onClick={async () => {
                      await addAddressQuery();
                      setValue();
                    }}>
                    Add address
                  </Button>
                  {err && (
                    <div style={{ color: 'red', marginTop: 5 }}>
                      Oops! The address you entered is not accurate enough.
                      <br />
                      Try adding a place, a street and house number.
                    </div>
                  )}
                </>
              )}
            </LocationInputContainer>
          </AddAddressMenu>
        </AddAddressContainer>
      )}
    </>
  );
};

const LocationInputContainer = styled.div`
  padding: 10px;
`;
const ChooseAddressContainer = styled.div`
  text-align: left;
`;
const IuputWrapper = styled.div`
  border: 1px solid #d4d4d4;
  margin-bottom: 10px;
`;
const AddAddressContainer = styled.div`
  position: absolute;
  z-index: 10000;
  display: flex;
  justify-content: center;
  width: 100%;
`;
const AddAddressMenu = styled.div`
  background-color: white;
  justify-content: center;
  width: 94%;
  max-width: 500px;
  border: 1px solid #adadad;
  border-radius: 0px 0px 15px 15px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;
const CurrentAddressContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: ${(p) => (p.isMobile ? 'space-between' : 'center')};
  align-items: center;
  text-align: center;
  padding: 5px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 48px;
  padding: 0 10px 0 10px;
  /* border-bottom: 1px solid #b9b8b8; */
  padding-bottom: 5px;
  padding-top: 3px;
  background-color: white;
  position: relative;
  cursor: pointer;
`;
const Address = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;
const H4 = styled.h4`
  margin: 0 0 10px 0;
`;
export default CurrentAddress;
