import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import axios from 'axios';
import { HOST_URL } from '../env';
import { useIsDesktop } from '../util/useScreenSize';
import { useIsMobile } from '../util/useScreenSize';
import useTranslation from 'next-translate/useTranslation';
import { Modal, Icon, Visibility } from 'semantic-ui-react';
import CheckOutListPusher from '../components/CheckOutListPusher';
import Map from '../components/Map';
import addresses from '../addresses';

const MapModal = ({ open, setOpen }) => {
  const { t } = useTranslation('home');
  return (
    <Modal open={open} closeIcon onClose={() => setOpen(false)}>
      <Map addresses={addresses}/>
    </Modal>
  );
};

const Home = ({ allshops }) => {
  const router = useRouter();
  const { t } = useTranslation('home');
  const [open, setOpen] = useState(false);
  const [cal, setCal] = useState({});
  const isDesktop = useIsDesktop();
  const isMobile = useIsMobile();

  useEffect(() => {
    console.log('allshops', allshops);
  }, []);

  return (
    <>
      <MapModal open={open} setOpen={setOpen} />
      <CheckOutListPusher>
        <BackgroundImage src="/Chinese-Dishes.jpg" style={{ top: cal / -3 + 75 }} />
        {/* <Visibility onUpdate={handleUpdate}>
          <div style={{ height: 470  }}></div>
        </Visibility> */}
        <Bar />
        <div style={{ backgroundColor: 'white' }}>
          <Container>
            {/* <div style={{ height: 60 }}></div> */}

            <Header
              locale={router.locale}
              style={{
                fontSize: isMobile ? 45 : 60,
                margin: isMobile ? 10 : 0
              }}>{t`PEACEFUL RESTAURANT`}</Header>
            <Header isMobile={isMobile} style={{ margin: 0 }}>{t`Serving`}</Header>
            <div style={{ height: 40 }}></div>
            <P style={{ fontSize: 20, textAlign: isMobile && 'left' }}>
              {t`intro-1`} <br />
              {t`intro-1-1`}
              <br />
              <br />
              {t`intro-2`}
            </P>

            <div style={{ height: isMobile ? 20 : 70 }}></div>
            <hr />
            <div style={{ height: isMobile ? 20 : 70 }}></div>

            <Row>
              <FoodImage isMobile={isMobile} src="/p1.jpg" />
              <FoodImage isMobile={isMobile} src="/p3.jpg" />
              <FoodImage isMobile={isMobile} src="/p4.jpg" />
            </Row>

            <div style={{ height: isMobile ? 20 : 70 }}></div>

            <hr />
            <div style={{ height: isMobile ? 20 : 70 }}></div>

            <Header id="map">{t`8 Locations`}</Header>
            <Row>
              {addresses.map((item) => {
                return (
                  <AddressContainer isMobile={isMobile}>
                    <AddressHeader>{item.name}</AddressHeader>
                    <P>
                      {item.address} <br />
                      {item.city} <br />
                      {item.phone}
                    </P>
                  </AddressContainer>
                );
              })}
            </Row>
            <Row>
              <Button onClick={() => setOpen(true)}>
                <Icon name="marker" />
                {t`View Map`}
              </Button>
            </Row>

            <div style={{ height: isMobile ? 20 : 70 }}></div>

            <hr />
            <div style={{ height: isMobile ? 20 : 70 }}></div>

            <Row>
              <FoodImage isMobile={isMobile} src="/p5.jpg" />
              <FoodImage isMobile={isMobile} src="/p6.jpg" />
              <FoodImage isMobile={isMobile} src="/p7.jpg" />
            </Row>

            <div style={{ height: isMobile ? 20 : 70 }}></div>

            <hr />
            <div style={{ height: isMobile ? 20 : 70 }}></div>

            <Header>{t`AWARD`}</Header>
            <Article>
              <div style={{ maxWidth: 500 }}>
                <P style={{ fontSize: 20, textAlign: 'left', lineHeight: 'normal' }}>
                  <ul>
                    <li>
                      {t`AWARD-1`} <br />
                      <br />
                    </li>
                    <li>
                      {t`AWARD-2`} <br />
                      <br />
                    </li>
                    <li>
                      {t`AWARD-3`}
                      <br />
                      <br />
                    </li>
                    <li>{t`AWARD-4`} </li>
                  </ul>
                </P>
              </div>
              <FoodImage
                isMobile={isMobile}
                src="/storefront.jpg"
                style={{ width: 400, height: '100%' }}
              />
            </Article>
            <div style={{ height: isMobile ? 20 : 70 }}></div>
            <Row style={{ justifyContent: 'space-around' }}>
              <AwardImg isMobile={isMobile} src="/award-1.png" />
              <AwardImg isMobile={isMobile} src="/award-2.png" />
              <AwardImg isMobile={isMobile} src="/award-3.png" />
              <AwardImg isMobile={isMobile} src="/award-4.png" />
              {/* <AwardImg src="/award-5.png" />
              <AwardImg src="/award-6.jpg" style={{ width: 140 }} /> */}
            </Row>

            <div style={{ height: isMobile ? 20 : 70 }}></div>
            <hr />
            <div style={{ height: isMobile ? 20 : 70 }}></div>

            <Header>{t`MISSION`}</Header>
            <Article>
              <FoodImage isMobile={isMobile} src="/p5.jpg" style={{ width: 400, height: '100%' }} />
              <div style={{ maxWidth: 500 }}>
                <P style={{ fontSize: 20, textAlign: 'left' }}>{t`MISSION-1`}</P>
              </div>
            </Article>

            <div style={{ height: isMobile ? 20 : 70 }}></div>
            <hr />
            <div style={{ height: isMobile ? 20 : 70 }}></div>

            <Header>{t`HISTORY`}</Header>
            <Article>
              <div style={{ maxWidth: 500 }}>
                <P style={{ fontSize: 20, textAlign: 'left' }}>{t`HISTORY-1`}</P>
              </div>
              <FoodImage isMobile={isMobile} src="/p6.jpg" style={{ width: 400, height: '100%' }} />
            </Article>

            <div style={{ height: isMobile ? 20 : 70 }}></div>
            <hr />
            <div style={{ height: isMobile ? 20 : 70 }}></div>

            <Header>{t`Parnter`}</Header>
            <Article>
              <FoodImage isMobile={isMobile} src="/p7.jpg" style={{ width: 400, height: '100%' }} />
              <div style={{ maxWidth: 500 }}>
                <P style={{ fontSize: 20, textAlign: 'left' }}>{t`Parnter-1`}</P>
              </div>
            </Article>
            <div style={{ height: 110 }}></div>
          </Container>
        </div>
        {/* <Footer /> */}
      </CheckOutListPusher>
    </>
  );
};

