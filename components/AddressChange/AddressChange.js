import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Segment, Header, Form, Icon, Divider, Modal, TextArea, Button } from 'semantic-ui-react';
import { useRecoilState } from 'recoil';
import { user as userAtom } from '../../data/userAtom.js';
import { useEffect } from 'react';
import AddressNewForm from '../AddressNewForm';

const AddressChange = ({ setOpen }) => {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userAtom);
  const [selectedAddress, setSelectedAddress] = useState({
    id: '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    province: '',
    Country: ''
  });
  const [openNew, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState('');
  const [newAddress, setNewAddress] = useState({});
  const [err, setErr] = useState({});
  const [dropoff, setDropoff] = useState(user.deliveryAddress.dropoff);
  const [instructions, setInstructions] = useState(user.deliveryAddress.instructions);

  const selectAddress = (address) => {
    setUser((prev) => ({ ...prev, deliveryAddress: address }));
  };

  const addAddress = () => {
    const addressWithId = {
      ...newAddress,
      id: newAddress.address1 + Math.floor(Math.random() * 100000)
    };
    setUser((prev) => ({
      ...prev,
      deliveryAddress: addressWithId,
      addresses: [addressWithId, ...prev.addresses]
    }));
    setSelectedAddress(addressWithId);
    setNewAddress({});
    setOpenNew(false);
  };

  const updateAddress = () => {
    setUser((prev) => {
      const index = prev.addresses.findIndex((item) => item.id === newAddress.id);
      let newAddresses = [...prev.addresses];
      newAddresses[index] = newAddress;
      console.log(newAddresses);
      return { ...prev, addresses: newAddresses, deliveryAddress: newAddress };
    });
    setSelectedAddress(newAddress);
    setNewAddress({});
    setOpenEdit('');
  };

  const removeAddress = (id) => {
    setUser((prev) => {
      const index = prev.addresses.findIndex((item) => item.id === id);
      let newAddresses = [...prev.addresses];
      newAddresses.splice(index, 1);
      console.log(newAddresses);
      return { ...prev, addresses: newAddresses, deliveryAddress: selectedAddress };
    });
    setSelectedAddress(newAddress);
  };

  const handleOK = () => {
    setOpen(false);
    setUser((prev) => {
      return { ...prev, deliveryAddress: {...prev.deliveryAddress, dropoff, instructions} };
    });
  }

  useEffect(() => {
    setSelectedAddress(user.deliveryAddress);
    console.log(user.deliveryAddress);
    return () => setOpenNew(false);
  }, [user]);

  return (
    <Segment basic padded>
      <Header>Change Address</Header>
      <Form onSubmit={addAddress}>
        {openNew && (
          <AddressNewForm err={err} setNewAddress={setNewAddress} newAddress={newAddress} />
        )}
        {!openNew ? (
          <AddAddress onClick={() => setOpenNew(!openNew)}> + Add a new Address</AddAddress>
        ) : (
          <AddAddress onClick={() => setOpenNew(!openNew)}> - Hide</AddAddress>
        )}
      </Form>
      <Divider />
      {user &&
        user.addresses[0] &&
        user.addresses.map((address, index) => {
          return (
            <div key={index}>
              <Container>
                <Row
                  onClick={() => {
                    selectAddress(address);
                  }}>
                  <RadioButton
                    readOnly
                    type="radio"
                    value={address.id}
                    checked={selectedAddress.id === address.id}
                  />
                  <Column>
                    <H4 style={{ color: selectedAddress.id === address.id && '#5858e0' }}>
                      {address.address1}
                      {address.address2 && ', ' + address.address2}
                    </H4>
                    <P
                      style={{
                        color: selectedAddress.id === address.id && '#5858e0'
                      }}>{`${address.city}, ${address.province}, ${address.country}`}</P>
                  </Column>
                </Row>
                <div>
                  <Icon
                    name="edit"
                    onClick={() => {
                      setOpenEdit(address.id);
                      setNewAddress(address);
                    }}
                  />
                  {selectedAddress.id !== address.id && (
                    <Icon
                      name="delete"
                      style={{ marginLeft: 20 }}
                      onClick={() => removeAddress(address.id)}
                    />
                  )}
                </div>
              </Container>
              <Modal open={openEdit === address.id} closeIcon onClose={() => setOpenEdit('')}>
                <Segment basic padded>
                  <Header>Edit Address</Header>
                  <Form onSubmit={updateAddress}>
                    <AddressNewForm
                      err={err}
                      setNewAddress={setNewAddress}
                      newAddress={newAddress}
                    />
                  </Form>
                </Segment>
              </Modal>
            </div>
          );
        })}
      <Divider />
      <Header>Drop-off options</Header>
      <Container style={{ justifyContent: 'flex-start' }}>
        <Row style={{ marginRight: 40 }} onClick={()=>setDropoff('Hand it to me')}>
          <RadioButton
            readOnly
            type="radio"
            value={'Hand it to me'}
            checked={dropoff === 'Hand it to me'}
          />
          <Column><H4>Hand it to me</H4></Column>
        </Row>
        <Row onClick={()=>setDropoff('Leave it at my door')}>
          <RadioButton
            readOnly
            type="radio"
            value={'Leave it at my door'}
            checked={dropoff === 'Leave it at my door'}
          />
          <Column><H4>Leave it at my door</H4></Column>
        </Row>
      </Container>
      <H4>Instructions:</H4>
      <TextArea
        style={{ width: '100%', maxWidth: '100%', minWidth: '100%'}}
        placeholder="eg. rignt the bell after dropoff, call for buzz code"
        value={instructions}
        onChange={(e)=>setInstructions(e.target.value)}
      />
      <Divider />
      <Button style={{ backgroundColor: '#ff614d', color: 'white' }}
      onClick={handleOK}>OK</Button>
    </Segment>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  input[type='radio'] {
    border: 0px;
    width: 1.2em;
    height: 1.2em;
    color: black;
  }
`;
const RadioButton = styled.input`
  margin-right: 15px;
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`;
const H4 = styled.h4`
  margin: 0;
`;
const P = styled.p`
  margin: 0;
  color: grey;
`;
const AddAddress = styled.div`
  cursor: pointer;
  margin-bottom: 20px;
  color: #5858e0;
`;

export default AddressChange;
