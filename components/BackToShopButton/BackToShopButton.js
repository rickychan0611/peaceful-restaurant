import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';
import { useRecoilState } from 'recoil';
import {
  currentItem as currentItemAtom,
} from '../../data/atoms.js';

const locations = [
  { id: 1, name: 'Broadway' },
  { id: 2, name: 'Kitsilano' },
  { id: 3, name: 'Richmond' },
  { id: 4, name: 'Port Coquitlam' },
  { id: 5, name: 'Kingsway' },
  { id: 6, name: 'Seymour' },
  { id: 7, name: 'Newton' },
  { id: 8, name: 'Mount Pleasant' }
];

const BackToShopButton = () => {
  const router = useRouter();
  const [currentItem, setCurrentItem] = useRecoilState(currentItemAtom);

  return (
    <Container
      onClick={() => {
        router.push('/shop/' + locations[currentItem.shop.id-1].name + '/' + currentItem.shop.id);
      }}>
      <Icon name="arrow left" /> Back to menu
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  font-size: 18px;
  background-color: white;
  width: 100%;
  z-index: 10;
  padding: 10px;
  margin: 0 0 0 0;
  cursor: pointer;
`;

export default BackToShopButton;
