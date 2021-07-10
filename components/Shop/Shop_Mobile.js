import { useState } from 'react';
import styled from "styled-components";
import { Button, Icon } from "semantic-ui-react";
import { useRef } from "react";

import { useRecoilState } from "recoil";
import { currentShop as currentShopAtom } from "../../data/atoms";

import RestaurantMenu from "../RestaurantMenu";
import { Ref } from "semantic-ui-react";
import useTranslation from "next-translate/useTranslation";
import SearchBar from '../SearchBar';
import router from "next/router";

const Shop_Mobile = () => {
  const [currentShop] = useRecoilState(currentShopAtom);
  const contextRef = useRef();
  const { t } = useTranslation("shop");
  const [showSearch, setShowSearch] = useState(true);

  return (
    <>
      <div style={{
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "flex-end",
        alignItems: "center",
        position: "fixed",
        zIndex: 10000,
        bottom: 30,
        right: 20,
        width: "calc(100% - 38px)"
      }}>
        {showSearch ? 
        <div style={{
          padding: "12px 9px 12px 11px",
          backgroundColor: "lightgrey",
          borderRadius: 50,
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          width: 45
        }}
          onClick={() => {
            setShowSearch(!showSearch)
          }}>
          <SeachIcon name="search" size="large" />
        </div> :
          <SearchBar currentShop={currentShop} setShowSearch={setShowSearch}/>}
      </div>
      <div style={{ marginTop: 20 }}>
        <div style={{ marginTop: 20 }} />
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
    </>
  );
};

const SeachIcon = styled(Icon)`
  z-index: 100000;
  border: 0;
`
const Title = styled.h1`
  font-size: 7vw;
  margin: 0;
`;


export default Shop_Mobile;
