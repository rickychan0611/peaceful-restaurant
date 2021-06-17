import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Form, Modal, Header, Icon, Input } from 'semantic-ui-react';
import { useIsMobile } from '../../util/useScreenSize';
import SearchBanner_Desktop from './SearchBanner_Desktop';
import SearchBanner_Mobile from './SearchBanner_Mobile';
import CurrentAddress from '../CurrentAddress';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { 
  sliderCats as sliderCatsAtom,
  searchValue as searchValueAtom,
} from '../../data/atoms.js';
import axios from 'axios';
import { HOST_URL } from '../../env';

const topSearch = [
  "和平", "中西结合", "Dim Sum", "和平饭店", "Richmond", "Kitsilano"
]

const SearchBanner = ({cats}) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [openModal, setOpenModal] = useState(false);
  const [sliderCats, setSliderCats] = useRecoilState(sliderCatsAtom);
  const [searchValue, setSearchValue] = useRecoilState(searchValueAtom);

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  const search = (keyword) => {
    setSearchValue(keyword);
    router.push('/search/shop/' + keyword)
    setOpenModal(false)
  }

  const handleSubmit = () => {
    search(searchValue)
  }

  useEffect( async ()=>{
    const getplatcat = await axios.get(HOST_URL + '/api/getplatcat');
    setSliderCats(getplatcat.data.data);
  },[] )

  return (
    <>
      <Modal open={openModal} onClose={() => setOpenModal(false)} closeIcon>
        <Header>Search</Header>
        <CurrentAddress />
        <Modal.Content>
          
          <Form>
            <InputWrapper style={{ backgroundColor: '#c4c3c3', border: '1px solid #c4c3c3' }}>
              <InputWrapper style={{ backgroundColor: 'white', borderRadius: '5px 0px 0px 5px' }}>
                <input
                  style={{ margin: 0, width: '100%', border: 0 }}
                  placeholder="Search restaurants or food"
                  icon="search"
                  iconPosition="left"
                  value={searchValue}
                  onChange={handleChange}
                />
                {searchValue && (
                  <Icon
                    name="times"
                    style={{ margin: '0 10px', color: '#c4c3c3' }}
                    onClick={() => {
                      setSearchValue('');
                    }}
                  />
                )}
              </InputWrapper>
              <Icon
                name="search"
                style={{ margin: '0 10px' }}
                onClick={() => {
                  handleSubmit() 
                }}
              />
            </InputWrapper>
          </Form>
          <h4>Top Searches</h4>
          
          {topSearch.map((item, i) => {
            return (
              <Item
              key={i}
              onClick={() => {
                search(item)
              }}>
              <NameIcon>
                <Icon name="search" />
                <Name>{item}</Name>
              </NameIcon>
              <div>
                <Icon name="chevron right" />
              </div>
            </Item>
            )
          })}

          <h4>Cuisines</h4>
          {sliderCats && sliderCats[0] && sliderCats.map((item, i) => {
            return (
              <Item
              key={i}
              onClick={() => {
                search(item.category_name)
              }}>
              <NameIcon>
                <Icon name="food" />
                <Name>{item.category_name}</Name>
              </NameIcon>
              <div>
                <Icon name="chevron right" />
              </div>
            </Item>
            )
          })}
        </Modal.Content>
      </Modal>

      <SearchBanner_Mobile setOpenModal={setOpenModal} value={searchValue}/>
      {/* {isMobile ? (
        <SearchBanner_Mobile setOpenModal={setOpenModal} />
      ) : (
        <SearchBanner_Desktop setOpenModal={setOpenModal} />
      )} */}
    </>
  );
};

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
`;
const Item = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #d0cece;
  padding: 15px 5px;
`;
const NameIcon = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`;
const Name = styled.div`
  font-size: 14;
  font-weight: 600;
`;


export const getServerSideProps = async (context) => {
  context.res.setHeader('Cache-Control', 's-maxage=86400');

  const getplatcat = await axios.get(HOST_URL + '/api/getplatcat');

  return {
    props: {
      cats: getplatcat.data.data
    }
  }
}

export default SearchBanner;
