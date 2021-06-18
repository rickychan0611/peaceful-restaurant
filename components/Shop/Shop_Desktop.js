import { useRef } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import { useRecoilState } from 'recoil';
import {
  currentShop as currentShopAtom,
  currentShopProducts as currentShopProductsAtom
} from '../../data/atoms';

import { Divider, Ref, Icon } from 'semantic-ui-react';
import RestaurantMenu from '../RestaurantMenu';
import useTranslation from 'next-translate/useTranslation';

const Shop_Desktop = () => {
  const { t } = useTranslation('shop');
  const router = useRouter();
  const [currentShop] = useRecoilState(currentShopAtom);
  const contextRef = useRef();

  return (
    <div>
      <Title>{currentShop.name}</Title>
      <Divider />
      <Container>
        <Left>
          <CatWrapper>
            {currentShop &&
              currentShop.shop_categories &&
              currentShop.shop_categories[0] &&
              currentShop.shop_categories.map((item, i) => {
                if (item.category_name !== 'Popular Items') {
                  return (
                    <CatName
                    key={i}
                      onClick={() => {
                        router.push(
                          '/shop/' + router.query.slug + '/' + router.query.shop_id + '#' + item.id
                        );
                      }}>
                      <Icon name="chevron right" style={{ color: 'red' }} size="small" />
                      <Name>{item.category_name}</Name>
                    </CatName>
                  );
                }
              })}
          </CatWrapper>
        </Left>

        <Right>
          <RestaurantMenu t={t} contextRef={contextRef} />
        </Right>

      </Container>
    </div>
  );
};

const Container = styled.div`
  display: flex;
  flex-flow: row nowrap;
  /* margin-top: -100px; */
`;
const Left = styled.div`
  flex: 2;
  height: calc(100vh - 170px);
  overflow-y: auto;
  padding: 0 10px;
`;
const Right = styled.div`
  flex: 7;
  height: calc(100vh - 170px);
  overflow-y: auto;
  padding: 10px 10px;
`;

const CatName = styled.div({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  justifyContent: 'flex-start',
  margin: 3,
  padding: '10px 15px 10px 15px'
});
const Name = styled.div({
  cursor: 'pointer',
  textAlign: 'left',
  fontSize: 14,
  fontWeight: 'bold'
});
const CatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  width: 100%;
  background-color: white;
  padding: 10px 0 30px 0;
`;
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
  font-size: 28px;
  margin: 0;
  padding-top: 20px;
  color: #9c0404;
  padding-left: 10px;
`;
const Description = styled.div`
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export default Shop_Desktop;
