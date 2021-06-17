import styled from 'styled-components';
import { useRouter } from 'next/router';
import { HOST_URL } from '../../env';
import { useRef } from 'react';

import { useRecoilState } from 'recoil';
import {
  currentShop as currentShopAtom,
  currentShopProducts as currentShopProductsAtom
} from '../../data/atoms';

import Slider from '../Slider';
import PopularDishes from '../PopularDishes';
import RestaurantMenu from '../RestaurantMenu';
import ReviewFeed from '../ReviewFeed';
import BottomNavBar from '../BottomNavBar';
import ShopInfo from '../ShopSideBar/ShopInfo';
import ShopArticleList from '../ShopSideBar/ShopArticleList';
import { Ref } from 'semantic-ui-react';
import useTranslation from 'next-translate/useTranslation';

const Shop_Mobile = () => {
  const [currentShop, setCurrentShop] = useRecoilState(currentShopAtom);
  const [currentShopProducts, setCurrentShopProducts] = useRecoilState(currentShopProductsAtom);
  const contextRef = useRef();
  const { t } = useTranslation('shop');

  return (
    <div style={{ marginTop:20  }}>
          <Title>{currentShop.name}</Title>
      {/* <Section id="shopTop" style={{ height: 100 }}></Section> */}
{/* 
      {currentShop.images && currentShop.images[0] ? (
        <Img src={HOST_URL + '/storage/' + JSON.parse(currentShop.images)[0]} />
      ) : (
        <Img src="/no-image.png" />
      )} */}

      {/* <Wrapper>
        {currentShop.logo ? (
          <Avatar src={HOST_URL + '/storage/' + currentShop.logo} />
        ) : (
          <Avatar src="/avatar-placeholder.png" />
        )}
        <div style={{ width: 'calc(100% - 50px)' }}>
          <Title>{currentShop.name}</Title>
        </div>
      </Wrapper>
      <Description style={{ marginBottom: 20 }}>{currentShop.description}</Description>

      <Section id="shopInfo">
        <ShopInfo shop={currentShop} />
      </Section>
      <br />
      <hr />
      <br />
      <Slider topic="Popular Items" hideViewAll>
        {currentShopProducts ? (
          <PopularDishes products={currentShopProducts} />
        ) : (
          <div style={{ marginBottom: 30 }}>No item found.</div>
        )}
      </Slider>
      <hr />
      <br /> */}
      <Ref innerRef={contextRef}>
        <div id="fullMenu">
          <RestaurantMenu t={t} contextRef={contextRef} />
        </div>
      </Ref>
      <br />
      <hr />
      <br />
      {/* <Slider topic="Other Restaurants you may like" hideViewAll>
        <PopularDishes products={currentShopProducts}/>
      </Slider> */}
      {/* <br />
      <hr />
      <br /> */}
      {/* <Section id="reviews">
      <Title style={{fontSize: 28}}>{t`Reviews`}</Title>
        <ReviewFeed />
      </Section>
      <br />
      <hr />
      <br />
      <Section id="articles">
        <ShopArticleList />
      </Section>
      <br />
      <hr />
      <br />
      <BottomNavBar /> */}
    </div>
  );
};

const Section = styled.div`
  /* scroll-margin-top: 80px; */
  :before {
    content:"";
    display:block;
    height:80px; /* fixed header height*/
    margin:-80px 0 0; /* negative fixed header height */
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  margin-bottom: 5px;
`;

const Img = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  margin-bottom: 10px;
`;

const Avatar = styled.img`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  height: 40px;
  width: 40px;
  margin-right: 5px;
  object-fit: contain;
  /* box-shadow: 0px 0px 5px 3px #dddddd; */
  /* border: solid 1px white; */
`;
const Title = styled.h1`
  font-size: 7vw;
  margin: 0;
`;
const Description = styled.div`
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export default Shop_Mobile;
