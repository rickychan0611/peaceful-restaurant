import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import axios from "axios";
import { Container, Header, Icon, Divider } from "semantic-ui-react";
import styled from "styled-components";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  orderDetails as orderDetailsAtom,
  paymentMethodAtom
} from "../../data/orderAtoms.js";
import { loginPending as loginPendingAtom } from "../../data/atoms";
import { user as userAtom } from "../../data/userAtom";

import { useCookies } from "react-cookie";
import { useIsMobile } from "../../util/useScreenSize.js";
import { useIsDesktop } from "../../util/useScreenSize";

const payment_types = [
  { id: 1, title: 'CreditCard' },
  { id: 2, title: 'Alipay' },
  { id: 3, title: 'Wechatpay' },
  { id: 4, title: 'UnionPay' }
]

const paySelect = () => {
  const router = useRouter();
  const orderDetails = useRecoilValue(orderDetailsAtom);
  const [paymentMethod, setPaymentMethod] = useRecoilState(paymentMethodAtom);
  const user = useRecoilValue(userAtom);
  const isDesktop = useIsDesktop();
  const isMobile = useIsMobile();
  const { t } = useTranslation("profile");
  const [cookies] = useCookies(null);
  const [err, setErr] = useState();
  const [loading, setLoading] = useState(false);
  const [loginPending, setLoginPending] = useRecoilState(loginPendingAtom);

  const { orderid } = router.query; //2021-09-03 新增
  var { clientIp } = '0.0.0.0';

  const paymentSelectQuery = async () => {
    setErr();
    setLoading(true);

    try {

      // if (!user) {
      //   setLoginPending(true);
      //   router.push("/sign-in");
      //   throw new Error("Please login");
      // }

      //2021-09-07 新增
      const resIp = await axios.get('https://geolocation-db.com/json/');

      console.log("get clientIp sucessfully", resIp.data);
      if (resIp.data.IPv4) {
        clientIp = resIp.data.IPv4;
      }

      const body =
      {
        paymentmethod: paymentMethod,
        orderid: orderid,
        ismobile: isMobile,
        clientip: clientIp
      }

      console.log("body", body);

      const result = await axios.post(
        process.env.NEXT_PUBLIC_HOST_URL + "/api/pay/payorder",
        body,
        {
          headers: { Authorization: cookies.userToken }
        }
      );
      console.log("create order payment respond", result.data);
      if (result.data.code === 200) {
        localStorage.removeItem('orderpayinfo');
        if (typeof window !== 'undefined') {
          //const tempData = '<form id=\"alipaysubmit\" name=\"alipaysubmit\" action=\"https:\/\/globalmapi.alipay.com\/gateway.do?_input_charset=utf-8\" method=\"get\"><\/form>';
          var dataHtml = result.data.data;//var dataHtml = tempData;//
          var pay_method = result.data.paymethod;
          var pay_order_id = result.data.payorderid;
          //dataHtml = dataHtml.replaceAll("'","\'");
          //dataHtml = dataHtml.replaceAll("\"","\\\"");
          //dataHtml = dataHtml.replaceAll("&","\&");
          //dataHtml = dataHtml.replaceAll(">","\>");
          //dataHtml = dataHtml.replaceAll("/","\/");
          //dataHtml = dataHtml.replaceAll("\"",'');
          window.localStorage.setItem('orderpayinfo', dataHtml);//window.localStorage.setItem('orderpayinfo', result.data);//localStorage.setItem('orderpayinfo'.concat(orderid), data);
          //router.push("/consumer/payorder");

          router.push({
            pathname: '/consumer/payorder',
            query: {
              orderid: orderid,
              paymethod: pay_method,
              payorderid: pay_order_id
            }
          })
        }

      }
      else {
        throw new Error("Order payment failed, Please try again");
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setErr(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("orderDetails", orderDetails)
  })
  return (
    <>
      <Container>
        <OrdersContainer>
          <h4 style={{ margin: 0 }}>Ordering from</h4>
          <h2 style={{ margin: 0 }}>
            {orderDetails?.shop?.name}
          </h2>
          <Divider />
          <>
            <Header>
              *Please select payment method
            </Header>
            <PickupContainer>
              {payment_types.map((item, i) => {
                return (
                  <Row
                    onClick={() => {
                      setErr();
                      setPaymentMethod(item);
                    }}
                    style={{ marginRight: 10, marginBottom: 10 }}
                  >
                    <RadioButton
                      readOnly
                      type="radio"
                      // value={item.name}
                      checked={paymentMethod?.id === item.id}
                    />
                    <Column>
                      <H4>{item.title}</H4>
                    </Column>
                  </Row>
                )
              })}
            </PickupContainer>
          </>

          <Divider />

          <PaySelectButton
            onClick={() => {
              if (!paymentMethod) {
                setErr("Please select a payment method")
                return
              }
              !loading && paymentSelectQuery();
            }}
          >
            {!loading ? (
              <>
                <div>Pay this Order</div>
                <div>
                  ${orderDetails?.total}
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", width: "100%" }}>
                <Icon name="spinner" loading />
              </div>
            )}
          </PaySelectButton>

          <div style={{ color: "red", textAlign: "center" }}>{err}</div>
        </OrdersContainer>
      </Container>
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
const PaySelectButton = styled.div`
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
export default paySelect;
