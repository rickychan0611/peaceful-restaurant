import styled from 'styled-components';
import { Form, Icon } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import {
  searchValue as searchValueAtom,
} from '../../data/atoms.js';

const SearchBar = ({ setOpenModal }) => {
  const router = useRouter();
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

  return (
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

export default SearchBar;
