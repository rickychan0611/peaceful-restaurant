import { useEffect, useState } from 'react';
import { Container, Dimmer, Loader } from 'semantic-ui-react';
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

  useEffect(async () => {
    setCurrentShop(getSingleShop);
    setCurrentShopProducts(getShopProducts);
    console.log("Single shop", getSingleShop)
  }, [getSingleShop]);

  return (
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
        { params: { shop_id: '1', slug: "Broadway" } },
        { params: { shop_id: '2', slug: "Kitsilano" } },
        { params: { shop_id: '3', slug: "Richmond" } },
        { params: { shop_id: '4', slug: "Port Coquitlam" } },
        { params: { shop_id: '5', slug: "Kingsway" } },
        { params: { shop_id: '6', slug: "Seymour" } },
        { params: { shop_id: '7', slug: "Newton" } },
        { params: { shop_id: '8', slug: "Mount Pleasant" } },
      ],
    fallback: false
  }
}

export default shop;
