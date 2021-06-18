import moment from 'moment';

const useIsShopOpen = (open_hours) => {
  console.log("open_hours", open_hours)
  const format = 'hh:mmaa';
  const week = moment().format('dddd').toLowerCase()
  const now = moment(moment(), format)
  const beforeTime = moment(open_hours[week].open, format)
  const afterTime = moment(open_hours[week].close, format)

  if (now.isBetween(beforeTime, afterTime)) {
    return true;
  } else return false;
};

export default useIsShopOpen;
