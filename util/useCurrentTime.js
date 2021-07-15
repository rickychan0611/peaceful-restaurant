import { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';

const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(moment());

  useEffect(async () => {
    const getCurrentTime = await axios.get(process.env.NEXT_PUBLIC_HOST_URL + "/api/gettime")
    // setCurrentTime(moment(getCurrentTime.data.data))
    setCurrentTime(moment("2021-07-18 22:32:58"))
  }, []);

  return currentTime
};

export default useCurrentTime;
