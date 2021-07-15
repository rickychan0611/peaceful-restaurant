import { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import {
  currentShop as currentShopAtom,
  scrollTop as scrollTopAtom
} from '../../data/atoms';
import { Divider, Form, Icon } from 'semantic-ui-react';
import RestaurantMenu from '../RestaurantMenu';
import SearchBar from '../SearchBar';
import useTranslation from 'next-translate/useTranslation';

const Shop_Desktop = () => {
  const { t } = useTranslation('shop');
  const router = useRouter();
  const [currentShop] = useRecoilState(currentShopAtom);
  const [scrollTop, setScrollTop] = useRecoilState(scrollTopAtom);
  const contextRef = useRef();
  const menuRef = useRef();
  const [showSearch, setShowSearch] = useState(true);

  useEffect(() => {
    menuRef.current.scrollTop = scrollTop
  }, [])

  return (
    <div>
      <Row>
        <Title>{currentShop.name}</Title>
        <SearchBar currentShop={currentShop} setShowSearch={setShowSearch}/>
      </Row>
      <Divider />
      <Container>
        <Left>
          <CatWrapper>
            <CatName
              onClick={() => {
                router.push(
                  "/shop/" + router.query.slug + "/" + router.query.shop_id + '#popular'
                );
              }}>
              <Icon name="chevron right" style={{ color: 'red' }} size="small" />
              <Name>Most Popular | 本店最热</Name>
            </CatName>
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

        <Right ref={menuRef} onClick={() => setScrollTop(menuRef.current.scrollTop)}>
          <RestaurantMenu t={t} contextRef={contextRef} />
        </Right>

      </Container>
    </div>
  );
};

const Container = styled.div`
  display: flex;
  flex-flow: row nowrap;
  height: calc(100vh - 200px);
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding-top: 20px;
`;
const Left = styled.div`
  flex: 2;
  height: 100%;
  overflow-y: auto;
  padding: 0 10px;
`;
const Right = styled.div`
  flex: 7;
  height: 100%;
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
const Title = styled.h1`
  font-size: 28px;
  margin: 0;
  color: #9c0404;
  padding-left: 10px;
`;
export default Shop_Desktop;
