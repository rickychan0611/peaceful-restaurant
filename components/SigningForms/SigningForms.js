import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
  Icon,
  Input,
  Label
} from 'semantic-ui-react';
import validation from '../../util/validation';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import styled from 'styled-components';
import { HOST_URL } from '../../env';

import { useRecoilState } from 'recoil';
import { user as userAtom, userdata } from '../../data/userAtom';
import { addresses as addressAtom } from '../../data/atoms';
import useTranslation from 'next-translate/useTranslation';

const SigningForms = ({ signUp }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState({});
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useRecoilState(userAtom);
  const [cookies, setCookie, removeCookie] = useCookies();
  const { t } = useTranslation('home');
  const [addresses, setAddresses] = useRecoilState(addressAtom);

  const [inputs, setInputs] = useState({
    // confirmPassword: 'Ricric61',
    email: 'ric0611@gmail.com',
    // name: 'Rickychan1',
    password: '123456',
    // phone: '1234567890'
  });

  const handleSignUp = async () => {
    setLoading(true);
    try {
      /*** Sign UP Query***/
      const response = await axios.post(HOST_URL + '/api/user/register', inputs);
      console.log(response);
      setCookie('userToken', response.data.data, {  path: "/", maxAge: 1000 * 60 * 24 * 3 }); //expires in 3 days
      const getUser = await axios.get(HOST_URL + '/api/user/info', {
        headers: { Authorization: response.data.data }
      });
      console.log(getUser.data.data);
      localStorage.setItem('user', JSON.stringify(getUser.data.data));
      setUser(getUser.data.data);
      setAddresses(getUser.data.data.addresses);
      router.push('/')
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      /*** Sign UP Query***/
      const response = await axios.post(HOST_URL + '/api/user/login', {email: inputs.email, password: inputs.password});
      console.log(response);
      setCookie('userToken', response.data.data, { path: "/",  maxAge: 1000 * 60 * 24 * 3 }); //expires in 3 days
      const getUser = await axios.get(HOST_URL + '/api/user/info', {
        headers: { Authorization: response.data.data }
      });
      localStorage.setItem('user', JSON.stringify(getUser.data.data));
      setUser(getUser.data.data);
      console.log(getUser.data.data);
      setAddresses(getUser.data.data.addresses);
      router.push('/')
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    setErr({});

    validation(inputs)
      .then(() => {
        signUp ? handleSignUp() : handleSignIn()
      })
      .catch((err) => {
        console.log(err);
        setErr((prev) => ({ ...prev, ...err }));
      });
  };

  const handleChange = (e, name) => {
    setInputs((prev) => ({ ...prev, [name]: e.target.value }));
  };

  useEffect(() => {
    console.log(localStorage.getItem('user'));
    localStorage.getItem('user') && router.push('/');
  }, []);

  return (
    <Grid textAlign="center" style={{ height: '90vh' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450, margin: 10 }}>
        <Header as="h2" textAlign="center" style={{ color: '#292929' }}>
          {signUp ? t('signUPAccount') : t('LogInAccount')}
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment>
            {signUp && (
              <>
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder={t('userName')}
                  required
                  value={inputs.name}
                  onChange={(e) => handleChange(e, 'name')}
                />
              </>
            )}
            <Form.Input
              fluid
              icon="mail"
              iconPosition="left"
              placeholder={t('Email')}
              required
              value={inputs.email}
              onChange={(e) => handleChange(e, 'email')}
              error={err.email}
            />
            {signUp && (
              <Form.Input
                fluid
                icon="phone"
                iconPosition="left"
                placeholder={t('Phone')}
                required
                value={inputs.phone}
                onChange={(e) => handleChange(e, 'phone')}
                error={err.phone}
                // maxLength="10"
              />
            )}
            <PasswordWrapper>
              <Input
                required
                fluid
                icon="lock"
                iconPosition="left"
                placeholder={t('Password')}
                type={showPassword ? 'text' : 'password'}
                label={{
                  content: <Icon name={showPassword ? 'eye' : 'eye slash'} />,
                  basic: true,
                  onClick: () => setShowPassword(!showPassword)
                }}
                labelPosition="right"
                value={inputs.password}
                onChange={(e) => handleChange(e, 'password')}
              />
              {err.password && (
                <Label
                  basic
                  color="red"
                  pointing
                  style={{ borderRadius: 5 }}
                  content={err.password}
                />
              )}
            </PasswordWrapper>

            {signUp && (
              <PasswordWrapper>
                <Input
                  required
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder={t('ConfirmPassword')}
                  type={showPassword ? 'text' : 'password'}
                  label={{
                    content: <Icon name={showPassword ? 'eye' : 'eye slash'} />,
                    basic: true,
                    onClick: () => setShowPassword(!showPassword)
                  }}
                  labelPosition="right"
                  value={inputs.confirmPassword}
                  onChange={(e) => handleChange(e, 'confirmPassword')}
                />
                {err.confirmPassword && (
                  <Label
                    basic
                    color="red"
                    pointing
                    style={{ borderRadius: 5 }}
                    content={err.confirmPassword}
                  />
                )}
              </PasswordWrapper>
            )}
            <Button
              type="submit"
              // loading={loading}
              style={{ backgroundColor: '#ff614d', color: 'white' }}
              fluid
              size="large"
              content={
                !loading ? (
                  signUp ? (
                    t('signUPAccount')
                  ) : (
                    t('LogInAccount')
                  )
                ) : (
                  <Icon name="spinner" loading />
                )
              }></Button>
            <Message negative size="mini" hidden={!err.submit}>
              {err.submit}
            </Message>
          </Segment>
        </Form>
        {signUp ? (
          <Message>
            {t('AlreadyRegistered')}
            <Link href="/sign-in">{t('LogInAccount')}</Link>{' '}
          </Message>
        ) : (
          <Message>
            {t('NewtoPeacefulMall')}
            <Link href="/sign-up">{t('signUPAccount')}</Link>{' '}
          </Message>
        )}
      </Grid.Column>
    </Grid>
  );
};

const PasswordWrapper = styled.div`
  margin-bottom: 15px;
  .button {
    padding: 0 10px 0 10px;
  }
  .icon {
    margin: 0 !important;
  }
  .label {
    border-left: none;
    border-radius: 0 5px 5px 0;
  }
`;
export default SigningForms;
