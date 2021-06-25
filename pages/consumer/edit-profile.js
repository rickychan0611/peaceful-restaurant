import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styled from 'styled-components';
import { Divider, Icon } from 'semantic-ui-react';
import { useRecoilState } from 'recoil';
import { user as userAtom } from '../../data/userAtom';

import { useCookies } from 'react-cookie';
import { useIsDesktop } from '../../util/useScreenSize';
import ProfileForm from '../../components/ProfileForm';
import AddressBook from '../../components/AddressBook';
import useTranslation from 'next-translate/useTranslation';
import { addresses as addressAtom } from '../../data/atoms';

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userAtom);
  const [cookies] = useCookies(null);
  const [addresses, setAddresses] = useRecoilState(addressAtom);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const isDesktop = useIsDesktop();
  const { t } = useTranslation('profile');

  const getAddressesQuery = async () => {
    try {
      const result = await axios.get(process.env.NEXT_PUBLIC_HOST_URL + '/api/user/address', {
        headers: { Authorization: cookies.userToken }
      });
      // const sorted = result.data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      console.log("address", result.data.data);
      setAddresses(result.data.data);
      return;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('user')) router.push('/sign-in');
    else getAddressesQuery();
  }, []);

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)' }}>
      {user && (
        <Container isDesktop={isDesktop}>
          <h1>{t`Profile`}</h1>
          <Divider />
          
          <ProfileForm t={t} />

          <h3>{t`Address Books`}</h3>
          <Divider />
          <AddressBook
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            getAddressesQuery={getAddressesQuery}
          />
        </Container>
      )}
    </div>
  );
};

const Container = styled.div`
  margin: 20px auto;
  padding: 20px;
  max-width: 900px;
  border: ${(p) => p.isDesktop && 'solid 1px #d4d3d3'};
`;

export default Profile;
