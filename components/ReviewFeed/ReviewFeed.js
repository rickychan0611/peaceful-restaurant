import { Feed, Rating, Image, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { currentShop as currentShopAtom } from '../../data/atoms';
import moment from 'moment';
import ReactStars from 'react-rating-stars-component';
import Link from 'next/link'

const ReviewFeed = () => {
  const [currentShop] = useRecoilState(currentShopAtom);

  return (
    <>
      <Rating icon="heart" defaultRating={3} maxRating={4} />
      {currentShop && currentShop.reviews && currentShop.reviews[0] &&
        currentShop.reviews.map((item, i) => {
          return (
            <Feed key={i}>
              <Feed.Event>
                <Feed.Label>
                  <Image
                    src={item.images ? HOST_URL + '/storage/' + item.images : '/avatar.jpg'}
                    avatar
                    size="mini"
                  />
                </Feed.Label>
                <Feed.Content>
                  <Feed.Summary>
                    <Feed.User>{item.user_nickname}</Feed.User>
                    <Feed.Date>
                      {moment(item.updated_at).format('MMM DD, YYYY | h : mma')}
                    </Feed.Date>
                  </Feed.Summary>
                  <Link href={"/item/" + item.product_id}>{item.product_name}</Link>
                  <Row>
                    <ReactStars
                      count={5}
                      // onChange={ratingChanged}
                      size={22}
                      activeColor="#ffd700"
                      isHalf={true}
                      value={item.rating}
                    />
                    <span style={{ paddingTop: 5 }}>{" " + item.rating}</span>
                  </Row>

                  <Feed.Extra text>{item.content}</Feed.Extra>
                </Feed.Content>
              </Feed.Event>
            </Feed>
          );
        })}
    </>
  );
};

const Row = styled.div`
  display: flex;
  /* justify-content: center; */
  align-items: center;
`;

export default ReviewFeed;
