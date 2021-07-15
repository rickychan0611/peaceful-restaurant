import { useEffect, useState } from 'react';
import moment from 'moment';
import useCurrentTime from './useCurrentTime';
import { useRouter } from 'next/router';
import addresses from '../addresses';
import { useRecoilState } from "recoil";
import { selectedLocation as selectedLocationAtom } from "../data/atoms";

const useIsShopOpen = (locationId) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const currentTime = useCurrentTime();
  const index = addresses.findIndex(item => +item.id === locationId );
  const open_hours = index !== -1 && addresses[index].open_hours;

  useEffect(() => {
    if (currentTime && open_hours) {
      const week = currentTime.format('dddd').toLowerCase()
      console.log('week', week)
      const format = 'hh:mmaa';
      const beforeTime = moment(open_hours[week].open, format)
      const afterTime = moment(open_hours[week].close, format)

      if (currentTime.isBetween(beforeTime, afterTime)) {
        setIsOpen(true)
      }
      else setIsOpen(false)
    }
  }, [currentTime, index])

  console.log(isOpen ? "Shop is opened" : "Shop is closed" )
   if (isOpen) return true
   return false
};

export default useIsShopOpen;
