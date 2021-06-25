import { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';
import AddressEditModal from '../AddressEditModal';

import { useCookies } from 'react-cookie';
import { useIsMobile } from '../../util/useScreenSize';
import useTranslation from 'next-translate/useTranslation';
import { RecoilRoot, useRecoilState } from 'recoil';
import { addresses as addressAtom, appReady as appReadyAtom } from '../../data/atoms';
// import { updateMapDestination } from '../../pages/checkout';
import validation from '../../util/validation';

const AddressBook = ({ selectedAddress, setSelectedAddress, getAddressesQuery }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState(null);
  const [cookies] = useCookies(null);
  const isMobile = useIsMobile();
  const { t } = useTranslation('profile');
  const [addresses, setAddresses] = useRecoilState(addressAtom);
  const [appReady, setAppReady] = useRecoilState(appReadyAtom);

  const query = async (body) => {
    setLoading(true);
    try {
      await axios.post(process.env.NEXT_PUBLIC_HOST_URL + '/api/user/address/set', body, {
        headers: { Authorization: cookies.userToken }
      });
      await getAddressesQuery();
      setLoading(false);
      setOpen(false);
      return;
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const saveAddressQuery = async () => {
    console.log("about to save address: " , selectedAddress)
    setErr(null)
    validation(selectedAddress)
    .then(() => {
      query(selectedAddress);
    })
    .catch((err) => {
      console.log(err);
      setErr((prev) => ({ ...prev, ...err }));
    });
  };

  const deleteAddressQuery = async (id) => {
    query({ type: 'delete', address_id: id });
    
  };

  const setDefaultQuery = async (id) => {
    await query({ type: 'edit', address_id: id, default_status: 1 });
  };

  return (
    <>
      <AddressEditModal
        open={open}
        setOpen={setOpen}
        loading={loading}
        saveAddressQuery={saveAddressQuery}
        err={err}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
      />

      <a
        style={{ marginBottom: 10, color: 'green', cursor: 'pointer' }}
        onClick={() => {
          setOpen(true);
          console.log("addresses", addresses, addresses.length)
          setSelectedAddress({ type: 'create', default_status: addresses.length === 0 ? 1 : 0 });
        }}>
        <Icon name="plus circle" />
        {t`AddAddress`}
      </a>
      <br />
      <AddressContainer>
        {appReady && addresses &&
          addresses[0] &&
          addresses.map((address, i) => {
            console.log("address" , address)
            return (
              <AddressCard default={address.default_status} key={i} isMobile={isMobile}>
                <h4 style={{margin: 0}}>
                  {address.name ? address.name : <span style={{color: "red"}}>No Name entered. Please edit</span>}
                  <br />
                  {address.detail_address ? address.detail_address : <span style={{color: "red"}}>*No address entered. Please edit</span>}
                </h4>
                <div style={{margin: "5px 0 15px 0", fontSize: 14}}>
                  <Row style={{ marginBottom: 3}}><div>City: </div><div style={{textAlign: "right"}}>{address.city ? address.city : "N/A"} </div></Row>
                  <Row style={{ marginBottom: 3}}><div>Province: </div><div style={{textAlign: "right"}}>{address.province ? address.province : "N/A"} </div></Row>
                  <Row style={{ marginBottom: 3}}><div>Postal Code: </div><div style={{textAlign: "right"}}>{address.post_code ? address.post_code : "N/A"} </div></Row>
                  <Row style={{ marginBottom: 3}}><div>Coutry: </div><div style={{textAlign: "right"}}>{address.country ? address.country : "N/A"} </div></Row>
                  <Row style={{fontWeight: "bold"}}><div>Tel: </div><div style={{textAlign: "right"}}>{address.phone ? address.phone : "N/A"} </div></Row>
                  </div>
                  <Row>
                  <AddressButton
                    default={address.default_status}
                    onClick={() => {
                      !loading && setSelectedAddress({ type: 'edit', address_id: address.id });
                      address.default_status !== 1 && setDefaultQuery(address.id);
                    }}>
                    {loading &&
                    selectedAddress.address_id === address.id &&
                    selectedAddress.type === 'edit' ? (
                      <Icon loading name="spinner" />
                    ) : (
                      address.default_status === 1 ? t`Selected` : t`Select`
                    )}
                  </AddressButton>

                  <AddressButton
                    onClick={() => {
                      setSelectedAddress({ ...address, type: 'edit', address_id: address.id });
                      setOpen(true);
                    }}>
                    {t`Edit`}
                  </AddressButton>

                  <AddressButton
                    style={{
                      // color: address.default_status === 1 && 'lightGrey'
                    }}
                    onClick={() => {
                      !loading &&
                        setSelectedAddress({ ...address, type: 'delete', address_id: address.id });
                      // address.default_status !== 1 && 
                      deleteAddressQuery(address.id);
                    }}>
                    {loading &&
                    selectedAddress.address_id === address.id &&
                    selectedAddress.type === 'delete' ? (
                      <Icon loading name="spinner" />
                    ) : (
                      t`Delete`
                    )}
                  </AddressButton>
                </Row>
              </AddressCard>
            );
          })}
      </AddressContainer>
    </>
  );
};

const Row = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  gap: 5px;
`;
const AddressContainer = styled.div`
  display: inline-flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  margin-top: 20px;
  margin-bottom: 20px;
  gap: 10px;
`;
const AddressCard = styled.div`
  display: flex;
  flex: 1;
  flex-flow: column nowrap;
  justify-content: space-between;
  padding: ${(p) => (p.default === 1 ? '14px' : '15px')};
  border-radius: 10px;
  border: ${(p) => (p.default === 1 ? '2px solid #ff614d' : '1px solid #d3d1d1')};
  max-width: ${(p) => (p.isMobile ? 'none' : '207px')};
`;
const AddressButton = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 5px 8px 5px 8px;
  border-radius: 5px;
  border: 1px solid #d3d1d1;
  cursor: pointer;
  font-size: 12px;
  background-color: ${(p) => (p.default === 1 ? '#ff614d' : '#e4e3e3')};
  color: ${(p) => (p.default === 1 ? 'white' : 'black')};
  font-weight: bold;
  flex: 1;
  min-width: 56px;
`;

export default AddressBook;
