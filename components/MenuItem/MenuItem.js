import { useRouter } from 'next/router';

import { useIsMobile } from '../../util/useScreenSize';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { currentItem as itemAtom } from '../../data/atoms.js';
import { Divider, Icon } from 'semantic-ui-react';

const MenuItem = ({ item, smallCard }) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [, setCurrentItem] = useRecoilState(itemAtom);
  const IMG_URL = `/img/food (${Math.floor(Math.random() * (86 - 1) + 1)}).jpg`;

  const route = (item) => {
    console.log(item);
    setCurrentItem(item);

    router.push('/item/' + item.id);
  };

  const H_Card = () => {
    return (
      <>
        <HCardContainer
          isMobile={isMobile}
          onClick={() => {
            route(item);
          }}>
          <Wrapper>
            <div>
              {item.images && <H_Img src={process.env.NEXT_PUBLIC_HOST_URL + '/storage/' + JSON.parse(item.images)[0]} />}
              {/* <H_Img src={IMG_URL} /> */}
            </div>
            <div style={{ padding: '0px 10px' }}>
              <Name>{item.name}</Name>
              <Description>{item.description}</Description>
              <Wrapper>
                {item.promotion_price ? (
                  <>
                    <Price>
                      <span style={{ textDecoration: 'line-through' }}>${item.price}</span>
                      <span style={{ color: 'red', marginLeft: 5 }}>${item.promotion_price}</span>
                    </Price>
                  </>
                ) : (
                  <Price>${item.price}</Price>
                )}
                <PlusSign>
                  <Icon name="plus circle" color="red" />
                </PlusSign>
              </Wrapper>
            </div>
          </Wrapper>
        </HCardContainer>
      </>
    );
  };

  const Small_Card = () => {
    return (
      <>
        <VCardContainer onClick={() => route(item)}>
          <div>
            {item.images && item.images[0] ? (
              <Img src={process.env.NEXT_PUBLIC_HOST_URL + '/storage/' + JSON.parse(item.images)[0]} />
            ) : (
              <Img src="/no-image.png" />
            )}
            <Name style={{ padding: '0 5px' }}>{item.name}</Name>
          </div>
          <div style={{ padding: '0 5px' }}>
            <Wrapper>
              {item.promotion_price ? (
                <>
                  <Price>
                    <span style={{ textDecoration: 'line-through', fontSize: 12 }}>
                      ${item.price}
                    </span>
                    <span style={{ color: 'red', marginLeft: 5 }}>${item.promotion_price}</span>
                  </Price>
                </>
              ) : (
                <Price>${item.price}</Price>
              )}
              <PlusSign>
                <Icon name="plus circle" color="red" />
              </PlusSign>
            </Wrapper>
          </div>
        </VCardContainer>
      </>
    );
  };

  return <>{smallCard ? <Small_Card /> : <H_Card />}</>;
};
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-top: 5px;
`;
const VCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  position: relative;
  margin: 5px 15px 15px 5px;
  width: 130px;
  height: 155px;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: solid 1px #e9e9e9;
  cursor: pointer;
`;
const Price = styled.h5`
  margin: 0;
  white-space: initial;
`;
const Name = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: initial;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;
const PlusSign = styled.div`
  margin: 0;
  white-space: initial;
`;
const HCardContainer = styled.div`
  cursor: pointer;
  width: ${(p) => (p.isMobile ? '100%' : 'calc(50% - 10px)')};
  border-top: 1px solid #dadada;
  padding-top: 10px;
  padding-bottom: 15px;
`;
const H_Img = styled.img`
  width: 90px;
  height: 90px;
  object-fit: cover;
`;
const Img = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
`;
const Description = styled.div`
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default MenuItem;
