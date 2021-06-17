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

  const [getProduct, setGetProduct] = useState();
  const router = useRouter();

  useEffect(async () => {
    let product;
    if (currentItem) {
      setGetProduct(currentItem);
    }
    else {
      product = await axios.get(HOST_URL + '/api/singleproduct?product_id=' + router.query.item_id);
      setGetProduct(product.data.data);
    }
  }, [router])

  return (
    <>
      {getProduct && <div>
        <Head>
          <title>{getProduct.name}</title>
        </Head>
        <ItemDetails getProduct={getProduct} />
      </div>}
    </>
  );
};

export default item;
