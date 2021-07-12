import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Icon, List } from 'semantic-ui-react';
import useTranslation from 'next-translate/useTranslation';
import { useRecoilState } from 'recoil';
import { mapLoaction as setMapLoactionAtom } from '../../data/atoms';
import router from 'next/router';

const ShopInfo = ({ shop }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('shop');
  const [mapLoaction, setMapLoaction] = useRecoilState(setMapLoactionAtom);
  const open_hours = shop.open_hours;


  return (
    <ListContainer>
      <Row
        onClick={() => {
          setOpen(!open);
        }}>
        <Icon name={open ? 'chevron down' : 'chevron right'} /> <Title>{shop.name}</Title>
      </Row>

      {open && (
        <>
          <List style={{ padding: 10 }}>
            <List.Item
              onClick={() => {
                setMapLoaction(shop);
                // setOpen(true)
              }}>
              <List.Icon name="map marker alternate" style={{ margiTop: 30 }} />
              <List.Content>
                <List.Header as="h4">
                  {shop.address_line}, {shop.address_city}
                </List.Header>
                <List.Description>
                  <a>{t`Click to View Map`}</a>
                </List.Description>
              </List.Content>
            </List.Item>
            <br />
            <List.Item>
              <List.Icon name="phone" />
              <List.Content>
                <List.Header as="h4">{t`Phone`}</List.Header>
                <List.Description>{shop.phone.map((item, i) => {
                  return (
                    <div>{item}</div>
                  )
                })}</List.Description>
              </List.Content>
            </List.Item>
            <br />
            <List.Item>
              <List.Icon name="clock" />
              <List.Content>
                <List.Header as="h4">{t`Hours`}</List.Header>
                <List.Description>
                  {shop.status === 4 ? (
                    <h5 style={{ color: "red" }}>Temporarily closed</h5>
                  ) : (
                    <table style={{ marginLeft: -4 }}>
                      <tbody>
                        <tr>
                          <td>{t`Monday`}</td>
                          <td>{open_hours.monday.open + ' - ' + open_hours.monday.close}</td>
                        </tr>
                        <tr>
                          <td>{t`Tuesday`}</td>
                          <td>{open_hours.tuesday.open + ' - ' + open_hours.tuesday.close}</td>
                        </tr>
                        <tr>
                          <td>{t`Wednesday`}</td>
                          <td>{open_hours.wednesday.open + ' - ' + open_hours.wednesday.close}</td>
                        </tr>
                        <tr>
                          <td>{t`Thursday`}</td>
                          <td>{open_hours.thursday.open + ' - ' + open_hours.thursday.close}</td>
                        </tr>
                        <tr>
                          <td>{t`Friday`}</td>
                          <td>{open_hours.friday.open + ' - ' + open_hours.friday.close}</td>
                        </tr>
                        <tr>
                          <td>{t`Saturday`}</td>
                          <td>{open_hours.saturday.open + ' - ' + open_hours.saturday.close}</td>
                        </tr>
                        <tr>
                          <td>{t`Sunday`}</td>
                          <td>{open_hours.sunday.open + ' - ' + open_hours.sunday.close}</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </List.Description>
              </List.Content>
            </List.Item>
          </List>
          {shop.status !== 4 && <ButtonWrapper>
            <OrderButton
              onClick={() => {
                router.push('/shop/' + shop.name + '/' + shop.id);
              }}>
              <Icon name="food" />
              Order here now
            </OrderButton>
          </ButtonWrapper>}
        </>
      )}
    </ListContainer>
  );
};

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  cursor: pointer;
`;
const OrderButton = styled.div`
  width: 80%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  padding: 5px 15px;
  background-color: #9c0404;
  color: white;
  border-radius: 15px;
`;
const ListContainer = styled.div`
  margin: 0 0 15px 0;
`;
const Row = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  cursor: pointer;
`;
const Title = styled.h2`
  margin: 0 0 0 15px;
`;

export default ShopInfo;
