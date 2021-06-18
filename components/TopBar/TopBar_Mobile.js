import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Modal, Transition, Image, Icon } from 'semantic-ui-react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  openSideMenu as openSideMenuAtom,
  openCheckOutList as openCheckOutListAtom,
  showCheckoutButton as showCheckoutButtonAtom,
  selectedLocation as selectedLocationAtom,
  currentShop as currentShopAtom
} from '../../data/atoms.js';
import { orderItems as orderItemsAtom } from '../../data/orderAtoms.js';
import LocationDropDownMenu from '../LocationDropDownMenu';

const TopBar = () => {
  const router = useRouter();
  const orderItems = useRecoilValue(orderItemsAtom);
  const showCheckoutButton = useRecoilValue(showCheckoutButtonAtom);
  const [openSideMenu, setOpenSideMenu] = useRecoilState(openSideMenuAtom);
  const [openCheckOutList, setOpenCheckOutList] = useRecoilState(openCheckOutListAtom);
  const [currentShop] = useRecoilState(currentShopAtom);
  const [jiggle, setJiggle] = useState(false);
  const [openDropdownMenu, setOpenDropdownMenu] = useState(false);
  const [showMenuButton, setshowMenuButton] = useState('/');

  useEffect(() => {
    setJiggle(!jiggle);
  }, [orderItems]);

  useEffect(() => {
    setshowMenuButton(router.route);
    console.log('router.route', router.route);
  }, [router]);

  useEffect(() => {
    console.log(router);
    console.log('showCheckoutButton', showCheckoutButton);
  }, [showCheckoutButton]);

  return (
    <>
      {/* <Modal open={openDropdownMenu} onClose={() => setOpenDropdownMenu(false)}>
          <LocationDropDownMenu/>
      </Modal> */}
      <div
        style={{ color: 'white', paddingLeft: 10 }}
        onClick={() => setOpenSideMenu(!openSideMenu)}>
        <Icon name="bars" size="large" />
      </div>
      <Logo onClick={() => router.push('/')}>
        <Image src="/peaceful-logo.png" style={{ margin: 4 }} />
      </Logo>
      <div>
        {showMenuButton === '/' || (currentShop && currentShop.status === 4) ? (
          <div style={{ position: 'relative' }}>
            <MenuIconContainer onClick={() => setOpenDropdownMenu(!openDropdownMenu)}>
              {/* <Icon name="file alternate" size="large" /> */}
              <Button
                style={{
                  backgroundColor: '#adc90f',
                  color: '#9c0404',
                  width: 60,
                  // borderRadius: 30,
                  marginLeft: 10,
                  padding: '5px 0 5px 0'
                }}>
                Order Menu
              </Button>
            </MenuIconContainer>
            {openDropdownMenu && <LocationDropDownMenu setOpenDropdownMenu={setOpenDropdownMenu} />}
          </div>
        ) : (
          <>
            {/* // <Transition animation="jiggle" duration={600} visible={jiggle}> */}
            {/* <div style={{ marginTop: 5 }}> */}
            {showCheckoutButton && (
              <div>
                <Button
                  style={{
                    backgroundColor: '#ff614d',
                    color: 'white',
                    width: 60,
                    borderRadius: 30,
                    marginLeft: 10,
                    padding: '10px 0 10px 0'
                  }}
                  onClick={() => setOpenCheckOutList(!openCheckOutList)}>
                  <Icon name="shop" /> {orderItems && orderItems.length}
                </Button>
              </div>
            )}
            {/* </div> */}
            {/* </Transition> */}
          </>
        )}
      </div>
    </>
  );
};

const MenuIconContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  color: white;
`;
const Logo = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
`;

export default TopBar;
