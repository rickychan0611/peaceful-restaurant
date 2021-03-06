import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Label, Sticky } from "semantic-ui-react";
import { Divider } from "semantic-ui-react";
import { useRecoilState } from "recoil";
import {
  currentShop as currentShopAtom,
  currentShopProducts as currentShopProductsAtom,
  currentShopPoplularProducts as currentShopPoplularProductsAtom,
  searchResults as searchResultsAtom,
  searchValue as searchValueAtom,
} from "../../data/atoms";

import ShopDishCards from "../../components/ShopDishCards";
import Slider from "../Slider/Slider.js";
import { useIsMobile } from "../../util/useScreenSize.js";
import { useIsDesktop } from "../../util/useScreenSize.js";
import useCurrentTime from "../../util/useCurrentTime.js";
import moment from 'moment';

import { trackWindowScroll } from "react-lazy-load-image-component";

const RestaurantMenu = ({ contextRef, t }) => {
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const isMobile = useIsMobile();
  const [, setLoading] = useState(true);
  const [currentShop] = useRecoilState(currentShopAtom);
  const [currentShopProducts] = useRecoilState(currentShopProductsAtom);
  const [currentShopPoplularProducts] = useRecoilState(
    currentShopPoplularProductsAtom
  );
  const [searchResults, setSearchResults] = useRecoilState(searchResultsAtom);
  const [searchValue] = useRecoilState(searchValueAtom);
  const [isLunchTime, setIsLunchTime] = useState(false);
  const currentTime = useCurrentTime();

  useEffect(() => {
    try {
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
    return () => setSearchResults()
  }, [currentShop]);

  //SET LUNCH TIME
  useEffect(() => {
    if (currentTime) {
      console.log("lunchtime", currentTime)
      const format = 'HH:mm'
      const now = moment(currentTime.format(format), format)
      const START = moment("11:00", format);
      const END = moment("14:45", format);
      const WEEK = currentTime.format("ddd")
      if (now.isBetween(START, END)) {
        if (WEEK === "Sat" || WEEK === "Sun") {
          setIsLunchTime(false)
        }
        else setIsLunchTime(true)
      }
      else setIsLunchTime(false)
    }
  }, [currentTime])

  return (
    <div style={{ position: "relative" }}>
      {/* Menu cat slider*/}
      {!isDesktop && (
        <Sticky offset={isMobile ? 80 : 70} context={contextRef}>
          <div>
            <Slider topic={t && t`FullMenu`} hideViewAll hideScrollbar>
              <CatWrapper>
                <LabelContainer
                  color="black"
                  onClick={() => {
                    router.push(
                      "/shop/" +
                      router.query.slug +
                      "/" +
                      router.query.shop_id +
                      "#popular"
                    );
                  }}
                >
                  Most Popular | ????????????
                </LabelContainer>
                {currentShop &&
                  currentShop.shop_categories &&
                  currentShop.shop_categories[0] &&
                  currentShop.shop_categories.map((item, i) => {
                    if (item.category_name !== "Popular Items") {
                      return (
                        <LabelContainer
                          color="black"
                          key={item.id}
                          onClick={() => {
                            router.push(
                              "/shop/" +
                              router.query.slug +
                              "/" +
                              router.query.shop_id +
                              "#" +
                              item.id
                            );
                          }}
                        >
                          {item.category_name}
                        </LabelContainer>
                      );
                    }
                  })}
              </CatWrapper>
            </Slider>
          </div>
        </Sticky>
      )}

      {/* Menu has 3 sections. search result, popular items and full menu*/}
      {/******** Search Results| ???????????? ********/}
      {isDesktop ? (
        <div id="result" style={{ paddingTop: 1 }} />
      ) : (
        <div id="result" style={{ paddingTop: 190, marginTop: -190 }} />
      )}

      {searchResults && searchResults[0] &&
        <MenuContainer>
          <>
            <CatTitle isMobile={isMobile}>
              <div className="jumptarget">{searchResults.length} results found for "{searchValue}" | ????????????</div>
            </CatTitle>
            <Divider />
            <CardContainer isMobile={isMobile}>
              {searchResults ?
                searchResults.map((product) => {
                  console.log("result", product)
                  return <ShopDishCards item={product} key={product.id} catName={product.shop_categories[0].category_name} isLunchTime={isLunchTime} />
                }) :
                <div>No result found.</div>
              }
            </CardContainer>
          </>
        </MenuContainer>
      }

      {/******** Most Popular | ???????????? ********/}
      <MenuContainer>
        {isDesktop ? (
          <div id="popular" style={{ paddingTop: 1 }} />
        ) : (
          <div id="popular" style={{ paddingTop: 190, marginTop: -190 }} />
        )}
        <CatTitle isMobile={isMobile}>
          <div className="jumptarget">Most Popular | ????????????</div>
        </CatTitle>
        <Divider />
        <CardContainer isMobile={isMobile}>
          {currentShopPoplularProducts &&
            currentShopPoplularProducts.map((product) => {
              return <ShopDishCards item={product} key={product.id} catName={product.shop_categories[0].category_name} isLunchTime={isLunchTime} />

            })}
          {!currentShopPoplularProducts && !currentShopPoplularProducts[0] && <div>No item found.</div>}
        </CardContainer>
      </MenuContainer>

      {/******** Full Menu ********/}
      {
        currentShop &&
        currentShop.shop_categories &&
        currentShop.shop_categories[0] &&
        currentShop.shop_categories.map((cat, i) => {
          let isEmpty = true;
          if (cat.category_name !== "Popular Items") {
            return (
              <MenuContainer key={i}>
                {isDesktop ? (
                  <div id={cat.id} style={{ paddingTop: 1 }} />
                ) : (
                  <div
                    id={cat.id}
                    style={{ paddingTop: 190, marginTop: -190 }}
                  />
                )}

                <CatTitle isMobile={isMobile}>
                  <div className="jumptarget">{cat.category_name}</div>
                </CatTitle>
                <Divider />
                {/* <hr/> */}
                <CardContainer isMobile={isMobile}>
                  {currentShopProducts &&
                    currentShopProducts.map((product) => {
                      if (
                        product.shop_categories.findIndex(
                          (item) => item.id === cat.id
                        ) !== -1
                      ) {
                        isEmpty = false;
                        return (
                          <ShopDishCards item={product} key={product.id} catName={cat.category_name} isLunchTime={isLunchTime} />
                        );
                      }
                    })}
                </CardContainer>
                {isEmpty && (
                  <div style={{ borderTop: "1px solid #dadada" }}>
                    No item found.
                  </div>
                )}
              </MenuContainer>
            );
          }
        })
      }
      <br />
    </div >
  );
};

const LabelContainer = styled.div({
  margin: 5,
  padding: "6px 15px",
  cursor: "pointer",
  textAlign: "left",
  borderRadius: 25,
  fontSize: 12,
  fontWeight: "bold",
  backgroundColor: "#e8ebe9",
  color: "black"
});
const CatWrapper = styled.div`
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      width: 100%;
      min-width: 100px;
      background-color: white;
      padding: 15px 0 8px 0;
      max-height: 140px;
      `;
const CardContainer = styled.div`
      padding-bottom: 30px;
      display: grid;
      grid-gap: ${(p) => (p.isMobile && !p.toggle ? "10px" : "15px")};
      grid-template-columns: ${(p) =>
    p.isMobile
      ? "repeat(auto-fill, minmax(150px, 1fr))"
      : "repeat(auto-fill, minmax(200px, 1fr))"};
      `;
const Anchor = styled.div`
      display: block;
      position: relative;
      top: 500;
      visibility: hidden;
      margin-top: -500;
      padding: 500;
      `;
const MenuContainer = styled.div`
      margin-bottom: 30px;
      `;
const CatTitle = styled.div`
      font-size: 24px;
      font-weight: bold;
      line-height: normal;
      /* scroll-margin-top: 160px;
      scroll-snap-margin-top: 160px; */
      padding-bottom: 10px;
      /* margin-top: 30px; */
      `;
export default trackWindowScroll(RestaurantMenu);
