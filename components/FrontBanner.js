import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Button } from 'semantic-ui-react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useIsMobile, useIsTablet, useIsDesktop } from '../util/useScreenSize';

const FrontBanner = ({ children }) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true
  };

  const MoonFestBanner = () => {
    return (
      <a href={"https://res.peacefulmall.com"}>
        <div style={{
          position: "relative",
          display: 'flex',
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer"
        }}>
          <div style={{
            position: "absolute",
            fontSize: isMobile ? 28 : isTablet ? 40 : 60,
            textAlign: "center",
            lineHeight: '120%',
            color: 'yellow',
            textShadow: isMobile ? '0 0 5px black' : '0 0 10px black',
            fontFamily: 'ZCOOL XiaoWei'
          }}>
            中秋团圆月优惠<br />
            大温餐饮商家
            {/* {isMobile && <br/>} */}
            诚意邀您家聚
            <br></br>
            <Button color="yellow" size={isMobile ? "small" : "big"}
              style={{ color: "#9c0404", marginTop: isDesktop ? 20 : 0 }}
            >
              立即查看优惠
            </Button>
          </div>
          <BannerImg src="/moonBanner.jpg" onClick={() => console.log(2)} />
        </div>
      </a>
    )
  }

  return (
    <Slider {...settings}>
      <BannerImg src="/Chinese-Dishes.jpg" onClick={() => console.log(1)} />
      <MoonFestBanner />
    </Slider>
  );
};

const BannerImg = styled.img`
  width: 100vw;
  min-height: 200px;
  max-height: 380px;
  object-fit: cover;
`;


export default FrontBanner;
