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
import { useRouter } from "next/router";

const OrderReceipt = ({ order }) => {
  const router = useRouter();

  return (
    <>
      <OrdersContainer>
        <h4 style={{ margin: 0 }}>Order from</h4>
        <a
          onClick={() =>
            router.push("/shop/" + order.shop.name + "/" + order.shop.id)
          }
        >
          <h2 style={{ margin: 0 }}>
            {order.shop.name}
            <Icon name="linkify" size="small" />
          </h2>
        </a>
        <Divider />
        <>
          <H4>
            {order.receiver_name &&
              "Receiver: " + order.receiver_name.toUpperCase()}{" "}
          </H4>
          {order.receiver_detail_address ? (
            <>
              <H4>Your Address:</H4>
              <H4>
                {order.receiver_detail_address},&nbsp;
                {order.receiver_city},&nbsp;
                {order.receiver_province},&nbsp;
                {order.receiver_post_code},&nbsp;
                {order.receiver_country} <br />
                Tel: {order.receiver_phone}
                <br />
              </H4>
            </>
          ) : (
            <H4> Tel: {order.receiver_phone}</H4>
          )}
        </>
        <Header>Order Summary</Header>
        {order.order_items.map((item, i) => {
          return (
            <ItemContainer>
              <Code>{item.product_code}</Code>
              <Qty>
                <ItemName>{item.product_name}</ItemName>
              </Qty>

              <ItemText style={{ minWidth: "40px", marginRight: 5 }}>
                &nbsp;&nbsp; x {item.product_quantity}
              </ItemText>
              <div>
                {JSON.parse(item.product_attr).map((att) => {
                  console.log(att);
                  return (
                    att.options[0] &&
                    att.options.map((opt) => (
                      <p>
                        {att.name} : {opt.name}
                      </p>
                    ))
                  );
                })}
              </div>
              <ItemText style={{ minWidth: 70 }}>
                ${item.sub_total_amount}
              </ItemText>
            </ItemContainer>
          );
        })}
        {/* <Divider /> */}
        <TotalContainer>
          <Content>Subtotal:</Content>
          <Price>${order.sub_total_amount}</Price>
        </TotalContainer>
        <TotalContainer>
          <Content>Discount:</Content>
          <Price>-${order.discount ? order.discount : 0}</Price>
        </TotalContainer>
        <TotalContainer>
          <Content>Shipping fee:</Content>
          <Price>${order.shipping_amount}</Price>
        </TotalContainer>
        <TotalContainer>
          <Content>Taxes:</Content>
          <Price>${order.tax_amount}</Price>
        </TotalContainer>
        <TotalContainer>
          <Content>Tip:</Content>
          <Price>${order.tips_amount}</Price>
        </TotalContainer>
        <Divider />
        <TotalContainer>
          <Content>
            <span style={{ color: "black" }}>Total:</span>
          </Content>
          <Price>
            <span style={{ color: "black" }}>${+order.pay_amount}</span>
          </Price>
        </TotalContainer>
      </OrdersContainer>
    </>
  );
};

const Code = styled.div`
  border: 1px solid lightgray;
  margin-right: 10px;
  padding: 2px 3px 2px 3px;
  font-size: 14px;
  height: 100%;
  /* border-radius: 3px; */
`;
const TotalContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding: 7px 0;
`;
const Content = styled.div`
  color: "grey";
  font-size: 14px;
`;
const Price = styled.div`
  font-size: 14px;
`;
const OrdersContainer = styled.div`
  max-width: 600px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  padding: 10px;
`;
const H4 = styled.h4`
  margin: 0 0 10px 0;
`;
const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding: 15px 0;
  border-top: solid 1px #dbdbdb;
`;
const Qty = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
const ItemText = styled.p`
  margin: 0;
  font-size: 16px;
  text-align: right;
`;
const ItemName = styled.p`
  margin: 0;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  /* margin: 10px 0 10px 0; */
`;
export default OrderReceipt;
