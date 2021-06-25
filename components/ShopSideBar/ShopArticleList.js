import { useState } from 'react';
import styled from 'styled-components';
import { Grid, List, Header, Modal } from 'semantic-ui-react';



const ShopArticleList = ({ t }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
    <Header>{t && t`FeaturedArticles`}</Header>
      <hr />
      <Img
        src={`https://source.unsplash.com/featured/?dinning, steak${Math.floor(
          Math.random() * 10000
        )}`}
      />
      Top 10 Restaurant <br />
      <br />
      <Img
        src={`https://source.unsplash.com/featured/?dinning, steak${Math.floor(
          Math.random() * 10000
        )}`}
      />
      Vancouver attractions <br />
      <br />
    </>
  );
};

const Img = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

export default ShopArticleList;
