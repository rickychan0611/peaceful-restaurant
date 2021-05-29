import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Container, Button, Header, Icon, Divider, Modal, Input, Form } from 'semantic-ui-react';
import styled from 'styled-components';
import { useRecoilValue, useRecoilState } from 'recoil';
import {
  orderDetails as orderDetailsAtom,
  orderItems,
  shippingMethod as shippingMethodAtom
} from '../data/orderAtoms.js';
import {
  appReady as appReadyAtom,
  showCheckoutButton as showCheckoutButtonAtom,
  selections as selectionsAtom,
  currentPosition as currentPositionAtom,
  defaultAddress as defaultAddressAtom,
  addresses as addressAtom,
  currentShop as currentShopAtom
} from '../data/atoms';
import { HOST_URL } from '../env';
import { useCookies } from 'react-cookie';

import OrderItem from '../components/OrderItem/';
import TotalAmountList from '../components/TotalAmountList/';
import AddressChange from '../components/AddressChange/AddressChange.js';
import AddressBook from '../components/AddressBook';
import { useIsDesktop } from '../util/useScreenSize';
import useTranslation from 'next-translate/useTranslation';

const checkout = () => {
  const router = useRouter();
  const orderDetails = useRecoilValue(orderDetailsAtom);
  const selections = useRecoilValue(selectionsAtom);
  const defaultAddress = useRecoilValue(defaultAddressAtom);
  const [deliveryTime, setDeliveryTime] = useState('ASAP');
  const appReady = useRecoilValue(appReadyAtom);
  const [, setShowCheckoutButton] = useRecoilState(showCheckoutButtonAtom);
  const [, setShippingMethod] = useRecoilState(shippingMethodAtom);
  const [currentPosition, setCurrentPosition] = useRecoilState(currentPositionAtom);
  const [open, setOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const { t } = useTranslation('profile');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useRecoilState(addressAtom);
  const [cookies] = useCookies(null);
  const [err, setErr] = useState();
  const [loading, setLoading] = useState(false);
  const [currentShop, setCurrentShop] = useRecoilState(currentShopAtom);
  const [reload, setReload] = useState(0);

  const EditButton = ({ add }) => (
    <Edit
      onClick={() => {
        setOpen(true);
      }}>
      <Icon name={add ? 'plus' : 'edit'} />
      {add ? 'Choose or add an address' : 'edit'}
    </Edit>
  );

  const getAddressesQuery = async () => {
    try {
      const result = await axios.get(HOST_URL + '/api/user/address', {
        headers: { Authorization: cookies.userToken }
      });
      // const sorted = result.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      console.log(result.data);
      setAddresses(result.data);
      return;
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (value, name, id) => {
    console.log(value);
    let temp = [...addresses];
    temp = temp.map((item) => (item.id === id ? { ...item, [name]: value } : item));
    console.log('temp', temp);
    setAddresses(temp);
  };

  const createOrderQuery = async () => {
    setErr();
    setLoading(true);
    console.log('placeOrderQuery', orderDetails);
    console.log('defaultAddress', defaultAddress);
    try {
      if (!defaultAddress) {
        throw new Error('Missing address. Please add an address');
      } else {
        const body = {
          shop_id: orderDetails.shop.id,
          items: orderDetails.orderItems,
          receiver_name: defaultAddress.name,
          receiver_phone: defaultAddress.phone,
          receiver_post_code: defaultAddress.post_code,
          receiver_country: defaultAddress.country,
          receiver_province: defaultAddress.province,
          receiver_city: defaultAddress.city,
          receiver_detail_address: defaultAddress.detail_address,
          receiver_unit_number: defaultAddress.unit_number,
          receiver_note: defaultAddress.note
        };
        console.log('body', body);
        const result = await axios.post(HOST_URL + '/api/user/order/create', body, {
          headers: { Authorization: cookies.userToken }
        });
        console.log(result.data);
        if (result.data === 'order create success') {
          router.push('/consumer/order-success');
        } else {
          throw new Error('Order failed. Please try again');
        }
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setErr(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('orderDetails!!!!!!!!!!!!!!!!!', orderDetails);
    setCurrentShop(orderDetails.shop);
    console.log('currentShop!!!!!!!!!!!!!!!!!', currentShop);
    console.log('!orderDetails[0]', orderDetails.length);
    if (orderDetails.orderItems.length === 0 && currentShop) {
      router.push('/shop/' + currentShop.name + '/' + currentShop.id);
    } else if (reload === 2 && orderDetails.orderItems.length === 0 && !currentShop) {
      router.push('/');
    }
    setReload(reload + 1)
  }, [orderDetails]);

  return (
    <>
      <Modal closeIcon open={open} onClose={() => setOpen(false)}>
        <AddressModelContainer isDesktop={isDesktop}>
          <h3>{t`Address Books`}</h3>
          <Divider />
          <AddressBook
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            getAddressesQuery={getAddressesQuery}
          />
          <Modal.Actions>
            <Button
              onClick={() => setOpen(false)}
              style={{ backgroundColor: '#ff614d', color: 'white' }}>
              <Icon name="check" /> Done
            </Button>
          </Modal.Actions>
        </AddressModelContainer>
        {/* <AddressChange setOpen={setOpen} /> */}
      </Modal>

      {orderDetails.shop && (
        <Container>
          <OrdersContainer>
            <h4 style={{ margin: 0 }}>Order from</h4>
            <h2 style={{ margin: 0 }}>{orderDetails.shop && orderDetails.shop.name}</h2>
            <Divider />
            <iframe
              width="100%"
              height="250"
              style={{ border: 10 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBugBL6F0x-jyq_4l-6OS1i8Du6yv9bH-s&q=
              ${orderDetails.shop.address}`}></iframe>
            <Divider />

            <Header>Delivery or Pick-up?</Header>
            <PickupContainer style={{ justifyContent: 'flex-start' }}>
              <Row onClick={() => setShippingMethod('Delivery')}>
                <RadioButton
                  readOnly
                  type="radio"
                  value={'Delivery'}
                  checked={orderDetails.shippingMethod === 'Delivery'}
                />
                <Column>
                  <H4>Delivery</H4>
                </Column>
              </Row>
              <Row style={{ marginLeft: 40 }} onClick={() => setShippingMethod('Pick-up')}>
                <RadioButton
                  readOnly
                  type="radio"
                  value={'Pick-up'}
                  checked={orderDetails.shippingMethod === 'Pick-up'}
                />
                <Column>
                  <H4>Pick-up</H4>
                </Column>
              </Row>
            </PickupContainer>

            {orderDetails.shippingMethod === 'Delivery' && (
              <>
                <H4>
                  Your Address:{' '}
                  {err && (
                    <span style={{ color: err && 'red' }}>
                      <Icon name="warning circle" />
                      You must add an address
                    </span>
                  )}
                </H4>
                <H4>
                  {defaultAddress ? (
                    <>
                      {defaultAddress.detail_address},&nbsp;
                      {defaultAddress.city},&nbsp;
                      {defaultAddress.province},&nbsp;
                      {defaultAddress.country}
                      <EditButton />
                    </>
                  ) : (
                    <EditButton add />
                  )}
                </H4>
                <H4>{defaultAddress && 'Receiver: ' + defaultAddress.name.toUpperCase()} </H4>
                <Form>
                  <Form.Group widths="equal">
                    <Form.Input
                      label="Phone Number"
                      placeholder="Phone Number"
                      value={defaultAddress && defaultAddress.phone}
                      onChange={(e) => {
                        handleChange(e.target.value, 'phone', defaultAddress.id);
                      }}
                    />
                    <Form.Input
                      label="Apt / Unit Number"
                      placeholder="Apt / Unit Number"
                      value={defaultAddress ? defaultAddress.unit_number : ''}
                      onChange={(e) => {
                        handleChange(e.target.value, 'unit_number', defaultAddress.id);
                      }}
                    />
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Input
                      label="Note / Delivery insturctions"
                      placeholder="Eg. Call me upon arrival or buzz number"
                      value={defaultAddress ? defaultAddress.note : ''}
                      onChange={(e) => {
                        handleChange(e.target.value, 'note', defaultAddress.id);
                      }}
                    />
                  </Form.Group>
                </Form>

                {/* <H4 style={{ marginLeft: 20 }}>{orderDetails.deliveryAddress.instructions}</H4> */}

                {/* <Header>Delivery Time</Header>
                <div>
                  <Button
                    color={deliveryTime === 'ASAP' ? 'green' : 'white'}
                    onClick={() => setDeliveryTime('ASAP')}>
                    ASAP: 20 - 30min
                  </Button>
                  <Button
                    color={deliveryTime === 'Schedule' ? 'green' : 'white'}
                    onClick={() => setDeliveryTime('Schedule')}>
                    Schedule
                  </Button>
                </div> */}
              </>
            )}
            <Header>Order Summary</Header>
            <p stype={{margin: 0}}>You can click item to edit</p>
            {orderDetails.orderItems &&
              orderDetails.orderItems[0] &&
              orderDetails.orderItems.map((item, i) => {
                return <OrderItem item={item} index={i} key={i} />;
              })}
            <Divider />
            <a
              style={{ cursor: 'pointer' }}
              onClick={() =>
                router.push(
                  '/shop/' + orderDetails.shop.name + '/' + orderDetails.shop.id + '#fullMenu'
                )
              }>
              + Add more items
            </a>
            <Divider />

            <TotalAmountList orderDetails={orderDetails} />

            <Divider />
            <Header>Payment method</Header>
            <Divider />

            <CheckoutButton
              onClick={() => {
                !loading && createOrderQuery();
              }}>
              {!loading ? (
                <>
                  <div>Place Order</div>
                  <div>${orderDetails.total}</div>
                </>
              ) : (
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <Icon name="spinner" loading />
                </div>
              )}
            </CheckoutButton>
            <div style={{ color: 'red', textAlign: 'center' }}>{err}</div>
          </OrdersContainer>
        </Container>
      )}
    </>
  );
};

const OrdersContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  padding: 80px 0px;
`;
const H4 = styled.h4`
  margin: 0 0 10px 0;
`;
const Edit = styled.a`
  cursor: pointer;
  margin-left: 10px;
`;
const CheckoutButton = styled.div`
  background-color: black;
  margin-top: 20px;
  margin-bottom: 10px;
  color: white;
  border-radius: 30px;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
`;
const PickupContainer = styled.div`
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
const AddressModelContainer = styled.div`
  margin: 20px auto;
  padding: 20px;
  max-width: 900px;
  /* border: ${(p) => p.isDesktop && 'solid 1px #d4d3d3'}; */
`;
export default checkout;
