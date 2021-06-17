import { useEffect, useState } from 'react';
import ItemDetails from '../../components/ItemDetails';
import { HOST_URL } from '../../env';
import axios from 'axios';
import Head from 'next/head';
import { useRecoilState } from 'recoil';
import {
  currentItem as currentItemAtom
} from '../../data/atoms';
import { useRouter } from 'next/router';

const item = () => {
  const [currentItem, setCurrentItem] = useRecoilState(currentItemAtom);

  // const [getProduct, setGetProduct] = useState();
  const router = useRouter();

  useEffect(async () => {
    let product;
    if (!currentItem) {
      product = await axios.get(HOST_URL + '/api/singleproduct?product_id=' + router.query.item_id);
      console.log("product.data.data", product.data.data)
      setCurrentItem(product.data.data);
    }
  }, [router])

  return (
    <>
      {currentItem && <div>
        <Head>
          <title>{currentItem.name}</title>
        </Head>
        <ItemDetails />
      </div>}
    </>
  );
};

export default item;
