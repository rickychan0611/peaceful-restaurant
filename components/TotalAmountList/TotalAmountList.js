import { useState } from 'react';
import { Button, Modal, Label, Input } from 'semantic-ui-react';
import styled from 'styled-components';
import validator from 'validator';

const TotalAmountList = ({ orderDetails, setTips, tips_amount }) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState()
  
  const validate = (value) => {
    var t = value;
    return (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)) : t;
  }

  const handleChange = (value) => {
    setAmount(validate(value))
  }

  const handleSubmit = () => {
    setOpen(false)
    setTips(+amount, "$")
  }

  return (
    <>
      <Modal size="tiny" open={open} onClose={() => setOpen(false)}>
        <Modal.Header>Enter tips amount</Modal.Header>
        <Modal.Content>
          <Row style={{justifyContent: "center"}}>
          <Input label="$" type="text" placeholder="Amount" type='number' value={amount} onChange={(e) => handleChange(e.target.value)} />
          </Row>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button style={{color: "white", backgroundColor: "#ff614d"}} onClick={() => handleSubmit(false)}>
            OK
          </Button>
        </Modal.Actions>
      </Modal>

      <TotalContainer>
        <Content>Subtotal:</Content>
        <Price>${+orderDetails.subtotal.toFixed(2)}</Price>
      </TotalContainer>
      <TotalContainer>
        <Content>Discount:</Content>
        <Price>-${(+orderDetails.discount).toFixed(2)}</Price>
      </TotalContainer>
      <TotalContainer>
        <Content>Shipping fee:</Content>
        <Price>${(+orderDetails.shippingFee).toFixed(2)}</Price>
      </TotalContainer>
      <TotalContainer>
        <Content>Taxes:</Content>
        <Price>${(+orderDetails.taxTotal).toFixed(2)}</Price>
      </TotalContainer>

      {/* **** TIPS ******
      <TotalContainer>
        <Content>
          <Row>
            {' '}
            Tips:
            <TipsButton
              tips={tips_amount.name === '12%'}
              onClick={() => {
                setTips(0.12, '12%');
              }}>
              12%
            </TipsButton>
            <TipsButton
              tips={tips_amount.name === '15%'}
              onClick={() => {
                setTips(0.15, '15%');
              }}>
              15%
            </TipsButton>
            <TipsButton
              tips={tips_amount.name === '20%'}
              onClick={() => {
                setTips(0.2, '20%');
              }}>
              20%
            </TipsButton>
            <TipsButton
              tips={tips_amount.name === '$'}
              onClick={() => {
                setOpen(true)
              }}>
              $
            </TipsButton>
          </Row>
        </Content>
        <Price>${(tips_amount.tips ? tips_amount.tips : 0).toFixed(2)}</Price>
      </TotalContainer> */}

      <TotalContainer>
        <Content>
          <span style={{ color: 'black' }}>Total:</span>
        </Content>
        <Price>
          <span style={{ color: 'black' }}>
            ${(+orderDetails.total + tips_amount.tips).toFixed(2)}
          </span>
        </Price>
      </TotalContainer>
    </>
  );
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
`;
const TipsButton = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  background-color: ${(p) => (p.tips ? 'black' : '#d8d5d5')};
  color: ${(p) => (p.tips ? 'white' : 'black')};
  border-radius: 25px;
  padding: 0px 5px 0px 5px;
  font-size: 12px;
  margin-left: 10px;
  min-width: 40px;
  cursor: pointer;
`;
const TotalContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding: 7px 0;
`;
const Content = styled.div`
  color: 'grey';
  font-size: 14px;
`;
const Price = styled.div`
  font-size: 14px;
`;

export default TotalAmountList;
