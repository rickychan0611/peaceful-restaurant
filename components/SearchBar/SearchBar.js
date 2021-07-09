import { useState } from 'react';
import styled from 'styled-components';
import { Form, Icon, Button } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import {
  searchValue as searchValueAtom,
  searchResults as searchResultsAtom,
} from '../../data/atoms.js';
import axios from 'axios';

const SearchBar = ({ currentShop }) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useRecoilState(searchValueAtom);
  const [searchResults, setSearchResults] = useRecoilState(searchResultsAtom);
  const [keyword, setKeyword] = useState();

  const handleChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSubmit = async () => {
    setSearchValue(keyword);
    const results = await axios.get(process.env.NEXT_PUBLIC_HOST_URL + '/api/search', {
      params: {
        keyword
      }
    });
    console.log("results", results.data.data)
    const products = results.data.data.products.filter(item => item.shop_id === currentShop.id)
    console.log("products", products)
    if (products.length === 0) {
      alert('No result found for "' + keyword + '"')
      setSearchResults()
    }
    else {
      setSearchResults(products)
      router.push('/shop/' + currentShop.name + "/" + currentShop.id + "#result")
    }
  };


  return (
    <Form onSubmit={() => keyword && handleSubmit()}>
      <InputWrapper style={{ backgroundColor: '#c4c3c3', border: '1px solid #c4c3c3', minWidth: 300 }}>
        <InputWrapper style={{ backgroundColor: 'white', borderRadius: '5px 0px 0px 5px' }}>
          <input
            style={{ margin: 0, width: '100%', border: 0 }}
            placeholder={"Search food in " + currentShop.name}
            icon="search"
            iconPosition="left"
            value={keyword}
            onChange={handleChange}
          />
          {keyword && (
            <Icon
              name="times"
              style={{ margin: '0 10px', color: '#c4c3c3' }}
              onClick={() => {
                setKeyword('');
                setSearchResults()
              }}
            />
          )}
        </InputWrapper>
        <SearchButton type="submit">
          <Icon
            name="search"
          />
        </SearchButton>
      </InputWrapper>
    </Form>
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
const SearchButton = styled.button`
 width: 50px;
 background-color: #c4c3c3;
 outline: 0;
 border: 0;
 color: grey'
`;
export default SearchBar;
