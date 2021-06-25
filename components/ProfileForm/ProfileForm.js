import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Form, Button, Icon, Transition } from 'semantic-ui-react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import moment from 'moment';
import validation from '../../util/validation';
import InputMask from 'react-input-mask';

import { useCookies } from 'react-cookie';
import { useRecoilState } from 'recoil';
import { user as userAtom } from '../../data/userAtom';
import useTranslation from 'next-translate/useTranslation';

const ProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [disableSave, setDisableSave] = useState(true);
  const [err, setErr] = useState(null);
  const [cookies] = useCookies(null);
  const [user, setUser] = useRecoilState(userAtom);
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation('profile');

  const formItems = [
    {
      label: t`FirstName`,
      key: 'first_name',
      required: true
    },
    {
      label: t`LastName`,
      key: 'last_name',
      required: true
    },
    {
      label: t`PhoneNumber`,
      key: 'phone',
      required: true
    }
  ];

  const handleChange = (e, name) => {
    if (name !== 'email') {
      let value = e.target.value;
      setErr(null);
      setVisible(false);
      setEditedUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const saveUserQuery = () => {
    setLoading(true);
    setErr(null);
    validation(editedUser)
      .then(async (res) => {
        await axios.post(process.env.NEXT_PUBLIC_HOST_URL + '/api/user/edit', editedUser, {
          headers: { Authorization: cookies.userToken }
        });
        // if successful
        setUser(editedUser);
        setVisible(true);
        setDisableSave(true);
        setLoading(false);
      })
      .catch((err) => {
        console.log('err: ', err);
        setLoading(false);
        setErr((prev) => ({ ...prev, ...err }));
      });
  };

  useEffect(() => {
    ///// disable save changes button
    editedUser &&
    editedUser.first_name === user.first_name &&
    editedUser.last_name === user.last_name &&
    editedUser.phone === user.phone &&
    editedUser.email === user.email
      ? setDisableSave(true)
      : setDisableSave(false);
  }, [editedUser]);

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  // useEffect(() => {
  //   setEditedUser((prev) => prev);
  //   editedUser.log('edituser', editedUser);
  // }, [user]);

  return (
    <>
      {editedUser && (
        <Form onSubmit={saveUserQuery}>
          <Form.Group widths="equal">
            <Form.Input
              fluid
              label={'Email'}
              placeholder={editedUser.email}
              value={editedUser.email}
              style={{pointerEvents:"none"}}
            />
            {formItems.map((item, i) => {
              return item.key !== 'phone' ? (
                <Form.Input
                  key={i}
                  fluid
                  required
                  label={item.label}
                  placeholder={item.label}
                  value={editedUser[item.key]}
                  onChange={(e) => !loading && handleChange(e, item.key)}
                  error={err && err[item.key]}
                  disabled={item.key === 'email' ? true : false}
                />
              ) : (
                <Form.Input
                  key={i}
                  fluid
                  required
                  label={item.label}
                  error={err && err.phone}
                  value={editedUser.phone}
                  children={
                    <InputMask
                      mask="999-999-9999"
                      maskChar="_"
                      alwaysShowMask
                      placeholder={item.label}
                      value={editedUser.phone}
                      onChange={(e) => handleChange(e, item.key)}
                    />
                  }
                />
              );
            })}
          </Form.Group>

          {/**** Birthday picker */}
          {/* <Form.Group>
            <SemanticDatepicker
              allowOnlyNumbers
              label="Birthday"
              placeholder="Pick a date"
              value={editedUser.birthday ? new Date(moment(editedUser.birthday).format()) : null}
              onChange={(e, data) => handleChange({ target: { value: data.value } }, "birthday")}
              error={err && err.birthday} />
          </Form.Group> */}

          <ButtonWrapper>
            <SubmitButton
              type="submit"
              content={
                loading ? (
                  <Icon name="spinner" loading style={{ margin: "0 0 10px 0", width: 30 }} />
                ) : (
                  t`Save Changes`
                )
              }
              disabled={disableSave}
              color="red"
            />
            {!disableSave && (
              <Button
                type="reset"
                onClick={() => {
                  setEditedUser(user);
                  setErr(null);
                }}>
                {t`Reset`}
              </Button>
            )}
            <Transition
              animation="swing right"
              duration={{ hide: 0, show: 1000 }}
              visible={visible}>
              <div>
                &nbsp;&nbsp;&nbsp;
                <Icon name="check" color="green" /> {t`saved`}
              </div>
            </Transition>
          </ButtonWrapper>
        </Form>
      )}
    </>
  );
};

const ButtonWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-top: 10px;
`;

const SubmitButton = styled(Button)`
  background-color: #ff614d;
  color: white;
  min-width: 127px;
`;
export default ProfileForm;
