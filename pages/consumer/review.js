import { useEffect, useState, useCallback } from 'react';
import { Header, Input, Image, Icon, Form, Button, Modal } from 'semantic-ui-react';
import styled from 'styled-components';
import useTranslation from 'next-translate/useTranslation';
import ReactStars from 'react-rating-stars-component';
import { useRecoilState } from 'recoil';
import { currentShop as currentShopAtom, currentOrder as currentOrderAtom } from '../../data/atoms';
import { user as userAtom } from '../../data/userAtom.js';
import { useRouter } from 'next/router';
import Loader from '../../components/Loader';
import ReviewForm from '../../components/ReviewForm';

import axios from 'axios';
import { CookiesProvider, useCookies } from 'react-cookie';

const Review = () => {
  const router = useRouter();
  const [currentOrder, setCurrentOrder] = useRecoilState(currentOrderAtom);
  const [reviews, setReviews] = useState([]);
  const [files, setFiles] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies();

  useEffect(() => {
    console.log("reviews" , reviews);
  }, [reviews]);

  useEffect(() => {
    console.log("currentOrder", currentOrder);
    if (!currentOrder) {
      router.push('/consumer/orders');
    }
    else {
      setReviews(currentOrder.reviews)
    }
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_HOST_URL + '/api/user/review/create', 
      {
        order_id: currentOrder.id,
        shop_id: currentOrder.shop_id,
        reviews
      },
       {
        headers: { Authorization: cookies.userToken }
      })
      console.log("review response", response)
      if (response.data.code === 200) {
        router.push('/consumer/orders');
      }
      else {throw ("Error: " + response.data.message)}
    }
    catch (err) {
      console.log(err)
      alert(err)
    }
  };

  return (
    <>
      {!currentOrder ? (
        <Loader />
      ) : (
        <Container style={{ paddingTop: 30, maxWith: 500 }}>
          <Wrapper>
            {/* <h1>Create review</h1> */}
            <h3>@{currentOrder.shop.name}</h3>
            {/* <h4>{currentOrder.shop.name}</h4> */}

            {currentOrder && currentOrder.order_items && currentOrder.order_items[0] && 
            currentOrder.order_items.map((item, i) => {
              // console.log("item", item)
              return (
                <ReviewForm
                  key={i}
                  item={item}
                  reviews={reviews}
                  currentOrder={currentOrder}
                  handleSubmit={handleSubmit}
                  files={files}
                  setFiles={setFiles}
                  setReviews={setReviews}
                />
              );
            })}
            
          </Wrapper>
        </Container>
      )}
    </>
  );
};

const CloseIcon = styled.div`
  position: absolute;
  right: 0;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.4);
  padding: 2px 2px 4px 4px;
`;
const Title = styled.div`
  font-size: 14px;
  font-weight: bold;
`;
const Row = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 30px;
`;
const ReviewImage = styled(Image)`
  height: 100px;
  width: 100px;
  object-fit: cover;
`;
const StarWrapper = styled.div`
  margin: 10px 0 10px 0;
  height: 100%;
  span {
    height: 40px;
    margin-left: 5px;
  }
`;
const Wrapper = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 600px;
  /* height: 100vh; */
`;
const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 15px;
`;
export default Review;
