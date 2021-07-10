import { useState } from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import {
  searchValue as searchValueAtom,
  searchResults as searchResultsAtom,
} from '../../data/atoms.js';
import axios from 'axios';
import Loader from '../Loader';

const SearchBar = ({ currentShop, setShowSearch }) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useRecoilState(searchValueAtom);
  const [searchResults, setSearchResults] = useRecoilState(searchResultsAtom);
  const [keyword, setKeyword] = useState();
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSubmit = async () => {
    if (keyword) {
      setLoading(true)
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
        setLoading(false)
      }
      else {
        setSearchResults(products)
        router.push('/shop/' + currentShop.name + "/" + currentShop.id + "#result")
        setLoading(false)
      }
    }
  };


  return (
    <>
      <form onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}>
        <Row>
          <InputIconWrap>
            <SearchInput
              placeholder={"Search food in " + currentShop.name}
              value={keyword}
              onChange={handleChange}
            />
            <Icon
              name="times"
              style={{ margin: '0 10px', color: '#c4c3c3' }}
              onClick={() => {
                setKeyword('');
                setSearchResults()
                setShowSearch(true)
              }}
            />
          </InputIconWrap>
          <SearchButton type="submit">
            {loading ? 
            <Icon loading name="spinner" /> :
            <Icon name="search" /> 
            }
          </SearchButton>
        </Row>
      </form>
    </>
  );
};

const Row = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;  
    border: 1px solid lightgray;
    border-radius: 5px;
    padding-left: 5px;
    background-color: white;
    width: 90vw;
    max-width: 500px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  `;
const InputIconWrap = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;  
    border-radius: 5px;
    padding-left: 5px;
    background-color: white;
    width: 90vw;
    max-width: 500px;
  `;
const SearchInput = styled.input`
  padding: 6px;
  border: 0;
  width: 100%;
  outline: none;
  `;
const SearchButton = styled.button`
 background-color: #c4c3c3;
 outline: 0;
 border: 0;
 color: grey;
 padding: 13px;
 padding-left: 15px;
`;
export default SearchBar;
