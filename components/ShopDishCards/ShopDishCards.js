import { useRouter } from "next/router";
import styled from "styled-components";

import { useRecoilState } from "recoil";
import {
  currentShop as currentShopAtom,
  currentItem as currentItemAtom,
} from "../../data/atoms.js";
import { Button, Label } from "semantic-ui-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import moment from 'moment';

const ShopDishCards = ({ item, scrollPosition, catName }) => {
  const router = useRouter();
  const [currentItem, setCurrentItem] = useRecoilState(currentItemAtom);
  const [currentShop] = useRecoilState(currentShopAtom);

  const isLunchTime = () => {
    const format = 'HH:mm'
    const now = moment();

    // const START = moment("2021-07-19 11:00", 'YYYY-MM-DD hh:mm');
    // const END = moment("2021-07-19 14:00", 'YYYY-MM-DD hh:mm');
    const START = moment("12:00", format);
    const END = moment("14:45", format);
    const WEEK = now.format("ddd")
    console.log(WEEK)
    
    if (now.isBetween(START, END)) {
      if (WEEK === "Sat" || WEEK === "Sun") {
        console.log("weekend")
        return false
      }
      return true
    }
    return false
  }

  return (
    <>
      <Card
        onClick={() => {
          if (catName === "Lunch Special | 特價午餐" && !isLunchTime()) {
            alert("Lunch Special is available from 11am - 2:45pm (Mon. - Fri.)")
            return;
          }
          else {
            setCurrentItem(item);
            console.log("ShopDishCards currentItem", currentItem);
            console.log("ShopDishCards currentShop", currentShop);
            router.push("/item/" + item.id);
          }
        }}
      >
        <SpaceBetween>
          <div style={{ position: "relative" }}>
            <Code>{item.code}</Code>
            {item.images && item.images[0] ? (
              <Img
                key={item.name}
                alt={item.name}
                src={
                  process.env.NEXT_PUBLIC_HOST_URL +
                  "/storage/" +
                  JSON.parse(item.images)[0]
                }
                // effect="opacity"
                scrollPosition={scrollPosition}
                width={"100%"}
                height={180}
                placeholderSrc="/no-image.png"
              />
            ) : (
              <Img
                key={item.name}
                alt={item.name}
                src="/no-image.png"
                scrollPosition={scrollPosition}
                width={"100%"}
                height={180}
              />
            )}
            <Row>
              <Name>
                {" "}
                <span
                  dangerouslySetInnerHTML={{
                    __html: item.name.replace("|", "<br />"),
                  }}
                />
              </Name>
            </Row>
            <Description>{item.description}</Description>
            {!item.promotion_price ? (
              <Price>
                <span style={{ marginRigth: 5, color: "black" }}>
                  ${item.price}
                </span>
              </Price>
            ) : (
              <Price>
                <span
                  style={{
                    textDecoration: "line-through",
                    marginRigth: 5,
                    color: "black",
                  }}
                >
                  ${item.price}
                </span>{" "}
                ${item.promotion_price}
              </Price>
            )}
            {/* <Description>by: {item.shop.name}</Description> */}
          </div>
          {catName === "Lunch Special | 特價午餐" ?
            <AddButton isLunchTime={!isLunchTime()}>Add to Cart</AddButton> :
            <AddButton>Add to Cart</AddButton>}
        </SpaceBetween>
      </Card>
    </>
  );
};

const AddButton = styled.div({
  textAlign: "center",
  marginTop: 20,
  padding: 8,
  backgroundColor: p => p.isLunchTime ? "#c7c0c0" : "#9c0404",
  color: "white",
  width: "100%",
  borderRadius: 20,
});
const Row = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;
const Code = styled.span`
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color:rgba(0,0,0,0.7);
  padding: 2px 4px 2px 4px;
  font-size: 15px;
  height: 32px;
  min-width: 32px;
  margin-right: 10px;
  font-weight: 600;
`;
const SpaceBetween = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  height: 100%;
`;
const Card = styled.div`
  display: inline-block;
  position: relative;
  /* margin: 10px; */
  width: 100%;
  /* max-width: 200px; */
  cursor: pointer;
  margin-bottom: 20px;
`;
const Img = styled(LazyLoadImage)`
  object-fit: cover;
`;
const Name = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
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

export default ShopDishCards;
