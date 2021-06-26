import { useRouter } from "next/router";
import styled from "styled-components";

import { useRecoilState } from "recoil";
import {
  currentShop as currentShopAtom,
  currentItem as currentItemAtom,
} from "../../data/atoms.js";
import { Button, Label } from "semantic-ui-react";
import { LazyLoadImage } from "react-lazy-load-image-component";

const ShopDishCards = ({ item, scrollPosition }) => {
  const router = useRouter();
  const [currentItem, setCurrentItem] = useRecoilState(currentItemAtom);
  const [currentShop] = useRecoilState(currentShopAtom);

  return (
    <>
      <Card
        onClick={() => {
          // when click, save item in selectedItem Atom and selectedStore Atom.
          // then open item's page by using item's id
          setCurrentItem(item);
          console.log("ShopDishCards currentItem", currentItem);
          console.log("ShopDishCards currentShop", currentShop);
          router.push("/item/" + item.id);
        }}
      >
        <SpaceBetween>
          <div style={{position: "relative"}}>
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
          <Button
            basic
            size="tiny"
            style={{
              marginTop: 20,
              padding: 10,
              backgroundColor: "#9c0404",
              color: "white",
              width: "100%",
              borderRadius: 20,
            }}
          >
            Add to Card
          </Button>
        </SpaceBetween>
      </Card>
    </>
  );
};

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
  width: 32px;
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
