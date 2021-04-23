import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { selectedItem as itemAtom } from '../../data/atoms.js';
import { Grid, Divider } from 'semantic-ui-react';
import { useDesktopMediaQuery } from '../../components/Responsive/Responsive';
import ItemModal from '../ItemModal/';

const MenuItem = ({ item, isVCard }) => {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useRecoilState(itemAtom);
  const IMG_URL = `/img/food (${Math.floor( Math.random() * (86 - 1) + 1 )}).jpg`;
  const isDesktop = useDesktopMediaQuery();

  const [qty, setQty] = useState(0);
  const [open, setOpen] = useState(false);

  const route = (item) => {
    console.log(item);
    setSelectedItem({ ...item, img: IMG_URL });

    isDesktop ? setOpen(true) : router.push('/item/' + item);
  };

  const H_Card = () => {
    return (
      <>
        <ItemModal open={open} setOpen={setOpen} />
        <div
          onClick={() => {
            route(item);
          }}>
          <Grid>
            <Grid.Column width={3}>
              <Img src={IMG_URL} />
            </Grid.Column>
            <Grid.Column width={13} style={{ paddingLeft: 0 }}>
              <H4>{item.name}</H4>
              <Description>{item.description}</Description>
              <H4>${item.price}</H4>
            </Grid.Column>
          </Grid>
          <Divider />
        </div>
      </>
    );
  };

  const V_Card = () => {
    return (
      <>
        <ItemModal open={open} setOpen={setOpen} />
        <div>
          <VCardContainer onClick={() => route(item)}>
            <Img src={IMG_URL} />
            <H4>{item.name}</H4>
            <H4>$12.00</H4>
          </VCardContainer>
        </div>
      </>
    );
  };

  return <>{isVCard ? <V_Card /> : <H_Card />}</>;
};
const VCardContainer = styled.div`
  display: inline-block;
  position: relative;
  margin: 5px;
  width: 130px;
  height: 165px;
`;
const H4 = styled.h4`
  margin: 0;
  white-space: initial;
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