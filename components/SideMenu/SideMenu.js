import { useRouter } from 'next/router';
import { Icon, Menu, Sidebar } from 'semantic-ui-react';
import { useRecoilState } from 'recoil';
import { openSideMenu as openSideMenuAtom } from '../../data/atoms.js';
import styled from 'styled-components';
import { user as userAtom } from '../../data/userAtom.js';
import { useCookies } from 'react-cookie';
import { locales, changeLocale } from '../TopBar/TopBar';
import useTranslation from 'next-translate/useTranslation';
import { selectedLocation as selectedLocationAtom } from '../../data/atoms.js';
import { openSwitchLocationModal as openSwitchLocationModalAtom } from '../../data/atoms.js';
import { orderItems as orderItemsAtom } from "../../data/orderAtoms.js";
import addresses from '../../addresses';
import SwitchLocationModal from "../SwitchLocationModal";

const SidebarMenu = () => {
  const router = useRouter();
  const [openSideMenu, setOpenSideMenu] = useRecoilState(openSideMenuAtom);
  const [user, setUser] = useRecoilState(userAtom);
  const [cookies, setCookie, removeCookie] = useCookies();
  const { t } = useTranslation('home');
  const [selectedLocation, setSelectedLocation] = useRecoilState(selectedLocationAtom);
  const [, setOpenSwitchLocationModal] = useRecoilState(openSwitchLocationModalAtom);
  const [orderItems, setOrderItems] = useRecoilState(orderItemsAtom);

  const handleClick = (name) => {
    router.push(name);
    setOpenSideMenu(false);
  };

  return (
    <Sidebar
      as={Menu}
      animation="overlay"
      // icon="labeled"
      onHide={() => setOpenSideMenu(false)}
      vertical
      visible={openSideMenu}
      style={{
        backgroundColor: 'white',
        position: 'fixed',
        boxShadow: '10px 0px 25px rgba(0, 0, 0, .3)',
        padding: '100px 10px 10px 10px'
      }}>
      <Icon
        name="close"
        size="large"
        style={{ marginLeft: 10, marginBottom: 20, cursor: 'pointer' }}
        onClick={() => setOpenSideMenu(false)}
      />

      <Menu.Item onClick={() => handleClick('/')}>
        <Icon name="home" size="large" />
        <H4>{t('home')}</H4>
      </Menu.Item>

      <Menu.Item>
        {/* <Menu.Header>Food Menus</Menu.Header> */}
        <Menu.Menu>
          {addresses.map((item, i) => {
            return (
              <Menu.Item key={i}
                onClick={() => {
                  if (
                    orderItems.length === 0 ||
                    (orderItems[0] && orderItems[0].shop.id) === item.id
                  ) {
                    router.push('/shop/' + item.name + '/' + item.id);
                    setOpenSideMenu(false)
                    setSelectedLocation(item);
                  }
                  else {
                    setOpenSwitchLocationModal({open: true, item})
                  }
                }}>
                <Icon name="chevron right" size="large" />
                <H4>{item.name}</H4>
              </Menu.Item>
            )
          })}
        </Menu.Menu>
      </Menu.Item>

      <Menu.Item onClick={() => handleClick('/location')}>
        <Icon name="marker" size="large" />
        <H4>{t('locations')}</H4>
      </Menu.Item>

      {!user ? (
        <>
          <Menu.Item onClick={() => handleClick('/sign-in')}>
            <Icon name="sign in" size="large" />
            <H4>{t('signIn')}</H4>
          </Menu.Item>
          <Menu.Item onClick={() => handleClick('/sign-up')}>
            <Icon name="signup" size="large" />
            <H4>{t('signUp')}</H4>
          </Menu.Item>
        </>
      ) : (
        <>
          <Menu.Item onClick={() => handleClick('/consumer/orders')}>
            <Icon name="file alternate outline" size="large" />
            <H4>{t('Orders')}</H4>
          </Menu.Item>

          <Menu.Item onClick={() => handleClick('/consumer/edit-profile')}>
            <Icon name="user circle" size="large" />
            <H4>{t('account')}</H4>
            <p style={{ margin: 0, color: 'grey' }}>{user.first_name}</p>
          </Menu.Item>

          <Menu.Item
            onClick={() => {
              removeCookie('userToken');
              localStorage.removeItem('user');
              setUser(null);
              router.push('/');
              setOpenSideMenu(false);
            }}>
            <Icon name="sign out" size="large" />
            <H4>{t('signOut')}</H4>
          </Menu.Item>
        </>
      )}

      <Menu.Item>
        <Row>
          {/* <H4>Language</H4> */}
          {locales.map((item) => {
            // console.log("item", activeItem)
            return (
              <LocaleBtn
                key={item.key}
                selected={router.locale === item.value}
                onClick={() => changeLocale(true, { value: item.value })}>
                {item.text}
              </LocaleBtn>
            );
          })}
        </Row>
      </Menu.Item>
    </Sidebar>
  );
};

const SideMenu = ({ children }) => {
  const [openSideMenu, setOpenSideMenu] = useRecoilState(openSideMenuAtom);
  return (
    <>
      <Sidebar.Pushable style={{ transform: 'none', overflow: 'hidden' }}>
      <SwitchLocationModal/>
        <SidebarMenu />
        <Sidebar.Pusher dimmed={openSideMenu}>{children}</Sidebar.Pusher>
      </Sidebar.Pushable>
    </>
  );
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
`;
const LocaleBtn = styled.div`
  background-color: ${(p) => (p.selected ? '#a5a5a5' : 'white')};
  color: ${(p) => (!p.selected ? '#7c7c7c' : 'white')};
  border: 1px solid #a5a5a5;
  border-radius: 15px;
  padding: 8px 15px 8px 15px;
  font-size: 12px;
  font-weight: bold;
  min-width: 80px;
  text-align: center;
`;
const H4 = styled.h4`
  margin: 0;
  display: flex;
  justify-content: space-between;
`;
const Item = styled(Menu.Item)`
  display: flex;
  justify-content: center;
  align-items: center;
`;
export default SideMenu;
