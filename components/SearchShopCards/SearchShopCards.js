import { useState } from 'react';
import { useRouter } from 'next/router';
import { useIsMobile } from '../../util/useScreenSize';
import styled from 'styled-components';
import toSlug from '../../util/toSlug';

import { useRecoilState } from 'recoil';
import { currentShop as currentShopAtom } from '../../data/atoms.js';
import useTranslation from 'next-translate/useTranslation';


import PlaceHolder_Card from '../PlaceHolder_Card';

const SearchShopCards = ({ shops }) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [currentShop, setCurrentShop] = useRecoilState(currentShopAtom);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('home');

  return (
    <>
      {loading ? (
        <PlaceHolder_Card size={302} />
      ) : (
        <>
          {shops &&
            shops[0] &&
            shops.map((shop, i) => {
              return (
                <Card
                  isMobile={isMobile}
                  key={i}
                  onClick={() => {
                    //store selected store in selections.restaurant
                    setCurrentShop(shop);
                    router.push('/shop/' + toSlug(shop.name) + '/' + shop.id);
                  }}>
                  {/* <Img src={`/img/food (${Math.floor( Math.random() * (86 - 1) + 1 )}).jpg`} /> */}

                  {shop.images && shop.images[0] ? (
                    <Img
                      isMobile={isMobile}
                      src={process.env.NEXT_PUBLIC_HOST_URL + '/storage/' + JSON.parse(shop.images)[0]}
                    />
                  ) : (
                    <Img isMobile={isMobile} src="/no-image.png" />
                  )}
                  <div style={{ padding: 5 }}>
                    <Name>{shop.name}</Name>
                    {/* <Description>{item.description}</Description> */}
                    <Description>
                      {t('location')}: {shop.address_city}
                    </Description>
                    <Description>
                      {t('style')}: {'shop.cuisine_type'}
                    </Description>
                    <Description>{t('PriceRange')}: 💲💲💲💲</Description>
                    <Description>{t('Reviews')}: ⭐⭐⭐⭐⭐ (34)</Description>
                  </div>
                </Card>
              );
            })}
        </>
      )}
    </>
  );
};

const Card = styled.div`
  cursor: pointer;
  /* min-width: ${(p) => (p.isMobile ? '160px' : '200px')}; */
  flex: 1;
`;
const Img = styled.img`
  width: 100%;
  max-width: 223;
  height: 200px;
  object-fit: cover;
`;
const Name = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Description = styled.div`
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default SearchShopCards;
