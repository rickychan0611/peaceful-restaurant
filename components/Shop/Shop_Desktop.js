import { useRef } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import { useRecoilState } from 'recoil';
import {
  currentShop as currentShopAtom,
  currentShopProducts as currentShopProductsAtom
} from '../../data/atoms';

import { Grid, Ref } from 'semantic-ui-react';
import Slider from '../Slider';
import PopularDishes from '../PopularDishes';
import ShopSideBar from '../ShopSideBar';
import RestaurantMenu from '../RestaurantMenu';
import ReviewFeed from '../ReviewFeed/index.js';
import axios from 'axios';
import { HOST_URL } from '../../env';
import useTranslation from 'next-translate/useTranslation';

const Shop_Desktop = () => {
  const { t } = useTranslation('shop');
  const router = useRouter();
  const [currentShop, setCurrentShop] = useRecoilState(currentShopAtom);
  const [currentShopProducts, setCurrentShopProducts] = useRecoilState(currentShopProductsAtom);
  const contextRef = useRef();

  return (
    <div>
      <Grid>
        <Grid.Column width={4} style={{ paddingBottom: 100 }}>
          <ShopSideBar shop={currentShop} />
        </Grid.Column>

        <Grid.Column width={12} style={{ padding: '0 20px' }}>
          <div  style={{ padding: '0 20px' }}>
            <Wrapper>
              {currentShop.logo ? (
                <Avatar src={HOST_URL + '/storage/' + currentShop.logo} />
              ) : (
                <Avatar src="/avatar-placeholder.png" />
              )}
              <div style={{ width: 'calc(100% - 50px)' }}>
                <Title>{currentShop.name}</Title>
                <Description style={{ marginBottom: 60 }}>{currentShop.description}</Description>
              </div>
            </Wrapper>
            <Section id="popular">
              <Slider topic={t('PopularItems')} hideViewAll>
                {currentShopProducts ? (
                  <PopularDishes products={currentShopProducts} />
                ) : (
                  'No item found.'
                )}
              </Slider>
            </Section>

            <Ref innerRef={contextRef}>
              <RestaurantMenu t={t} contextRef={contextRef} />
            </Ref>
            <br />
            <hr />
            <br />
            <Section id="reviews">
            <Title style={{fontSize: 28}}>{t`Reviews`}</Title>
              <ReviewFeed t={t} />
            </Section>
            <br />
            <hr />
            <br />
            {/* <Slider topic="Restaurants you may like" hideViewAll> */}
            {/* <PopularDishes /> */}
            {/* </Slider> */}
          </div>
        </Grid.Column>
      </Grid>
    </div>
  );
};

const Section = styled.div`
  /* scroll-margin-top: 240px; */
  :before {
    content: '';
    display: block;
    height: 240px; /* fixed header height*/
    margin: -240px 0 0; /* negative fixed header height */
  }
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`;
const Avatar = styled.img`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  border: solid 2px white;
  height: 60px;
  width: 60px;
  object-fit: contain;
  box-shadow: 0px 0px 5px#a5a5a5;
  margin-right: 20px;
`;
const Title = styled.h1`
  font-size: 2.5rem;
  margin: 0;
`;
const Description = styled.div`
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export default Shop_Desktop;
