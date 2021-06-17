import { useState, useEffect, useRef } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import SliderTitle from '../SliderTitle';
import  { useIsMobile } from '../../util/useScreenSize';
import { useRecoilState } from 'recoil';
import {
  currentCat as currentCatAtom,
  sliderPosition as sliderPositionAtom,
  catChange as scatChangeAtom
} from '../../data/atoms.js';

const Slider = ({ topic, children, icon, hideViewAll, marginBottom, hideScrollbar }) => {
  const isMobile = useIsMobile();
  const sliderRef = useRef(null);
  const [currentCat, setCurrentcat] = useRecoilState(currentCatAtom);
  const [sliderPosition, setSliderPosition] = useRecoilState(sliderPositionAtom);
  const [catChange, setCatChange] = useRecoilState(scatChangeAtom);

  const id = topic + ' indiana-scroll-container indiana-scroll-container--native-scroll';

  useEffect(() => {
    //Slider scroll back horizontally when a currentCat changes

    if (sliderRef.current && catChange) {
      let left = sliderRef.current.scrollLeft;

      const smoothScrollBack = () => {
        if (left <= 0) {
          clearInterval(scroll);
          //** slider scrolling position stays while setCatChange to false */
          setCatChange(false);
          //** reset all sliders' positions */
          setSliderPosition((prev) => ({ ...prev, [id]: 0 }));
        }
        left = left - 30;
        sliderRef.current.scrollTo(left, 0);
      };

      const scroll = setInterval(() => {
        smoothScrollBack();
      });
    }
  }, [currentCat]);

  useEffect(() => {
    // After passing BACK button, scroll back to previous poistion by remembering the
    // current.scrollLeft position in siderPositionAtom , only happens once when slider is loaded
    // siderPosition is saved when ScrollContainer is clicked.
    sliderRef.current.scrollTo(sliderPosition[id], 0);
  }, []);

  return (
    <div style={{ backgroundColor: "white", marginBottom: 40 }}>
      {/* <SliderTitle title={topic} icon={icon} dishChildren={children} hideViewAll={hideViewAll} /> */}
      <ScrollContainer
        className={topic}
        id={topic}
        horizontal
        nativeMobileScroll
        hideScrollbars={isMobile || hideScrollbar === true}
        innerRef={sliderRef}
        style={{
          overflow: 'auto',
          whiteSpace: 'nowrap',
          display: 'flex',
          flexDiection: 'row',
          flexWrap: 'nowrap',
          marginBottom: marginBottom ? marginBottom : isMobile ? 0 : 50,
          zIndex: 100,
          cursor: "grabbing",
          width: "100%",
          // marginLeft: -10,
          // marginRight: -10
        }}
        onClick={() => {
          console.log("sliderRef.current.scrollLeft", sliderRef.current.scrollLeft)
          setSliderPosition((prev) => ({ ...prev, [id]: sliderRef.current.scrollLeft }));
        }}>
        {children}
      </ScrollContainer>
    </div>
  );
};


export default Slider;