export const getStaticProps = async (context) => {
  const getSingleShop = (id) => {
    return  new Promise(async (resolve) => {
      const result = await axios.get(HOST_URL + '/api/singleshop', {
        params: { shop_id: id }
      });
      // console.log('resultresult', result.data.data);
      resolve(result.data.data);
    });
  };

  const promises = [];

  addresses.forEach((address, i) => {
    promises.push(getSingleShop(address.id));
  });
  const p = Promise.all(promises).then((results) => {
    console.log(results);
    return results;
  });

  console.log('ppppppppppp', p);
  return {
    props: {
      allShops: "p"
    }
  };
};

// export const getStaticPaths = async () => {
//   return {
//     paths:
//       [
//         { params: { shop_id: '1', slug: "Broadway" }, locale: "en" },
//         { params: { shop_id: '2', slug: "Kitsilano" }, locale: "en"  },
//         { params: { shop_id: '3', slug: "Richmond" }, locale: "en"  },
//         { params: { shop_id: '4', slug: "Port Coquitlam" }, locale: "en"  },
//         { params: { shop_id: '5', slug: "Kingsway" }, locale: "en"  },
//         { params: { shop_id: '6', slug: "Seymour" }, locale: "en"  },
//         { params: { shop_id: '7', slug: "Newton" }, locale: "en"  },
//         { params: { shop_id: '8', slug: "Mount Pleasant" }, locale: "en"  },
//         { params: { shop_id: '1', slug: "Broadway" }, locale: "zh-CN" },
//         { params: { shop_id: '2', slug: "Kitsilano" }, locale: "zh-CN"  },
//         { params: { shop_id: '3', slug: "Richmond" }, locale: "zh-CN"  },
//         { params: { shop_id: '4', slug: "Port Coquitlam" }, locale: "zh-CN"  },
//         { params: { shop_id: '5', slug: "Kingsway" }, locale: "zh-CN"  },
//         { params: { shop_id: '6', slug: "Seymour" }, locale: "zh-CN"  },
//         { params: { shop_id: '7', slug: "Newton" }, locale: "zh-CN"  },
//         { params: { shop_id: '8', slug: "Mount Pleasant" }, locale: "zh-CN"  },
//       ],
//     fallback: false
//   }
// }

const BackgroundImage = styled.img`
  /* position: fixed; */
  width: 100vw;
  min-height: 200px;
  max-height: 530px;
  object-fit: cover;
`;
const FoodImage = styled.img`
  width: ${(p) => (p.isMobile ? '100%' : '300px')};
  height: ${(p) => (p.isMobile ? '300px' : '200px')};
  object-fit: cover;
  margin: 5px;
`;
const AwardImg = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin: ${(p) => (p.isMobile ? '10px' : 0)};
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
`;
const Article = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: flex-start;
`;
const Button = styled.div`
  font-family: 'Spectral', serif;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  background-color: #9c0404;
  color: white;
  padding: 15px 25px 15px 25px;
  border-radius: 30px;
  font-size: 16px;
  cursor: pointer;
`;

const AddressContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  width: ${(p) => (p.isMobile ? '150px' : '200px')};
  margin-bottom: 60px;
`;

const Container = styled.div`
  text-align: center;
  padding: 40px 15px 40px 15px;
  max-width: 1000px;
  margin: 0 auto;
`;
const Header = styled.h1`
  font-family: ${(p) => (!p.locale === 'eng' ? "'Spectral', serif" : "'Noto Serif SC', serif")};
  font-size: ${(p) => (p.isMobile ? 30 : 40)};
  font-weight: 600;
  margin: 0 0 50px 0;
  color: #810707;
`;
const AddressHeader = styled.h2`
  font-weight: 400;
  margin: 0 0 10px 0;
  color: #810707;
`;
const P = styled.h4`
  font-weight: 400;
  margin: 0;
  color: #000000;
  line-height: 180%;
`;
const Image = styled.img`
  width: 100%;
  height: 500px;
  object-fit: cover;
`;
const Bar = styled.div`
  display: flex;
  align-items: center;
  z-index: 1000;
  background-color: #9c0404;
  width: 100%;
  height: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-style: solid;
  border-bottom: 0px;
  border-left: 0px;
  border-right: 0px;
  border-width: 4px;
  margin-top: -3px;
  /* margin-bottom: 30px; */
  border-image: linear-gradient(45deg, yellow, #a59502, yellow, #a59502, yellow) 1;
`;
export default Home;
