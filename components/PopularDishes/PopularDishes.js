import styled from 'styled-components';
import MenuItem from '../MenuItem';

const PopularDishes = ({topic, featured, products}) => {

  return (
    <>
    {/* <ItemModal open={open} setOpen={setOpen} fromRestaurantPage={true}/> */}

    <ItemWrapper isARow={products.length < 10} noItem={products.length === 0}>
      {/* {products.length} */}
        {products && products[0] ?
          [...products, ...products].map((item, i) => {
            return (
              <MenuItem item={item} smallCard key={i}/>
            );
          })
          :
          <div>No item found</div>
          }
    </ItemWrapper>
    </>
  );
};

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: ${(p) => (p.noItem ? '60px' : p.isARow ? '180px' : '360px')};
  padding-top: 10px;
  align-items: stretch;
`;

export default PopularDishes;
