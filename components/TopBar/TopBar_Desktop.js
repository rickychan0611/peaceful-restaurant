import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { Button, Transition, Image, Icon, Dropdown, Divider } from 'semantic-ui-react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  openSideMenu as openSideMenuAtom,
  openCheckOutList as openCheckOutListAtom,
  showCheckoutButton as showCheckoutButtonAtom,
  selectedLocation as selectedLocationAtom,
  openDropdownMenu as openDropdownMenuAtom
} from '../../data/atoms.js';
import { user as userAtom } from '../../data/userAtom';
import { orderItems as orderItemsAtom } from '../../data/orderAtoms.js';
import useTranslation from 'next-translate/useTranslation';
import Dimmer from '../Dimmer';
import { useCookies } from 'react-cookie';
import LocationDropDownMenu from '../LocationDropDownMenu';

const TopBar_Desktop = ({ locales, changeLocale }) => {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userAtom);
  const orderItems = useRecoilValue(orderItemsAtom);
  const showCheckoutButton = useRecoilValue(showCheckoutButtonAtom);
  const [openSideMenu, setOpenSideMenu] = useRecoilState(openSideMenuAtom);
  const [openCheckOutList, setOpenCheckOutList] = useRecoilState(openCheckOutListAtom);
  const [selectedLocation, setSelectedLocation] = useRecoilState(selectedLocationAtom);
  const [openDropdownMenu, setOpenDropdownMenu] = useRecoilState(openDropdownMenuAtom);
  const [jiggle, setJiggle] = useState(false);
  const { t } = useTranslation('home');
  const [cookies, setCookie, removeCookie] = useCookies();
  const [qty, setQty] = useState(0);

  useEffect(() => {
    if (orderItems && orderItems.length !== 0) {
      let q = 0;
      orderItems.forEach((item) => {
        q = q + item.quantity;
      });
      setQty(q);
    }
    else setQty(0)
  },[orderItems]);
  useEffect(() => {
    setJiggle(!jiggle);
  }, [orderItems]);

  useEffect(() => {
    console.log('showCheckoutButton', showCheckoutButton);
  }, [showCheckoutButton]);

  return (
    <>
      {openDropdownMenu && <Dimmer state={openDropdownMenu} close={setOpenDropdownMenu} />}

      <Row style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>
        <Image src="/peaceful-logo.png" style={{ margin: 4 }} />
      </Row>
      <Row>
        <Item
          onClick={() => {
            setOpenDropdownMenu(null);
            router.push('/');
          }}>
          <Icon name="home" size="large" />
          <H4>{t('home')}</H4>
        </Item>


        {/* Menu */}
        <div style={{ position: 'relative' }}>
          <Item
            onClick={() => {
              !openDropdownMenu ? setOpenDropdownMenu('menu') : setOpenDropdownMenu(false);
            }}>
            <Icon name="bars" size="large" />
            <H4>{t('Menu')}</H4>
          </Item>
          {openDropdownMenu === 'menu' && (
            <LocationDropDownMenu setOpenDropdownMenu={setOpenDropdownMenu}/>
          )}
        </div>
        <Item
          onClick={() => {
            setOpenDropdownMenu(null);
            router.push('/location');
          }}>
          <Icon name="marker" size="large" />
          <H4>{t('locations')}</H4>
        </Item>
        {!user ? (
          <>
            <Item>
              <div onClick={() => router.push('/sign-up')}>
                <H4 style={{ marginRight: 20 }}>
                  <Icon name="user" size="large" />
                  {t('signUp')}
                </H4>
              </div>
              <div onClick={() => router.push('/sign-in')}>
                <H4>
                  <Icon name="sign in" size="large" />
                  {t('signIn')}
                </H4>
              </div>
            </Item>
          </>
        ) : (
          <>
            {/* USER MENU */}
            <div style={{ position: 'relative' }}>
              <Item
                onClick={() => {
                  setOpenDropdownMenu('user');
                }}>
                <Icon name="user circle" size="large" />
                <H4>Hi, {user.first_name}</H4>
              </Item>

              {openDropdownMenu === 'user' && (
                <DropDownContainer>
                  <DropDownMenu>
                    <MenuItem
                      className="front"
                      onClick={() => {
                        router.push('/consumer/orders');
                        setOpenDropdownMenu(false);
                      }}>
                      My Orders
                    </MenuItem>

                    <MenuItem
                      className="front"
                      onClick={() => {
                        router.push('/consumer/edit-profile');
                        setOpenDropdownMenu(false);
                      }}>
                      My Account
                    </MenuItem>

                    <MenuItem
                      last
                      className="last"
                      onClick={() => {
                        removeCookie('userToken');
                        localStorage.removeItem('user');
                        setUser(null);
                        router.push('/');
                        setOpenSideMenu(false);
                        setOpenDropdownMenu(false);
                      }}>
                      Logout
                    </MenuItem>
                  </DropDownMenu>
                </DropDownContainer>
              )}
            </div>
          </>
        )}

        <Item noMinWidth>
          <Dropdown
            // button
            options={locales}
            direction="left"
            style={{ margin: '0 20px 0 10px' }}
            onChange={changeLocale}
            value={router.locale}
          />
        </Item>

        <Transition animation="jiggle" duration={600} visible={jiggle}>
          {showCheckoutButton && (
            <Button
              style={{
                backgroundColor: '#adc90f',
                marginRight: 10,
                color: '#9c0404',
                width: 90,
                borderRadius: 30
              }}
              onClick={() => setOpenCheckOutList(!openCheckOutList)}>
              <Icon name="shop" /> {" "} {qty}
            </Button>
          )}
        </Transition>
      </Row>
    </>
  );
};

const DropDownContainer = styled.div`
  position: absolute;
  z-index: 10;
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 5px;
  cursor: pointer;
`;
const DropDownMenu = styled.div`
  background-color: white;
  justify-content: center;
  width: 100%;
  max-width: 500px;
  border: 1px solid #adadad;
  border-radius: 0px 0px 15px 15px;
  text-align: left;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  .front:hover {
    background-color: #bebe51;
  }
  .last:hover {
    background-color: #bebe51;
    border-radius: 0px 0px 15px 15px;
  }
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
`;
const Item = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #cacaca;
  height: 100%;
  padding: 10px 20px 10px 20px;
  cursor: pointer;
  color: #ffffff;
  min-width: ${(p) => !p.noMinWidth && '150px'};
`;
const H4 = styled.h4`
  margin: 0;
  display: flex;
  justify-content: space-between;
`;
const MenuItem = styled.h4`
  margin: 0;
  display: flex;
  justify-content: space-between;
  padding: 15px 10px 15px 10px;
  border-bottom: ${(p) => !p.last && '1px solid #b3b3b3'};
  background-color: ${(p) => p.selected && '#bebe51'};
  border-radius: ${(p) => p.selected && p.last && '0px 0px 15px 15px'};
`;

export default TopBar_Desktop;
