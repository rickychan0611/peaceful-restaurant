import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';

const BottomAddBar = ({ index, remove, setOpen, quantity, setQty, price, addItem, updateItem, attributes, attributeTotal }) => {
  
  const total = () => {
    return +(Math.round(((+price + +attributeTotal) * +quantity) + "e+2")  + "e-2") }

  return (
    <>
      <BottomBar>
        <QtyContainer>
          <Icon
            name="minus circle"
            size="large"
            onClick={() => {
              updateItem ? updateItem(1, 'minus') : quantity > 1 && setQty(quantity - 1);
            }}
          />
          <QtyNum>{quantity}</QtyNum>
          <Icon
            name="plus circle"
            size="large"
            onClick={() => {
              updateItem ? updateItem(1, 'plus') : quantity > 0 && setQty(quantity + 1);
            }}
          />
        </QtyContainer>

        <QtyContainer>
          <AddButton
            onClick={() => {
              if (updateItem) {
                setOpen(false);
              } else addItem();
            }}>
            {quantity > 0 && !updateItem && `ADD $${total()}`}
            {quantity > 0 && updateItem && `UPDATE $${total()}`}
          </AddButton>
        </QtyContainer>
        {updateItem && <Remove onClick={() =>{
          setOpen(false) 
          remove(index)}}>
            <Icon name="close" />Remove</Remove>}
      </BottomBar>
    </>
  );
};

const Remove = styled.p`
  /* margin: 0 0 0 20px; */
  font-size: 12px;
  font-weight: bold;
  color: red;
  cursor: pointer;
  text-align: center;
  padding-right: 10px;
`;
const BottomBar = styled.div`
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: 70px;
  background-color: white;
  border-top: solid 1px #d1d1d1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  border-radius: 0 0 10px 10px;
`;
const AddButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  background-color: #9c0404;
  color: white;
  font-weight: bold;
  padding: 10px 25px 10px 25px;
  border-radius: 25px;
  cursor: pointer;
  text-align: center;
`;
const QtyContainer = styled.div`
  margin: 0 10px 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  cursor: pointer;
`;
const QtyNum = styled.h3`
  margin: 0;
  display: inline-block;
  margin: 0 10px 0 10px;
`;

export default BottomAddBar;
