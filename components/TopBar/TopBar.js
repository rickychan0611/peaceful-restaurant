import { useIsDesktop } from '../../util/useScreenSize';
import styled from 'styled-components';
import useTranslation from 'next-translate/useTranslation';
import setLanguage from 'next-translate/setLanguage';

import TopBar_Mobile from './TopBar_Mobile.js';
import TopBar_Desktop from './TopBar_Desktop.js';

export const locales = [
  {
    key: 'en',
    text: 'ENG',
    value: 'en'
  },
  {
    key: 'zh-CN',
    text: '简体',
    value: 'zh-CN'
  }
];

export const changeLocale = async (e, { value }) => {
  console.log(value);
  await setLanguage(value);
  const date = new Date();
  const expireMs = 100 * 365 * 24 * 60 * 60 * 1000; // 100 days
  date.setTime(date.getTime() + expireMs);
  document.cookie = `NEXT_LOCALE=${value};expires=${date.toUTCString()};path=/`;
};

const TopBar = () => {
  const isDesktop = useIsDesktop();
  const { t } = useTranslation('home');

  return (
    <>
      <Container>
        <SpaceBetween>
          {!isDesktop ? (
            <TopBar_Mobile t={t} changeLocale={changeLocale} locales={locales} />
          ) : (
            <TopBar_Desktop t={t} changeLocale={changeLocale} locales={locales} />
          )}
        </SpaceBetween>
      <Bar />
      </Container>
    </>
  );
};

const Container = styled.div`
  border-radius: 0;
  position: fixed;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  z-index: 1000;
  background-color: #9c0404;
  width: 100%;
  /* height: 85px; */
  top: 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  `;
const SpaceBetween = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 15px;
`;
const Bar = styled.div`
  display: flex;
  align-items: center;
  /* z-index: 100; */
  background-color: #9c0404;
  width: 100%;
  height: 15px;
  box-shadow: 0 0 10px rgba(0,0,0,.5);
  border-style: solid;
  border-bottom: 0px;
  border-left: 0px;
  border-right: 0px;
  border-width: 4px;
  /* padding-top: 4px; */
  margin-top: -3px;
  border-image: linear-gradient(45deg,yellow, #a59502, yellow, #a59502, yellow) 1;
`;

export default TopBar;
