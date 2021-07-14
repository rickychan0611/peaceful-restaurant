import { useEffect, useState } from 'react';
import moment from 'moment';
import useCurrentTime from './useCurrentTime';

const useIsShopOpen = (open_hours) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentTime = useCurrentTime();

  useEffect(() => {
    console.log('open_hours', open_hours)
    if (currentTime) {
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
  }, [currentTime])
  console.log(isOpen ? "Shop is opened" : "Shop is closed" )
   if (isOpen) return true
   return false
};

export default useIsShopOpen;
