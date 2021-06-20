import { useIsDesktop } from '../util/useScreenSize';
import Location_Desktop from '../components/Location_Desktop';
import Location_Mobile from '../components/Location_Mobile';

const Shop_Desktop = () => {
  const isDesktop = useIsDesktop();

  return (
		<>{isDesktop ? <Location_Desktop /> : <Location_Mobile />}</>
  );
};

export default Shop_Desktop;
