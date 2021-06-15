import { atom, selector } from 'recoil';

export const appReady = atom({
  key: 'appReady',
  default: false
});

export const selections = atom({
  key: 'selections',
  default: {cuisine: "all", category: "", restaurant: ""}
});

export const openSideMenu = atom({
  key: 'openSideMenu',
  default: false
});

export const openOrderSlide = atom({
  key: 'openOrderSlide',
  default: false
});

export const openCheckOutList = atom({
  key: 'openCheckOutList',
  default: false
});

export const currentItem = atom({
  key: 'currentItem',
  default: null
});

export const currentOrder = atom({
  key: 'currentOrder',
  default: null
});

export const currentShop = atom({
  key: 'currentShop',
  default: null
});

export const currentShopProducts = atom({
  key: 'currentShopProducts',
  default: null
});

export const currentCat = atom({
  key: 'currentCat',
  default: null
});

export const sliderCats = atom({
  key: 'sliderCats',
  default: null
});

export const searchValue = atom({
  key: 'searchValue',
  default: null
});

export const scrolling = atom({
  key: 'scrolling',
  default: 1
});

export const showCheckoutButton = atom({
  key: 'showCheckoutButton',
  default: true
});

export const slidersStates = atom({
  key: 'slidersStates',
  default: null
});

export const sliderPosition = atom({
  key: 'sliderPosition',
  default: {}
});

export const catChange = atom({
  key: 'catChange',
  default: false
});

export const currentPosition = atom({
  key: 'currentPosition',
  default: null
});

export const addresses = atom({
  key: 'addresses',
  default: null
});

export const useDefaultAddress = atom({
  key: 'useDefaultAddress',
  default: false
});

export const loginPending = atom({
  key: 'loginPending',
  default: false
});

export const defaultAddress = selector({
  key: 'defaultAddress',
  get: ({get}) => {
    return get(addresses) && get(addresses).find(item => item.default_status === 1)
  }
})