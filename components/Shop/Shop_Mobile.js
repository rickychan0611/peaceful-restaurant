import styled from "styled-components";

import { useRef } from "react";

import { useRecoilState } from "recoil";
import { currentShop as currentShopAtom } from "../../data/atoms";

import RestaurantMenu from "../RestaurantMenu";
import { Ref } from "semantic-ui-react";
import useTranslation from "next-translate/useTranslation";

const Shop_Mobile = () => {
  const [currentShop] = useRecoilState(currentShopAtom);
  const contextRef = useRef();
  const { t } = useTranslation("shop");

  return (
    <div style={{ marginTop: 20 }}>
      <Title>{currentShop.name}</Title>
      <Ref innerRef={contextRef}>
        <div id="fullMenu">
          <RestaurantMenu t={t} contextRef={contextRef} />
        </div>
      </Ref>
      <br />
      <hr />
      <br />
    </div>
  );
};

const Title = styled.h1`
  font-size: 7vw;
  margin: 0;
`;

export default Shop_Mobile;
