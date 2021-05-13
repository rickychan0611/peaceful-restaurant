import  { useIsMobile } from '../../util/useScreenSize';
import styled from 'styled-components';

import TopBar_Mobile from './TopBar_Mobile.js';
import TopBar_Desktop from './TopBar_Desktop.js';

const TopBar = () => {
  const isMobile = useIsMobile();

  return (
    <Container>
      <SpaceBetween>
        {isMobile ? <TopBar_Mobile /> : 
        <TopBar_Desktop />}
      </SpaceBetween>
    </Container>
  );
};

const Container = styled.div`
  border-radius: 0;
  position: fixed;
  display: relative;
  z-index: 1000;
  background-color: white;
  width: 100%;
  height: 63px;
  top: 0;
`;
const SpaceBetween = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px;

`;

export default TopBar;
