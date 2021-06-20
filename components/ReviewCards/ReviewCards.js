import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { data } from '../../data/restaurants-old';
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'

import { useRecoilState } from 'recoil';
import {
  selections as selectionsAtom,
} from '../../data/atoms.js';

const ReviewCards = () => {
  const [dishes, setDishes] = useState([]);
  const {t} = useTranslation('home')

  const [selections, setSelections] = useRecoilState(selectionsAtom);

  useEffect(() => {
    let temp = [];
    let temp2 = [];
    let temp3 = [];
    data.categorys.map((item) => {
      temp.push(item);
    });
    temp.map((item) => {
      temp2.push(item['menu-items']);
    });
    temp2.map((item) => {
      let IMG_URL = `/img/food (${Math.floor(Math.random() * (86 - 1) + 1)}).jpg`;

      // const IMG_URL = `https://source.unsplash.com/featured/?dinning, steak${Math.floor(
      //   Math.random() * 10000
      // )}`;
      temp3.push({
        ...item,
        img: IMG_URL,
        description:
          'This is description. This is description. This is description. This is description. This is description. This is description. '
      });
    });
    temp3 = [].concat.apply([], temp3);

    let arr = [];
    for (var i = temp3.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tempArr = temp3[i];
      temp3[i] = temp3[j];
      temp3[j] = tempArr;
      arr.push(tempArr);
    }
    setDishes(arr);
  }, [selections]);

  return (
    <>
      {dishes[0] &&
        dishes.map((item, i) => {
          return (
            <Link href={'/restaurant/' + "peaceful-restaurant#reviews"} key={i}>
              <Card key={i} >
                <Img
                  src={item.img}
                />
                <Description> ⭐⭐⭐⭐⭐</Description>
                <Name>
                  I like it so much. The food is so good. I like it. I like it. I like it. I like
                  it. I like it.
                </Name>
                {/* <Description>{item.description}</Description> */}
                <Review>
                  Very first day of soft opening, so their service speed needs a little improvement;
                  otherwise they made use of this deadspace and turned into something quite
                  soothing. Great place to hang, and the food is like how it's advertised, clean and
                  delicate and very healthy.
                </Review>
                <Description>{t("ReadMore")}</Description>
                <br></br>
                <Description>{t("Name")}: Restaurant Name</Description>
                <Description>{t("location")}: Vacnouver</Description>
                <Description>{t("style")}: Chinese</Description>
              </Card>
            </Link>
          );
        })}
    </>
  );
};

// const Container = styled(ScrollContainer)`
//   overflow: auto;
//   display: flex;
// `;
const Card = styled.div`
  display: inline-block;
  position: relative;
  margin: 10px;
  width: 250px;
  cursor: pointer;
`;
const Img = styled.img`
  width: 250px;
  height: 150px;
  object-fit: cover;
`;
const Name = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  margin: 10px 0 10px 0;
  /* height: 100px; */
`;
const Review = styled.div`
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  margin-bottom: 5px;
`;
const Description = styled.div`
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Price = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: red;
  margin-top: 5px;
`;

export default ReviewCards;
