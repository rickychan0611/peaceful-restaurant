import styled from 'styled-components';
import { useRouter } from 'next/router';
import { Divider, Ref, Icon } from 'semantic-ui-react';
import useTranslation from 'next-translate/useTranslation';
import ShopInfo from '../components/ShopSideBar/ShopInfo';
import addresses from '../addresses';
import Map from '../components/Map';
import { useIsDesktop } from '../util/useScreenSize';
import Location_Desktop from '../components/Location_Desktop';
import Location_Mobile from '../components/Location_Mobile';

const Shop_Desktop = () => {
  const { t } = useTranslation('shop');
  const router = useRouter();
  const isDesktop = useIsDesktop();

  return (
		<>{isDesktop ? <Location_Desktop /> : <Location_Mobile />}</>
  );
};

const Wrapper = styled.div`
  padding: 0px 15px 40px 15px;
  max-width: 1000px;
  margin: 0 auto;
`;
const Container = styled.div`
  display: flex;
  flex-flow: row nowrap;
	height: calc(100vh - 190px);
`;
const Left = styled.div`
  flex: 4;
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
const InfoWrapper = styled.div`
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
  padding-top: 20px;
  color: #9c0404;
  padding-left: 10px;
`;

export default Shop_Desktop;