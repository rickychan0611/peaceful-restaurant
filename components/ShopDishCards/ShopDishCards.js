import { useRouter } from 'next/router';
import styled from 'styled-components';
import useTranslation from 'next-translate/useTranslation';

import { useRecoilState } from 'recoil';
import {
  currentShop as currentShopAtom,
  currentItem as currentItemAtom,
} from '../../data/atoms.js';
import { Button, Label } from 'semantic-ui-react';

import { HOST_URL } from '../../env';

const ShopDishCards = ({ item }) => {
  const router = useRouter();
  const [currentItem, setCurrentItem] = useRecoilState(currentItemAtom);
  const [currentShop, setCurrentShop] = useRecoilState(currentShopAtom);
  const { t } = useTranslation('home');

  return (
    <>
      <Card
        onClick={() => {
          // when click, save item in selectedItem Atom and selectedStore Atom.
          // then open item's page by using item's id
          setCurrentItem(item);
          console.log("ShopDishCards currentItem", currentItem)
          console.log("ShopDishCards currentShop", currentShop)
          router.push('/item/' + item.id);
        }}>
        <SpaceBetween>
          <div>
            {item.images && item.images[0] ? (
              <Img src={HOST_URL + '/storage/' + JSON.parse(item.images)[0]} />
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
                  style={{
                    textDecoration: 'line-through',
                    marginRigth: 5,
                    color: 'black'
                  }}>
                  ${item.price}
                </span>{' '}
                ${item.promotion_price}
              </Price>
            )}
            {/* <Description>by: {item.shop.name}</Description> */}
          </div>
          <Button
            basic
            size="tiny"
            style={{
              marginTop: 20,
              padding: 10,
              backgroundColor: '#9c0404',
              color: 'white',
              width: '100%',
              borderRadius: 20
            }}>
            Add to Card
          </Button>
        </SpaceBetween>
      </Card>
    </>
  );
};

const SpaceBetween = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  height: 100%;
`;
const Card = styled.div`
  display: inline-block;
  position: relative;
  /* margin: 10px; */
  width: 100%;
  /* max-width: 200px; */
  cursor: pointer;
  margin-bottom: 20px;
`;
const Img = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;
const Name = styled.div`
  font-size: 1.1rem;
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

export default ShopDishCards;
