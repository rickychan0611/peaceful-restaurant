import { useEffect, useState } from 'react';
import { Container, Dimmer, Loader, Modal, Button, Header, Icon } from 'semantic-ui-react';
import Head from 'next/head';
import axios from 'axios';
import { HOST_URL } from '../../../env';
import { useIsDesktop } from '../../../util/useScreenSize';
import styled from 'styled-components';
import useIsShopOpen from '../../../util/useIsShopOpen';
import addresses from '../../../addresses';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import {
  currentShop as currentShopAtom,
  currentShopProducts as currentShopProductsAtom
} from '../../../data/atoms';

import Shop_Desktop from '../../../components/Shop/Shop_Desktop';
import Shop_Mobile from '../../../components/Shop/Shop_Mobile';
import router from 'next/router';

const shop = ({ getSingleShop, getShopProducts }) => {
  const isDesktop = useIsDesktop();
  const [currentShop, setCurrentShop] = useRecoilState(currentShopAtom);
  const [, setCurrentShopProducts] = useRecoilState(currentShopProductsAtom);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const index = addresses.findIndex((item) => +item.id === +router.query.shop_id);
  const isShopOpen = router && useIsShopOpen(addresses[index].open_hours);
  const [shopStatus, setShopStatus] = useState(true);

  useEffect(async () => {
    setCurrentShop(getSingleShop);
    setCurrentShopProducts(getShopProducts);
    console.log('Single shop', getSingleShop);
    console.log('getShopProducts', getShopProducts);

    //update shop status
    const getShop = await axios.get(HOST_URL + '/api/singleshop', {
      params: { shop_id: getSingleShop.id }
    });
    setCurrentShop(getShop.data.data);
  }, [getSingleShop]);

  return (
    <>
      {currentShop && currentShop.status === 4 && (
        <div style={{ position: 'fixed', top: 0, width: '100%', height: '100vh', zIndex: 1000 }}>
          <Dimmer active={currentShop && currentShop.status === 4}>
            <Header icon>
              <h1 style={{ fontSize: 50, marginBottom: 30 }}>😅</h1>
              <h4 style={{ color: 'white' }}>Sorry, this location is temporarily closed.</h4>
              <Button
                color="green"
                inverted
                style={{ marginTop: 60 }}
                onClick={() => {
                  router.push('/');
                }}>
                Back to home
              </Button>
            </Header>
          </Dimmer>
        </div>
      )}

      <div>
        {!isShopOpen && (
          <MessageContainer>
            <div>
              <Icon name="warning circle" />
              This store is now closed. Open hours: Mon - Sun, 11am - 9pm
            </div>
          </MessageContainer>
        )}

        <Head>
          <title>{currentShop && currentShop.name}</title>
        </Head>
        <Container>
          {!currentShop || currentShop === 'not found' ? (
            <div style={{ height: '80vh' }}>
              <Dimmer inverted active={!currentShop}>
                <Loader active content="Loading" />
              </Dimmer>
            </div>
          ) : isDesktop ? (
            <Shop_Desktop />
          ) : (
            <>
              <Shop_Mobile />
            </>
          )}
        </Container>
        {/* {currentShop && <Footer />} */}
      </div>
    </>
  );
};

export const getStaticProps = async (context) => {
  const getSingleShop = await axios.get(HOST_URL + '/api/singleshop', {
    params: { shop_id: context.params.shop_id }
  });

  const getShopProducts = await axios.get(HOST_URL + '/api/shopproducts', {
    params: {
      shop_id: context.params.shop_id,
      category_id: 'all'
    }
  });

  return {
    props: {
      getSingleShop: getSingleShop.data.data,
      getShopProducts: getShopProducts.data.data
    }
  };
};

export const getStaticPaths = async () => {
  return {
    paths: [
      { params: { shop_id: '1', slug: 'Broadway' }, locale: 'en' },
      { params: { shop_id: '2', slug: 'Kitsilano' }, locale: 'en' },
      { params: { shop_id: '3', slug: 'Richmond' }, locale: 'en' },
      { params: { shop_id: '4', slug: 'Port Coquitlam' }, locale: 'en' },
      { params: { shop_id: '5', slug: 'Kingsway' }, locale: 'en' },
      { params: { shop_id: '6', slug: 'Seymour' }, locale: 'en' },
      { params: { shop_id: '7', slug: 'Newton' }, locale: 'en' },
      { params: { shop_id: '8', slug: 'Mount Pleasant' }, locale: 'en' },
      { params: { shop_id: '1', slug: 'Broadway' }, locale: 'zh-CN' },
      { params: { shop_id: '2', slug: 'Kitsilano' }, locale: 'zh-CN' },
      { params: { shop_id: '3', slug: 'Richmond' }, locale: 'zh-CN' },
      { params: { shop_id: '4', slug: 'Port Coquitlam' }, locale: 'zh-CN' },
      { params: { shop_id: '5', slug: 'Kingsway' }, locale: 'zh-CN' },
      { params: { shop_id: '6', slug: 'Seymour' }, locale: 'zh-CN' },
      { params: { shop_id: '7', slug: 'Newton' }, locale: 'zh-CN' },
      { params: { shop_id: '8', slug: 'Mount Pleasant' }, locale: 'zh-CN' }
    ],
    fallback: false
  };
};

const MessageContainer = styled.div`
  background-color: #eeee8a;
  color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  padding: 10px;
  height: 40px;
`;

export default shop;
