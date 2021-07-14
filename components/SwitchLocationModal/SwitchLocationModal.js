import { useState } from 'react';
import { useRouter } from 'next/router';
import { Modal, Button } from 'semantic-ui-react';
import { useRecoilState } from 'recoil';
import { openSwitchLocationModal as openSwitchLocationModalAtom } from '../../data/atoms.js';
import { selectedLocation as selectedLocationAtom } from '../../data/atoms.js';
import { openDropdownMenu as openDropdownMenuAtom } from '../../data/atoms.js';
import { currentShop as currentShopAtom } from '../../data/atoms.js';
import { orderItems as orderItemsAtom } from "../../data/orderAtoms.js";

const SwitchLocationModal = () => {
  const router = useRouter();
  const [openSwitchLocationModal, setOpenSwitchLocationModal] = useRecoilState(openSwitchLocationModalAtom);
  const [selectedLocation, setSelectedLocation] = useRecoilState(selectedLocationAtom);
  const [orderItems, setOrderItems] = useRecoilState(orderItemsAtom);
  const [openDropdownMenu, setOpenDropdownMenu] = useRecoilState(openDropdownMenuAtom);
  const [currentShop, setCurrentShop] = useRecoilState(currentShopAtom);

  return (
    <>
      <Modal open={openSwitchLocationModal.open}>
        <Modal.Header>Switching location</Modal.Header>
        <Modal.Content>You are about to switch location to <b>{openSwitchLocationModal.item.name}</b>,
          all items in the shopping cart will be removed.</Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpenSwitchLocationModal({ open: false, item: { name: "" } })}>No</Button>
          <Button color="green" onClick={() => {
            router.push('/shop/' + openSwitchLocationModal.item.name + '/' + openSwitchLocationModal.item.id);
            localStorage.removeItem("orderItems")
            setSelectedLocation(openSwitchLocationModal.item);
            setOrderItems([]);
            setOpenSwitchLocationModal({ open: false, item: { name: "" } });
            setOpenDropdownMenu(false)
            setCurrentShop(openSwitchLocationModal.item)
          }}>OK</Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default SwitchLocationModal;
