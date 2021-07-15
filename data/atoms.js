import { atom, selector } from 'recoil';

export const appReady = atom({
  key: 'appReady',
  default: false
});

export const currentTime = atom({
  key: 'currentTime',
  default: new Date()
});

export const selections = atom({
  key: 'selections',
  default: {cuisine: "all", category: "", restaurant: ""}
});

export const selectedLocation = atom({
  key: 'selectedLocation',
  default: null
});

export const openDropdownMenu = atom({
  key: 'openDropdownMenu',
  default: false
});

export const openSwitchLocationModal = atom({
  key: 'openSwitchLocationModal',
  default: {open: false, item: {name: ""}}
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

export const currentShopPoplularProducts = atom({
  key: 'currentShopPoplularProducts',
  default: []
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

export const mapLoaction = atom({
  key: 'mapLoaction',
  default: null
});

export const searchResults = atom({
  key: 'searchResults',
  default: null
});

export const scrollTop = atom({
  key: 'scrollTop',
  default: 0
});


export const defaultAddress = selector({
  key: 'defaultAddress',
  get: ({get}) => {
    return get(addresses) && get(addresses).find(item => item.default_status === 1)
  }
})