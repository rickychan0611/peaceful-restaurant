import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { HOST_URL } from '../../env';
import { useRecoilState } from 'recoil';
import {
  currentItem as currentItemAtom,
  currentShop as currentShopAtom
} from '../../data/atoms.js';
import { orderItems as orderItemsAtom } from '../../data/orderAtoms.js';

import { Form, Grid, Icon, Radio, Image, Checkbox, Divider } from 'semantic-ui-react';

const ItemDetailsContext = ({
  checkOutListItem,
  attributes,
  setAttributes,
  updateItem,
  attributeTotal
}) => {
  const [currentItem, setCurrentItem] = useRecoilState(currentItemAtom);
  const [currentShop, setCurrentShop] = useRecoilState(currentShopAtom);
  const [item, setItem] = useState();
  const [orderItems, setOrderItems] = useRecoilState(orderItemsAtom);

  useEffect(() => {
    console.log('Load currentItem', currentItem);
    console.log('Load checkOutListItem', checkOutListItem);
    checkOutListItem ? setItem(checkOutListItem) : setItem(currentItem);
    // setItem(currentItem);
  }, [checkOutListItem, currentItem]);

  const onChange = (task, option) => {
    let tempItem = JSON.parse(JSON.stringify(updateItem ? checkOutListItem : currentItem));
    const attIndex = tempItem.attributes.findIndex((item) => item.id === option.attribute_id);
    const optIndex = tempItem.attributes[attIndex].options.findIndex(
      (item) => item.id === option.id
    );
    let tempOpts = tempItem.attributes[attIndex].options[optIndex];

    if (task === 'radio') {
      tempItem.attributes[attIndex].options = tempItem.attributes[attIndex].options.map((item) => ({
        ...item,
        quantity: 0
      }));
      tempItem.attributes[attIndex].options[optIndex].quantity = 1;
    } else if (!tempOpts.quantity && task == 'plus') {
      tempOpts.quantity = 1;
    } else if (tempOpts.quantity) {
      tempOpts.quantity = tempOpts.quantity + (task === 'plus' ? 1 : -1);
    }

    console.log('orderItems', orderItems);
    updateItem
      ? setOrderItems((prev) => prev.map((item) => (item.uid === tempItem.uid ? tempItem : item)))
      : setCurrentItem(tempItem);
  };

  return (
    <>
      {item && (
        <Wrapper>
          <Container>
             <h2>{item.name}</h2>
            {item.images && item.images[0] ? (
              <Img src={HOST_URL + '/storage/' + JSON.parse(item.images)[0]} />
            ) : (
              <Img src="/no-image.png" />
            )}
            <h4>Description</h4><Description>{item.description}</Description>
            {item.attributes && item.attributes[0] && <h4>Choose your options</h4>}
            <Form>
              <Form.Field></Form.Field>
              {item.attributes &&
                item.attributes[0] &&
                item.attributes.map((attribute, i) => {
                  return (
                    <div key={i}>
                      <Form.Field>
                        <OptionTitle>
                          <h4 style={{ fontWeight: 'bold' }}>
                            {attribute.name}
                            {/* <span style={{ color: 'grey' }}>
                            {attribute.type === 1
                              ? ' (choose one only)'
                              : ' (you can choose more than one)'}
                          </span> */}
                            <span style={{ color: 'red' }}>
                              {attribute.require_status === 1 ? ' *required' : ''}
                            </span>
                          </h4>
                        </OptionTitle>

                        {attribute.options &&
                          attribute.options[0] &&
                          attribute.options.map((option, j) => {
                            return (
                              <Grid key={j}>
                                <Grid.Column width={8}>
                                  {attribute.type === 2 ? (
                                    <QtyContainer>
                                      <div>
                                        <Icon
                                          style={{ cursor: 'pointer' }}
                                          name="minus circle"
                                          onClick={() => {
                                            onChange('minus', option);
                                          }}
                                        />
                                        <span style={{ margin: '0 8px 0 5px' }}>
                                          {option.quantity ? option.quantity : 0}
                                        </span>
                                        <Icon
                                          style={{ cursor: 'pointer', marginRight: 10 }}
                                          name="plus circle"
                                          onClick={() => {
                                            onChange('plus', option);
                                          }}
                                        />
                                      </div>
                                      {option.option_name}
                                    </QtyContainer>
                                  ) : (
                                    // <Checkbox
                                    //   type={attribute.type === 2 ? 'checkbox' : 'radio'}
                                    //   label={option.option_name}
                                    //   name="radioGroup"
                                    //   // value={option.option_price}
                                    //   // checked={checked[option_attribite.id]}
                                    //   onChange={() => {

                                    //     // Handle UNCHECK! Uncheck if optionId is checked, remove option from attritubes array and selctedOptions
                                    //     // selectedOptions is used to control checkboxes
                                    //     if (selectedOptions.includes(option.id)) {
                                    //       // remove option in attributes
                                    //       let temp = [...attributes];
                                    //       let attIndex = temp.findIndex(
                                    //         (item) => item.id === option.attribute_id
                                    //       );
                                    //       let optIndex = temp[attIndex].options.findIndex(
                                    //         (item) => item.id === option.id
                                    //       );

                                    //       temp[attIndex].options.splice(optIndex, 1);

                                    //       if (temp[attIndex].options.length === 0) {
                                    //         temp.splice(attIndex, 1);
                                    //       }

                                    //       setAttributes(temp);

                                    //       setSelectedOptions(
                                    //         selectedOptions.filter((id) => id !== option.id)
                                    //       );
                                    //     } else {
                                    //       setSelectedOptions([...selectedOptions, option.id]);
                                    //       updateAttribute(option);
                                    //     }
                                    //   }}
                                    // />
                                    <Radio
                                      type="radio"
                                      label={option.option_name}
                                      name={option.attribute_id.toString()}
                                      checked={option.quantity === 1}
                                      onChange={() => {
                                        onChange('radio', option);
                                      }}
                                    />
                                  )}
                                </Grid.Column>
                                <Grid.Column width={8} style={{ textAlign: 'right' }}>
                                  + ${option.option_price} / ea.
                                </Grid.Column>
                              </Grid>
                            );
                          })}
                      </Form.Field>
                    </div>
                  );
                })}
            </Form>
          </Container>
        </Wrapper>
      )}
    </>
  );
};

const OptionTitle = styled.div`
  padding: 5px;
  background-color: #ded9d9;
  margin: 15px 0 15px 0;
`;
const QtyContainer = styled.div`
  margin: 10px 10px 0 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
const Container = styled.div`
  padding: 20px;
  padding-top: 40px;
  padding-bottom: 150px;
  min-height: calc(100vh - 60px);
  width: 100%;
  max-width: 500px;
`;
const StoreHeader = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
`;
const Description = styled.h4`
  color: grey;
`;
const Img = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

export default ItemDetailsContext;
