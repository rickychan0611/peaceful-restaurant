import { useState } from 'react';
import { useRouter } from 'next/router';
import Loader from '../Loader';

import { useRecoilState } from 'recoil';
import {
  currentItem as currentItemAtom,
  currentShop as currentShopAtom,
  openCheckOutList as openCheckOutListAtom,
} from '../../data/atoms.js';
import { orderItems as orderItemsAtom } from '../../data/orderAtoms.js';

import BottomAddBar from '../BottomAddBar';
import ItemDetailsContext from '../ItemDetailsContext';
import { useEffect } from 'react';
import { uid } from 'react-uid';
import { Button, Modal } from 'semantic-ui-react';

const ItemDetails = ( ) => {
  const router = useRouter();
  const [orderItems, setOrderItems] = useRecoilState(orderItemsAtom);
  const [item] = useRecoilState(currentItemAtom);
  const [currentShop] = useRecoilState(currentShopAtom);
  const [loading] = useState(true);
  const [attributes, setAttributes] = useState([]);
  const [attributeTotal, setAttributeTotal] = useState(0);
  const [openWarning, setOpenWarning] = useState(false);
  const [quantity, setQty] = useState(1);
  const [, setOpenCheckOutList] = useRecoilState(openCheckOutListAtom);

  const replacePrevItems = () => {
    let updatedItems;

    setOrderItems(() => {
      updatedItems = [{ ...item, attributeTotal, quantity, shop: currentShop, uid: uid(item) }];
      localStorage.setItem('orderItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
    setOpenWarning(false);
    console.log("item.fromHomePage", item.fromHomePage)
    item.fromHomePage ? router.push("/shop/" + item.shop.name + "/" + item.shop.id) : router.back();
  };

  //function: addItem is called in <BottomAddBar>,
  //update orderItems and localstorage, and then redirect to store's page
  const addItem = () => {
    console.log('ItemDetails currentShop', currentShop);
    console.log('ItemDetails orderItems', orderItems);
    console.log('ItemDetails item.attributes!!!', item.attributes);
    console.log('ItemDetails attributes!!!', attributes);
    console.log("ItemDetails item.fromHomePage", item)

    //if a prev store's name is equal to the current store, update the object
    if (orderItems.length === 0 || (orderItems[0] && orderItems[0].shop.id) === currentShop.id) {
      setOrderItems((prev) => {
        return [{ ...item, attributeTotal, quantity, shop: currentShop, uid: uid(item) }, ...prev];
      });
      item.fromHomePage ? router.push("/shop/" + currentShop.name + "/" + icurrentShop.id) : router.back();
    } else {
      setOpenWarning(true);
    }
  };

  useEffect(() => {
    let total = 0;
    item &&
      item.attributes &&
      item.attributes.forEach((att) => {
        att.options[0] &&
          att.options.forEach((opt) => {
            console.log(opt.option_price);
            total = total + opt.option_price * (opt.quantity ? opt.quantity : 0);
          });
      });
    console.log('setAttributeTotal', total);

    setAttributeTotal(total);
  }, [item]);

  return (
    <>
      <Modal open={openWarning}>
        <Modal.Header>Oops... different restaurant</Modal.Header>
        <Modal.Content>
          Your shopping cart contains items from a differnet restaurant. If you add this item, all
          items in the cart will be removed. <a onClick={()=>{
             setOpenWarning(false)
            setOpenCheckOutList(true)}}>Check Cart</a>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpenWarning(false)}>NO</Button>
          <Button onClick={() => replacePrevItems()}>ADD</Button>
        </Modal.Actions>
      </Modal>

      {!item ? (
        <Loader loading={loading} />
      ) : (
        <>
          <ItemDetailsContext attributes={attributes} setAttributes={setAttributes} />
          <BottomAddBar
            attributeTotal={attributeTotal}
            attributes={attributes}
            quantity={quantity}
            setQty={setQty}
            price={item.promotion_price === null ? item.price : item.promotion_price}
            addItem={addItem}
          />
        </>
      )}
    </>
  );
};

export default ItemDetails;
