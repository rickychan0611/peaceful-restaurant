import { useIsDesktop } from '../util/useScreenSize';
import Location_Desktop from '../components/Location_Desktop';
import Location_Mobile from '../components/Location_Mobile';

const Shop_Desktop = () => {
  const isDesktop = useIsDesktop();

  return (
		<div id="map">{isDesktop ? <Location_Desktop /> : <Location_Mobile />}</div>
  );
};

export default Shop_Desktop;
