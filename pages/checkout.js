import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  Container,
  Button,
  Header,
  Icon,
  Divider,
  Modal,
  Input,
  Form,
} from "semantic-ui-react";
import styled from "styled-components";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  orderDetails as orderDetailsAtom,
  shippingMethod as shippingMethodAtom,
} from "../data/orderAtoms.js";
import {
  defaultAddress as defaultAddressAtom,
  addresses as addressAtom,
  currentShop as currentShopAtom,
  loginPending as loginPendingAtom,
} from "../data/atoms";
import { user as userAtom } from "../data/userAtom";

import { useCookies } from "react-cookie";
import OrderItem from "../components/OrderItem/";
import TotalAmountList from "../components/TotalAmountList/";
import AddressBook from "../components/AddressBook";
import { useIsDesktop } from "../util/useScreenSize";
import useTranslation from "next-translate/useTranslation";
import InputMask from "react-input-mask";
import useIsShopOpen from "../util/useIsShopOpen.js";
import useCurrentTime from "../util/useCurrentTime";
import moment from 'moment';

const checkout = () => {
  const router = useRouter();
  const orderDetails = useRecoilValue(orderDetailsAtom);
  const defaultAddress = useRecoilValue(defaultAddressAtom);
  const [shippingMethod, setShippingMethod] = useRecoilState(
    shippingMethodAtom
  );
  const user = useRecoilValue(userAtom);
  const [open, setOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const { t } = useTranslation("profile");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useRecoilState(addressAtom);
  const [cookies] = useCookies(null);
  const [err, setErr] = useState();
  const [loading, setLoading] = useState(false);
  const [currentShop, setCurrentShop] = useRecoilState(currentShopAtom);
  const [reload, setReload] = useState(0);
  const [tips_amount, setTips_amount] = useState({ tips: 0 });
  const [pickUpInfo, setPickupInfo] = useState({ name: "", phone: "" });
  const [loginPending, setLoginPending] = useRecoilState(loginPendingAtom);
  const isShopOpen = useIsShopOpen(orderDetails.shop && orderDetails.shop.id);
  const currentTime = useCurrentTime();

  const deliveryNow = () => {
    return (currentTime && currentTime.isBetween(
      moment("16:00", 'HH:mm'), 
      moment("21:00", 'HH:mm')
    ))
  }

   useEffect(() => {
    user &&
      setPickupInfo({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
      });
  }, [user]);

  const setTips = (value, name) => {
    console.log("tips", value);
    if (name !== "$")
      setTips_amount({ tips: orderDetails.subtotal * value, name });
    else setTips_amount({ tips: value, name });
  };

  const EditButton = ({ add }) => (
    <Edit
      onClick={() => {
        setOpen(true);
      }}
    >
      <Icon name={add ? "plus" : "edit"} />
      {add ? "Choose or add an address" : "edit"}
    </Edit>
  );

  const getAddressesQuery = async () => {
    try {
      const result = await axios.get(
        process.env.NEXT_PUBLIC_HOST_URL + "/api/user/address",
        {
          headers: { Authorization: cookies.userToken },
        }
      );
      // const sorted = result.data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      console.log(result.data.data);
      setAddresses(result.data.data);
      return;
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (value, name, id) => {
    if (id === "pickup") {
      setAddresses;
    } else {
      console.log(value);
      let temp = [...addresses];
      temp = temp.map((item) =>
        item.id === id ? { ...item, [name]: value } : item
      );
      console.log("temp", temp);
      setAddresses(temp);
    }
  };

  const handlePickupChange = (value, name) => {
    setPickupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const createOrderQuery = async () => {
    setErr();
    setLoading(true);
    console.log("placeOrderQuery", orderDetails);
    console.log("defaultAddress", defaultAddress);
    try {
      if (!user) {
        setLoginPending(true);
        router.push("/sign-in");
        throw new Error("Please login");
      }
      if (orderDetails.shippingMethod.id !== 1 && !defaultAddress) {
        throw new Error("Missing address. Please add an address");
      }
      if (
        orderDetails.shippingMethod.id == 1 &&
        (!pickUpInfo.first_name || !pickUpInfo.phone)
      ) {
        throw new Error("Name and phone number are required");
      } else {
        const body =
          orderDetails.shippingMethod.id === 1
            ? {
              shop_id: orderDetails.shop.id,
              items: orderDetails.orderItems,
              receiver_first_name: pickUpInfo.first_name,
              receiver_last_name: pickUpInfo.last_name,
              receiver_phone: pickUpInfo.phone,
              receiver_email: user.email,
              tips_amount: tips_amount.tips,
              shipping_amount: orderDetails.shippingMethod.fee,
              shipping_method_id: orderDetails.shippingMethod.id,
            }
            : {
              shop_id: orderDetails.shop.id,
              items: orderDetails.orderItems,
              receiver_first_name: defaultAddress.first_name,
              receiver_last_name: defaultAddress.last_name,
              receiver_phone: defaultAddress.phone,
              receiver_email: user.email,
              receiver_post_code: defaultAddress.post_code,
              receiver_country: defaultAddress.country,
              receiver_province: defaultAddress.province,
              receiver_city: defaultAddress.city,
              receiver_detail_address: defaultAddress.detail_address,
              receiver_unit_number: defaultAddress.unit_number,
              receiver_note: defaultAddress.note,
              tips_amount: tips_amount.tips,
              shipping_amount: orderDetails.shippingMethod.fee,
              shipping_method_id: orderDetails.shippingMethod.id,
            };
        console.log("body", body);
        const result = await axios.post(
          process.env.NEXT_PUBLIC_HOST_URL + "/api/user/order/create",
          body,
          {
            headers: { Authorization: cookies.userToken },
          }
        );
        console.log("create order respond", result.data);
        if (result.data.code === 200) {
          router.push({
            pathname: '/consumer/payselect',
            query: { orderid: result.data.data.id }
          });
        } else {
          throw new Error("Order failed. Please try again");
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
    console.log("orderDetails!!!!!!!!!!!!!!!!!", orderDetails);
    setCurrentShop(orderDetails.shop);
    console.log("currentShop!!!!!!!!!!!!!!!!!", currentShop);
    if (orderDetails.orderItems.length === 0 && currentShop) {
      router.push("/shop/" + currentShop.name + "/" + currentShop.id);
    } else if (
      reload === 2 &&
      orderDetails.orderItems.length === 0 &&
      !currentShop
    ) {
      router.push("/");
    }
    setReload(reload + 1);
  }, [orderDetails]);

  useEffect(() => {
    if (orderDetails.shippingMethod.id !== 1) {
      if (orderDetails.subtotal <= 40) {
        setErr("Attn: Shipping Method has been switched to self pick-up");
        setShippingMethod({ id: 1, fee: 0 });
      }
    }
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
              style={{ backgroundColor: "#ff614d", color: "white" }}
            >
              <Icon name="check" /> Done
            </Button>
          </Modal.Actions>
        </AddressModelContainer>
        {/* <AddressChange setOpen={setOpen} /> */}
      </Modal>

      {orderDetails.shop && orderDetails.shippingMethod && (
        <Container>
          <OrdersContainer>
            <h4 style={{ margin: 0 }}>You are ordering from</h4>
            <h1 style={{ marginTop: 10 }}>
              {orderDetails.shop && orderDetails.shop.name}
            </h1>
            <Divider />
            {/* //delivery only avaiable at broadway#2, kingsway#7, , prt.coq#8 */}
            {currentShop && !(currentShop.id === 2 || currentShop.id === 7 || currentShop.id === 8) ?
              <Header style={{ color: "red" }}>
                <Icon name="warning" circular size="small" />This location is for pick-up only.
              </Header>
              : <>
                <Header>
                  Delivery or Pick-up?
                </Header>
                <PickupContainer>
                  <Row
                    onClick={() => {
                      setErr();
                      setShippingMethod({ id: 1, fee: 0 });
                    }}
                    style={{ marginRight: 10, marginBottom: 10 }}
                  >
                    <RadioButton
                      readOnly
                      type="radio"
                      // value={item.name}
                      checked={orderDetails.shippingMethod.id === 1}
                    />
                    <Column>
                      <H4>Self pick-up</H4>
                    </Column>
                  </Row>

                  <Row
                    onClick={() => {
                      setErr();
                      orderDetails.subtotal < 40 && deliveryNow() &&
                        setErr("Sorry, your total amount is less than $40.");
                      orderDetails.subtotal >= 40 && deliveryNow() && 
                        setShippingMethod({ id: 2, fee: 0 });
                    }}
                    style={{ marginRight: 10, marginBottom: 10 }}
                  >
                    <RadioButton
                      readOnly
                      type="radio"
                      // value={item.name}
                      checked={orderDetails.shippingMethod.id === 2}
                    />
                    <Column>
                      <H4 style={{color: !deliveryNow() && "lightgrey"}}>Free delivery for order over $40 after 4:00pm</H4>
                    </Column>
                  </Row>
                  <div style={{ color: "red" }}>{err}</div>
                </PickupContainer>
              </>}

            {orderDetails.shippingMethod.id !== 2 && (
              <>
                <H4>Pick Up Address:</H4>
                {orderDetails.shop.address_line +
                  ", " +
                  orderDetails.shop.address_city}
                <br />
                Tel: {orderDetails.shop.phone}
                <br />
                <br />
                <Form>
                  <Form.Group widths="equal">
                    <Form.Input
                      fluid
                      required
                      label="Your Phone Number"
                      error={err && err.phone}
                      value={pickUpInfo.phone}
                      children={
                        <InputMask
                          mask="999-999-9999"
                          maskChar="_"
                          alwaysShowMask
                          placeholder="Your Phone Number"
                          value={pickUpInfo.phone}
                          onChange={(e) => {
                            handlePickupChange(e.target.value, "phone");
                          }}
                        />
                      }
                    />
                    <Form.Input
                      required
                      label="Your First Name"
                      placeholder="Your First Name"
                      value={pickUpInfo.first_name}
                      onChange={(e) => {
                        handlePickupChange(e.target.value, "first_name");
                      }}
                    />
                    <Form.Input
                      required
                      label="Your Last Name"
                      placeholder="Your Last Name"
                      value={pickUpInfo.last_name}
                      onChange={(e) => {
                        handlePickupChange(e.target.value, "last_name");
                      }}
                    />
                  </Form.Group>
                </Form>
              </>
            )}
            {orderDetails.shippingMethod.id === 2 && (
              <>
                <H4>
                  Delivery Address:{" "}<EditButton /> <br />
                  {err && (
                    <span style={{ color: err && "red" }}>
                      <Icon name="warning circle" />
                      You must add an address
                    </span>
                  )}
                </H4>
                <H4>
                  {defaultAddress ? (
                    <>
                      <Icon name="truck" /> {defaultAddress.detail_address},&nbsp;
                      {defaultAddress.city},&nbsp;
                      {defaultAddress.province},&nbsp;
                      {defaultAddress.country}
                      <br /><br />
                      <Icon name="user" /> {defaultAddress.first_name.toUpperCase() + " " + defaultAddress.last_name.toUpperCase()} <br /><br />
                      <Icon name="phone" /> {defaultAddress.phone}<br /><br />
                    </>
                  ) : (
                    <EditButton add />
                  )}
                </H4>
                <Form>
                  <Form.Group widths="equal">
                    <Form.Input
                      label="Note / Delivery insturctions"
                      placeholder="Eg. Call me upon arrival or buzz number"
                      value={defaultAddress ? defaultAddress.note : ""}
                      onChange={(e) => {
                        handleChange(e.target.value, "note", defaultAddress.id);
                      }}
                    />
                  </Form.Group>
                </Form>
              </>
            )}

            <Header>Order Summary</Header>
            <p stype={{ margin: 0 }}>You can click item to edit</p>
            {orderDetails.orderItems &&
              orderDetails.orderItems[0] &&
              orderDetails.orderItems.map((item, i) => {
                return <OrderItem item={item} index={i} key={i} />;
              })}
            <Divider />
            <a
              style={{ cursor: "pointer" }}
              onClick={() =>
                router.push(
                  "/shop/" +
                  orderDetails.shop.name +
                  "/" +
                  orderDetails.shop.id +
                  "#fullMenu"
                )
              }
            >
              + Add more items
            </a>
            <Divider />
            <TotalAmountList
              orderDetails={orderDetails}
              setTips={setTips}
              tips_amount={tips_amount}
            />
            <Divider />
            {/* <Header>Payment method</Header>
            <Divider /> */}
            <CheckoutButton isShopOpen={isShopOpen}
              onClick={() => {
                if (isShopOpen) {
                  !loading && createOrderQuery();
                }
                else {
                  alert("Sorry, we have been closed. Your order cannot be placed at this moment. Our business hours are from 11am - 9pm, 7 days a week. Please come black later. ")
                  setErr("We are now closed. Order cannot be placed. Business hours: 11am - 9pm")
                }
              }}
            >
              {!loading ? (
                <>
                  <div>Place Order</div>
                  <div>
                    ${(orderDetails.total + tips_amount.tips).toFixed(2)}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", width: "100%" }}>
                  <Icon name="spinner" loading />
                </div>
              )}
            </CheckoutButton>
            <div style={{ color: "red", textAlign: "center" }}>{err}</div>
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
  padding: 20px 0px 60px 0px;
`;
const H4 = styled.h4`
  margin: 0 0 10px 0;
`;
const Edit = styled.a`
  cursor: pointer;
  margin-left: 10px;
`;
const CheckoutButton = styled.div`
  background-color: ${p => p.isShopOpen ? "black" : "lightgray"};
  margin-top: 20px;
  margin-bottom: 10px;
  color: white;
  border-radius: 30px;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
`;
const PickupContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  /* align-items: center;
  justify-content: space-between; */
  margin-bottom: 20px;
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  input[type="radio"] {
    border: 0px;
    width: 1.2em;
    height: 1.2em;
    color: black;
  }
`;
const RadioButton = styled.input`
  margin-right: 5px;
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
  /* border: ${(p) => p.isDesktop && "solid 1px #d4d3d3"}; */
`;
export default checkout;
