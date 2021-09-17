import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Head from 'next/head';
import styled from "styled-components";
import { useCookies } from "react-cookie";
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

const PayOrder = () => {
  const router = useRouter();
  const [paid, setPaid] = useState(false);
  var inputdataHtml = '';

  var inputScript = 'document.forms["alipaysubmit"].submit();';//const inputScript = 'document.forms["alipaysubmit"].submit();';
  const [cookies] = useCookies(null);
  const [err, setErr] = useState();
  const [loading, setLoading] = useState(false);
  const { orderid, paymethod, channelid, payorderid, redirectmethod } = router.query;
  const [check, setCheck] = useState(0);

  if (channelid != "ALIPAY_PC") inputScript = "";
  if (typeof window !== 'undefined') {
    //inputdata = window.localStorage.getItem('orderpayinfo'.concat(orderid));
    const itemData = window.localStorage.getItem('orderpayinfo');
    console.log("get orderpayinfo:", itemData);
    inputdataHtml = itemData;//inputdata = itemData ? JSON.parse(itemData) : initialValue;
    //inputdataHtml = inputdataHtml.replaceAll(/&amp;/g,"&");
    //inputdataHtml = inputdataHtml.replaceAll(/&lt;/g,"<");
    //inputdataHtml = inputdataHtml.replaceAll(/&gt;/g,">");
    //inputdataHtml = inputdataHtml.replaceAll(/&nbsp;/g," ");
    //inputdataHtml = inputdataHtml.replaceAll(/&quot/g,"'");
    console.log("getlocalStorage orderpayinfo:", inputdataHtml);
  };

  const getPayResultQuery = async () => {
    //setErr();
    setLoading(true);

    try {
      const body =
      {
        orderid: orderid,
        payorderid: payorderid,
        paymethod: paymethod
      };
      console.log("body", body);
      const result = await axios.post(
        process.env.NEXT_PUBLIC_HOST_URL + "/api/pay/payresult",
        body,
        {
          headers: { Authorization: cookies.userToken },
        }
      );
      console.log("get order payment result respond", result.data);
      if (result.data.code === 200) {
        //router.push("/consumer/order-success");
        if (result.data.status == "success") {
          setPaid(true);//支付成功
          router.push({
            pathname: '/consumer/payresult',
            query: {
              orderid: orderid,
              payorderid: payorderid,
              paymethod: paymethod
            }
          })
        }
        else//result.data.status=="failed"
        {

          setPaid(false);//还未支付
        }

      } else {
        //throw new Error("Order failed. Please try again"); 
      }
      setLoading(false);

    } catch (err) {
      console.log(err);
      setErr(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setInterval(() => {
      getPayResultQuery();
      setCheck(check + 1);
    }, 7500);
    return () => clearInterval(id);
  }, [check]);

  return (
    <>
      <Head><script type="text/javascript" dangerouslySetInnerHTML={{ __html: inputScript }}></script></Head>

      <h1 style={{ color: '#4ab976', textAlign: 'center', padding: 20 }}>
        Please pay this order,use your {paymethod} app to scan the QRcode!<br />
      </h1>

      <div className="text-container" dangerouslySetInnerHTML={{ __html: inputdataHtml }} />
      <center>
        <GetPayResultButton
          onClick={() => {
            !loading && getPayResultQuery();
          }}
        >
          {
            <>
              <div>GetPayResult</div>
            </>
          }
        </GetPayResultButton>
      </center>
      <center>
        {paid ? (<p>This order paid sucessfully,the page is going to another page!</p>) : (<p>This order is unpaid,Please pay this order!</p>)}
      </center>
      <Divider />
      <center>Debug Info:{inputdataHtml}</center>
      <center>check payment result executed {check} times</center>
    </>
  );
}

const GetPayResultButton = styled.div`
  background-color: black;
  margin-top: 20px;
  margin-bottom: 10px;
  color: white;
  border-radius: 30px;
  padding: 10px 20px;
  width:150px;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
`;

export default PayOrder