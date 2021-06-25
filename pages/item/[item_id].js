import { useEffect, useState } from 'react';
import BackToShopButton from '../../components/BackToShopButton';
import BackButton from '../../components/BackButton';
import ItemDetails from '../../components/ItemDetails';

import axios from 'axios';
import Head from 'next/head';
import { useRecoilState } from 'recoil';
import {
  currentItem as currentItemAtom
} from '../../data/atoms';
import { useRouter } from 'next/router';

const item = () => {
  const [currentItem, setCurrentItem] = useRecoilState(currentItemAtom);
  const [freshLoaded, setFreshLoaded] = useState(false);
  const router = useRouter();
 
  useEffect(async () => {
    let product;
    if (!currentItem) {
      product = await axios.get(process.env.NEXT_PUBLIC_HOST_URL + '/api/singleproduct?product_id=' + router.query.item_id);
      console.log("product.data.data", product.data.data)
      setCurrentItem(product.data.data);
    }
  }, [router]);

  useEffect(async () => {
    if (!currentItem) {
      setFreshLoaded(true)
    }
  }, []);

  return (
    <>
      {currentItem && <div>
        <Head>
          <title>{currentItem.name}</title>
        </Head>
       {freshLoaded ? <BackToShopButton />: <BackButton />}
        <ItemDetails />
      </div>}
    </>
  );
};

export default item;
