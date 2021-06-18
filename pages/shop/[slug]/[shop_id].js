import { useEffect, useState } from 'react';
import { Container, Dimmer, Loader, Modal, Button, Header, Icon } from 'semantic-ui-react';
import Head from 'next/head';
import axios from 'axios';
import styled from 'styled-components';
import { HOST_URL } from '../../../env';
import { useIsMobile, useIsTablet, useIsDesktop } from '../../../util/useScreenSize';

import { useRecoilState } from 'recoil';
import {
  currentShop as currentShopAtom,
  currentShopProducts as currentShopProductsAtom
} from '../../../data/atoms';

import SearchBanner from '../../../components/SearchBanner';
import Shop_Desktop from '../../../components/Shop/Shop_Desktop';
import Shop_Mobile from '../../../components/Shop/Shop_Mobile';
import Footer from '../../../components/Footer';
import CurrentAddress from '../../../components/CurrentAddress';
import BackButton from '../../../components/BackButton';

// import { restaurants } from '../../../data/restaurants';

const shop = ({ getSingleShop, getShopProducts }) => {
  const hide = useState(false);
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  const isTablet = useIsTablet();
  const [currentShop, setCurrentShop] = useRecoilState(currentShopAtom);
  const [, setCurrentShopProducts] = useRecoilState(currentShopProductsAtom);
  const [open, setOpen] = useState(false);

  useEffect(async () => {
    setCurrentShop(getSingleShop);
    setCurrentShopProducts(getShopProducts);
    console.log("Single shop", getSingleShop)
    console.log("getShopProducts", getShopProducts)
    setOpen(true)
  }, [getSingleShop]);

  return (
    <>
     <Modal
      basic
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size='small'
      trigger={<Button>Basic Modal</Button>}
    >
      <Header icon>
        <Icon name='times' />
        This location is closed.
      </Header>
     
      <Modal.Actions>
        <Button color='green' inverted onClick={() => setOpen(false)}>
          <Icon name='checkmark' /> OK
        </Button>
      </Modal.Actions>
    </Modal>
    <div>
     
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

// export const getServerSideProps = async (context) => {
//   context.res.setHeader('Cache-Control', 's-maxage=86400');

//   const getSingleShop = await axios.get(HOST_URL + '/api/singleshop', {
//     params: { shop_id: context.params.shop_id }
//   });

//   const getShopProducts = await axios.get(HOST_URL + '/api/shopproducts', {
//     params: {
//       shop_id: context.params.shop_id,
//       category_id: 'all'
//     }
//   });

//   return {
//     props: {
//       getSingleShop: getSingleShop.data.data,
//       getShopProducts: getShopProducts.data.data,
//     }
//   }
// }


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
      getShopProducts: getShopProducts.data.data,
    }
  }
}

export const getStaticPaths = async () => {
  return {
    paths:
      [
        { params: { shop_id: '1', slug: "Broadway" }, locale: "en" },
        { params: { shop_id: '2', slug: "Kitsilano" }, locale: "en"  },
        { params: { shop_id: '3', slug: "Richmond" }, locale: "en"  },
        { params: { shop_id: '4', slug: "Port Coquitlam" }, locale: "en"  },
        { params: { shop_id: '5', slug: "Kingsway" }, locale: "en"  },
        { params: { shop_id: '6', slug: "Seymour" }, locale: "en"  },
        { params: { shop_id: '7', slug: "Newton" }, locale: "en"  },
        { params: { shop_id: '8', slug: "Mount Pleasant" }, locale: "en"  },
        { params: { shop_id: '1', slug: "Broadway" }, locale: "zh-CN" },
        { params: { shop_id: '2', slug: "Kitsilano" }, locale: "zh-CN"  },
        { params: { shop_id: '3', slug: "Richmond" }, locale: "zh-CN"  },
        { params: { shop_id: '4', slug: "Port Coquitlam" }, locale: "zh-CN"  },
        { params: { shop_id: '5', slug: "Kingsway" }, locale: "zh-CN"  },
        { params: { shop_id: '6', slug: "Seymour" }, locale: "zh-CN"  },
        { params: { shop_id: '7', slug: "Newton" }, locale: "zh-CN"  },
        { params: { shop_id: '8', slug: "Mount Pleasant" }, locale: "zh-CN"  },
      ],
    fallback: false
  }
}

export default shop;
