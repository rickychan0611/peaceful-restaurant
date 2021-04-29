import Link from 'next/link'
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { Button, Form, Grid, Header, Message, Segment, Icon, Input } from 'semantic-ui-react'
import validator from 'validator';
import passwordValidator from 'password-validator';
import styled from 'styled-components';
import { useCookies } from 'react-cookie';

import { useRecoilState } from 'recoil';
import { user as userAtom, userdata } from '../../data/userAtom';

const SigningForms = ({ signUp }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [inputs, setInputs] = useState({});
  const [err, setErr] = useState({});
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useRecoilState(userAtom);
  const [cookies, setCookie, removeCookie] = useCookies();

  var schema = new passwordValidator();
  schema
    .is().min(6)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces

  const validation = () => {
    new Promise((resolve, reject) => {
      if (!inputs.firstName) {
        signUp && reject()
        signUp && console.log("firstName")
      }
      if (!inputs.lastName) {
        signUp && reject()
        signUp && console.log("lastName")
      }
      if (!inputs.email) {
        reject()
        console.log("email")
      }
      if (!inputs.password) {
        reject()
        console.log("password")
      }
      if (!inputs.confirmPassword) {
        signUp && reject()
        signUp && console.log("confirmPassword")
      }
      if (!validator.isEmail(inputs.email)) {
        setErr(prev => ({ ...prev, email: "Email address is not valid" }))
        reject()
        console.log("validatorisEmail")
      }
      if (!schema.validate(inputs.password)) {
        signUp && setErr(prev => ({ ...prev, password: "Must be at least 6 characters with 1 uppercase letter and 2 digits" }))
        signUp && reject()
        signUp && console.log("validatorpassword")
      } 
      if (inputs.password !== inputs.confirmPassword) {
        signUp && setErr(prev => ({ ...prev, confirmPassword: "Password are not matching." }))
        signUp && reject()
        signUp && console.log("confirmPassword")
      }
        resolve()
    }).then(() => {
      // setErr(prev => ({ ...prev, submit: "" }))
      signUp ? handleSignUp() : handleSignIn()
    }).catch(() => {
      console.log("Not signing in")
    })
  }

  const handleSignUp = async () => {
    console.log("Signing UP..")
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("await Signing UP..")
    setCookie("userToken", "123456789", {maxAge: 1000*60*24})
    localStorage.setItem('user', JSON.stringify(userdata));
    setUser(userdata)
    setLoading(false);
    router.push('/')
  }

  const handleSignIn = async () => {
    console.log("Signing IN..")
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("await Signing IN..")
    setCookie("userToken", "123456789", {maxAge: 1000*60*24})
    localStorage.setItem('user', JSON.stringify(userdata));
    setUser(userdata)
    setLoading(false);
    router.push('/')
  }

  const handleSubmit = () => {
    setErr({})
    console.log("submit")
    validation()
  }

  const handleChange = (e, name) => {
    setInputs(prev => ({ ...prev, [name]: e.target.value }))
  }

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' textAlign='center' style={{ color: "#4ab976" }}>
          {signUp ? "Sign up an account" : "Log in to your account"}
        </Header>
        <Form size='large' onSubmit={handleSubmit}>
          <Segment stacked>
            {signUp && <>
              <Form.Input fluid icon='user' iconPosition='left' placeholder='Fist Name'
                required
                value={inputs.firstName}
                onChange={e => handleChange(e, "firstName")}
              />
              <Form.Input fluid icon='user' iconPosition='left' placeholder='Last Name'
                required
                value={inputs.lastName}
                onChange={e => handleChange(e, "lastName")}
              />
            </>}
            <Form.Input fluid icon='mail' iconPosition='left' placeholder='E-mail address'
              required
              value={inputs.email}
              onChange={e => handleChange(e, "email")}
              error={err.email}
            />
            <PasswordWrapper>
              <Input
                required
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                type={showPassword ? 'text' : 'password'}
                label={{
                  content: <Icon name={showPassword ? 'eye' : 'eye slash'} />,
                  basic: true,
                  onClick: () => setShowPassword(!showPassword),
                }}
                labelPosition='right'
                value={inputs.password}
                onChange={e => handleChange(e, "password")}
                error={err.password}
              />
            </PasswordWrapper>

            {signUp &&
              <PasswordWrapper>
                <Input
                  required
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Confirm Password'
                  type={showPassword ? 'text' : 'password'}
                  label={{
                    content: <Icon name={showPassword ? 'eye' : 'eye slash'} />,
                    basic: true,
                    onClick: () => setShowPassword(!showPassword),
                  }}
                  labelPosition='right'
                  value={inputs.confirmPassword}
                  onChange={e => handleChange(e, "confirmPassword")}
                  error={err.confirmPassword}
                />
              </PasswordWrapper>
            }
            <Button type='submit'
              // loading={loading}
              style={{ backgroundColor: "#4ab976", color: "white" }}
              fluid size='large'
              content={!loading ? signUp ? "Sign Up" : "Log In" : <Icon name="spinner" loading/>}
            >
            </Button>
            <Message negative size='mini' hidden={!err.submit}>{err.submit}</Message>
          </Segment>
        </Form>
        {signUp ?
          <Message>Already Registered? <Link href='/sign-in'>Sign In</Link> </Message> :
          <Message>New to Peaceful Mall? <Link href='/sign-up'>Sign Up</Link> </Message>
        }
      </Grid.Column>
    </Grid>
  )
}

const PasswordWrapper = styled.div`
  margin-bottom: 15px; 
  .button {
    padding : 0 10px 0 10px;
  }
  .icon {
    margin: 0 !important;
  }
  .label {
    border-left : none;
    border-radius : 0 5px 5px 0;
  }
`;
export default SigningForms