import { useEffect, useState } from 'react';
import axios from 'axios';

import styled from 'styled-components';
import { Container } from 'semantic-ui-react';
import SearchShopCards from '../../../components/SearchShopCards';
import SearchDishCards from '../../../components/SearchDishCards';
import SearchBanner from '../../../components/SearchBanner';
import BackButton from '../../../components/BackButton';
import SearchToggle from '../../../components/SearchToggle';
import { useIsMobile } from '../../../util/useScreenSize';
import { useRecoilState } from 'recoil';
import { searchValue as searchValueAtom } from '../../../data/atoms';
import shop from '../../shop/[slug]/[shop_id]';

const search = ({ shops, products, keyword }) => {
  const isMobile = useIsMobile();
  const [searchValue, setSearchValue] = useRecoilState(searchValueAtom);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    console.log("products search result ", products)
    console.log("shops search result ", products)
    setSearchValue(keyword);

    if (shops.length === 0) setToggle(true)

    return () => setSearchValue();
  }, [keyword]);

  return (
    <>
      <SearchBannerWrapper>
        <SearchBanner />
        <BackButton />
      </SearchBannerWrapper>
      <Container style={{ marginTop: 100, paddingBottom: 50 }}>
        <ToggleContainer>
          <SearchToggle toggle={toggle} setToggle={setToggle} shops={shops} products={products} />
        </ToggleContainer>
        
        {((!toggle && shops.length === 0) || (toggle && products.length === 0)) && (
          <>
            <Header>Sorry, no result found for </Header>
            <br />
            <Header style={{ fontSize: 24, marginBottom: 20 }}>"{keyword}"</Header>
          </>
        )}
      
        <CardContainer isMobile={isMobile} toggle={toggle}>
          {!toggle ? <SearchShopCards shops={shops} /> : <SearchDishCards products={products} />}
        </CardContainer>
      </Container>
    </>
  );
};

export const getServerSideProps = async (context) => {
  console.log(context.params.keyword);
  const getShops = await axios.get(process.env.NEXT_PUBLIC_HOST_URL + '/api/search', {
    params: {
      keyword: context.params.keyword
    }
  });
  return {
    props: {
      keyword: context.params.keyword,
      shops: getShops.data.data.shops,
      products: getShops.data.data.products
    }
  };
};

const Header = styled.div`
  margin: 0;
`;
const ToggleContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  padding: 0px 0px 30px 0px;
  width: 100%;
`;

const CardContainer = styled.div`
  display: grid;
  grid-gap: ${(p) => (p.isMobile && !p.toggle ? '10px' : '20px')};
  grid-template-columns: ${(p) =>
    p.isMobile ? 'repeat(auto-fill, minmax(150px, 1fr))' : 'repeat(auto-fill, minmax(180px, 1fr))'};
`;

const SearchBannerWrapper = styled.div`
  z-index: 1000;
  position: fixed;
  top: 62px;
  .active {
    visibility: visible;
    transition: all 200ms ease-in;
  }
  .hidden {
    visibility: hidden;
    transition: all 200ms ease-out;
    transform: translate(0, -100%);
  }
`;

export default search;
