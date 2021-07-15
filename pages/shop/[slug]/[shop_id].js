import { useEffect, useState } from "react";
import {
  Container,
  Dimmer,
  Loader,
  Button,
  Header,
  Icon,
} from "semantic-ui-react";
import Head from "next/head";
import axios from "axios";

import { useIsDesktop } from "../../../util/useScreenSize";
import styled from "styled-components";
import useIsShopOpen from "../../../util/useIsShopOpen";
import addresses from "../../../addresses";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import {
  currentShop as currentShopAtom,
  currentShopProducts as currentShopProductsAtom,
  currentShopPoplularProducts as currentShopPoplularProductsAtom,
} from "../../../data/atoms";

import Shop_Desktop from "../../../components/Shop/Shop_Desktop";
import Shop_Mobile from "../../../components/Shop/Shop_Mobile";

const shop = ({ getSingleShop, getShopProducts, getPopProducts }) => {
  const isDesktop = useIsDesktop();
  const [currentShop, setCurrentShop] = useRecoilState(currentShopAtom);
  const [, setCurrentShopProducts] = useRecoilState(currentShopProductsAtom);
  const [, setCurrentShopPoplularProducts] = useRecoilState(
    currentShopPoplularProductsAtom
  );
  const router = useRouter();
  // const index = addresses.findIndex((item) => +item.id === +router.query.shop_id);
  // const isShopOpen = router && useIsShopOpen(addresses[index].open_hours);
  // const [isShopOpen, setIsShopOpen] = useState(true);
  const isShopOpen = useIsShopOpen(+router.query.shop_id);

  useEffect(async () => {
    setCurrentShop(getSingleShop);
    setCurrentShopProducts(getShopProducts);
    setCurrentShopPoplularProducts(getPopProducts);
    console.log("Single shop", getSingleShop);
    console.log("getShopProducts", getShopProducts);
    console.log("Popular", getPopProducts);

    //update shop status`
    const getShop = await axios.get(
      process.env.NEXT_PUBLIC_HOST_URL + "/api/singleshop",
      {
        params: { shop_id: getSingleShop.id },
      }
    );
    setCurrentShop(getShop.data.data);
  }, [getSingleShop]);

  // useEffect(() => {
  //   //check if store open
  //   const index = addresses.findIndex(
  //     (item) => +item.id === +router.query.shop_id
  //   );
  //   let open = useIsShopOpen(addresses[index].open_hours);
  //   setIsShopOpen(open);
  // }, [router]);

  return (
    <>
      {currentShop && currentShop.status === 4 && (
        <div
          style={{
            position: "fixed",
            top: 0,
            width: "100%",
            height: "100vh",
            zIndex: 1000,
          }}
        >
          <Dimmer active={currentShop && currentShop.status === 4}>
            <Header icon>
              <h1 style={{ fontSize: 50, marginBottom: 30 }}>😅</h1>
              <h4 style={{ color: "white" }}>
                Sorry, this location is temporarily closed.
              </h4>
              <Button
                color="green"
                inverted
                style={{ marginTop: 60 }}
                onClick={() => {
                  router.push("/");
                }}
              >
                Back to home
              </Button>
            </Header>
          </Dimmer>
        </div>
      )}

      {!isShopOpen && (
        <MessageContainer>
          <Message>
            <Icon name="warning circle" />
            This store is now closed. Open hours: Mon - Sun, 11am - 9pm
          </Message>
        </MessageContainer>
      )}

      <div>
        <Head>
          <title>{currentShop && currentShop.name}</title>
        </Head>
        <Container>
          {!currentShop || currentShop === "not found" ? (
            <div style={{ height: "80vh" }}>
              <Dimmer inverted active={!currentShop}>
                <Loader active content="Loading" />
              </Dimmer>
            </div>
          ) : isDesktop ? (
            <Shop_Desktop />
          ) : (
            <>
              <Shop_Mobile />
            </>
          )}
        </Container>
        {/* {currentShop && <Footer />} */}
      </div>
    </>
  );
};

// export const getServerSideProps = async (context) => {
//   context.res.setHeader("Cache-Control", "s-maxage=300"); // last 1 hr

export const getStaticProps = async (context) => {
  const getSingleShop = await axios.get(
    process.env.NEXT_PUBLIC_HOST_URL + "/api/singleshop",
    {
      params: { shop_id: context.params.shop_id },
    }
  );

  const getShopProducts = await axios.get(
    process.env.NEXT_PUBLIC_HOST_URL + "/api/shopproducts",
    {
      params: {
        shop_id: context.params.shop_id,
        category_id: "all",
      },
    }
  );

  const getPopProducts = await axios.get(
    process.env.NEXT_PUBLIC_HOST_URL + "/api/shopproducts",
    {
      params: {
        shop_id: context.params.shop_id,
        category_id: "popular",
      },
    }
  );

  return {
    props: {
      getSingleShop: getSingleShop.data.data,
      getShopProducts: getShopProducts.data.data,
      getPopProducts: getPopProducts.data.data,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    revalidate: 180, // In 180 seconds
  };
};

export const getStaticPaths = async () => {
  return {
    paths: [
      { params: { shop_id: "2", slug: "Broadway" }, locale: "en" },
      { params: { shop_id: "3", slug: "Mount%20Pleasant" }, locale: "en" },
      { params: { shop_id: "4", slug: "Kitsilano" }, locale: "en" },
      { params: { shop_id: "5", slug: "Seymour" }, locale: "en" },
      { params: { shop_id: "6", slug: "Newton" }, locale: "en" },
      { params: { shop_id: "7", slug: "Kingsway" }, locale: "en" },
      { params: { shop_id: "8", slug: "Port%20Coquitlam" }, locale: "en" },
      { params: { shop_id: "9", slug: "Richmond" }, locale: "en" },
      { params: { shop_id: "2", slug: "Broadway" }, locale: "zh-CN" },
      { params: { shop_id: "3", slug: "Mount%20Pleasant" }, locale: "zh-CN" },
      { params: { shop_id: "4", slug: "Kitsilano" }, locale: "zh-CN" },
      { params: { shop_id: "5", slug: "Seymour" }, locale: "zh-CN" },
      { params: { shop_id: "6", slug: "Newton" }, locale: "zh-CN" },
      { params: { shop_id: "7", slug: "Kingsway" }, locale: "zh-CN" },
      { params: { shop_id: "8", slug: "Port%20Coquitlam" }, locale: "zh-CN" },
      { params: { shop_id: "9", slug: "Richmond" }, locale: "zh-CN" },
    ],
    fallback: "blocking",
  };
};

const MessageContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  background-color: #eeee8a;
  justify-content: center;
  align-items: center;
  width: 100vw;
  /* height: 40px; */
`;
const Message = styled.div`
  color: red;
  padding: 15px;
`;

export default shop;
