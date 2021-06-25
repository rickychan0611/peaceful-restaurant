import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styled from 'styled-components';
import useTranslation from 'next-translate/useTranslation';

import { useRecoilState } from 'recoil';
import {
  currentShop as currentShopAtom,
  currentItem as currentItemAtom,
  currentCat as currentCatAtom
} from '../../data/atoms.js';
import { Button, Label } from 'semantic-ui-react';


import PlaceHolder_Card from '../PlaceHolder_Card/';

const DishCards = ({type}) => {
  const router = useRouter();
  const [, setCurrentItem] = useRecoilState(currentItemAtom);
  const [, setCurrentShop] = useRecoilState(currentShopAtom);
  const [currentCat] = useRecoilState(currentCatAtom);
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('home');

  //get products from server when component is loaded
  useEffect(async () => {
    setLoading(true);
    // console.log('plat_category reload', currentCat ? currentCat.id : 'all');
    const getProducts = await axios.get(process.env.NEXT_PUBLIC_HOST_URL + '/api/products', {
      params: {
        plat_category: currentCat ? currentCat.id : 'all',
        type,
        count: '20'
      }
    });
    // console.log(products);
    setProducts(getProducts.data.data);
    setLoading(false);
  }, [currentCat]);

  return (
    <>
      {loading ? (
        <PlaceHolder_Card size={302} />
      ) : (
        <>
          {products &&
            products[0] &&
            products.map((item, i) => {
              return (
                <Card
                  key={i}
                  onClick={() => {
                    // when click, save item in selectedItem Atom and selectedStore Atom.
                    // then open item's page by using item's id
                    setCurrentItem({...item, fromHomePage: true});
                    setCurrentShop(item.shop);
                    router.push('/item/' + item.id);
                  }}>
                  <Label
                    as="a"
                    color="red"
                    ribbon
                    style={{ position: 'absolute', left: -13, margin: 0 }}>
                    {/* {item.promotion_price / item.price * 100}% OFF */}
                    {(100 - (item.promotion_price / item.price) * 100).toFixed(0)}% OFF
                  </Label>

                  {item.images && item.images[0] ? (
                    <Img src={process.env.NEXT_PUBLIC_HOST_URL + '/storage/' + JSON.parse(item.images)[0]} />
                  ) : (
                    <Img src="/no-image.png" />
                  )}

                  <Name>{item.name}</Name>
                  <Description>{item.description}</Description>
                  {!item.promotion_price ? (
                    <Price>
                      <span style={{ marginRigth: 5, color: 'black' }}>${item.price}</span>
                    </Price>
                  ) : (
                    <Price>
                      <span
                        style={{ textDecoration: 'line-through', marginRigth: 5, color: 'black' }}>
                        ${item.price}
                      </span>{' '}
                      ${item.promotion_price}
                    </Price>
                  )}
                  <Description>by: {item.shop.name}</Description>
                  <Button basic size="tiny" style={{ marginTop: 5, padding: 10, color: 'red' }}>
                    {t('OrderNow')}
                  </Button>
                </Card>
                // </Segment>
              );
            })}
        </>
      )}
    </>
  );
};

const Wrapper = styled.div`
  padding: 0px 10px 10px 10px;
`;
const Card = styled.div`
  display: inline-block;
  position: relative;
  margin: 10px;
  width: 200px;
  cursor: pointer;
`;
const Img = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;
const Name = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Description = styled.div`
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Price = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: red;
  margin-top: 5px;
`;

export default DishCards;
