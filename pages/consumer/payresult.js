import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styled from "styled-components";
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

function PayResult(props) {
	const router = useRouter();
  
	//const [cookies] = useCookies(null);
	const [err, setErr] = useState();
	const [loading, setLoading] = useState(false);
	  
	const [reload, setReload] = useState(0);
	//const [tips_amount, setTips_amount] = useState({ tips: 0 });
	//const [pickUpInfo, setPickupInfo] = useState({ name: "", phone: "" });
	//const [loginPending, setLoginPending] = useRecoilState(loginPendingAtom);
  
	return (
		<>
			<Img src="/cook-girl.jpg" />
			<h1 The order Payment Result style={{ color: '#4ab976', textAlign: 'center' }}>
				Payment Result: {props.resultdata.data.paidInfo} <br />
			</h1>
			
			<Divider />
			<center>Debug Info: props.resultdata.code={props.resultdata.code}|props.resultdata.data.order_id={props.resultdata.data.order_id}
				|props.resultdata.data.paidStatus={props.resultdata.data.paidStatus}|props.resultdata.data.pay_amount={props.resultdata.data.pay_amount}  </center>
		</>
	)
}

PayResult.getInitialProps = async (context) => {
	//setLoading(true);
	var asPath = context.asPath;
	var index = asPath.indexOf("?");
	var asQuery = asPath.substring(index+1); 
	const result = await axios.get(
		process.env.NEXT_PUBLIC_HOST_URL + "/api/pay/payresult?" + asQuery);

	console.log("payment result respond", result.data);
	if (result.data.code == 200) 
	{
		//setLoading(false);
		return {
			resultdata: result.data  //props: { stars: result.data }
		}
	} 
	else 
	{
		//setLoading(false);
		return {
			resultdata: result.data //props: { stars: result.data }
		}
	}
	
}


const H4 = styled.h4`
  margin: 20px 20px 20px 20px;
`;
const Img = styled.img`
  height: 400px;
  width: 100%;
  object-fit: contain;
`;

export default PayResult;