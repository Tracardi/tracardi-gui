import {
    Avatar,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField,
  } from '@material-ui/core';
  import React, { useState } from 'react';
  import Button from '../elements/forms/Button';
  import {
    TuiForm,
    TuiFormGroupContent,
    TuiFormGroupField,
    TuiFormGroupHeader,
  } from '../elements/tui/TuiForm.js';
  
  const NewUser = () => {
    const [state, setState] = useState({
      username: '',
      password: '',
      email: '',
      fullname: '',
      role: '',
      disabled: false,
    });
  
    const handleSubmit = () => {
      console.log(state);
    };
    return (
      <TuiForm
        style={{
          marginLeft: '20px',
        }}
      >
        <TuiFormGroupHeader header='New user' />
        <TuiFormGroupContent           style={{
              margin: '0% 30%',
            }}>
          <TuiFormGroupField>
            <Avatar
              style={{
                width: '75px',
                height: '75px',
                margin: '0px auto',
                marginBottom: '20px',
              }}
            />
  
            <div>
              <InputLabel
                style={{
                  marginBottom: '5px',
                }}
              >
                Username
              </InputLabel>
              <TextField
                value={state.username}
                onChange={(e) => {
                  setState({ ...state, username: e.target.value });
                }}
                type='text'
                size='small'
                fullWidth
                variant='outlined'
              />
              <div
                style={{
                  margin: '10px 0px',
                }}
              >
                <InputLabel
                  style={{
                    marginBottom: '5px',
                  }}
                >
                  Password
                </InputLabel>
                <TextField
                  value={state.password}
                  onChange={(e) => {
                    setState({ ...state, password: e.target.value });
                  }}
                  type='password'
                  size='small'
                  fullWidth
                  variant='outlined'
                />
              </div>
              <div>
                <InputLabel
                  style={{
                    marginBottom: '5px',
                  }}
                >
                  Full Name
                </InputLabel>
                <TextField
                  value={state.fullname}
                  onChange={(e) => {
                    setState({ ...state, fullname: e.target.value });
                  }}
                  type='text'
                  size='small'
                  fullWidth
                  variant='outlined'
                />
              </div>
              <div
                style={{
                  margin: '10px 0px',
                }}
              >
                <InputLabel
                  style={{
                    marginBottom: '5px',
                  }}
                >
                  Email
                </InputLabel>
                <TextField
                  value={state.email}
                  onChange={(e) => {
                    setState({ ...state, email: e.target.value });
                  }}
                  type='email'
                  size='small'
                  fullWidth
                  variant='outlined'
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  paddingTop: '10px',
                  justifyContent: 'space-between',
                  flexDirection: 'row-reverse',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <InputLabel
                    style={{
                      marginBottom: '5px',
                    }}
                  >
                    Role
                  </InputLabel>
                  <Select
                    value={state.role}
                    onChange={(e) => {
                      setState({ ...state, role: e.target.value });
                    }}
                    variant='outlined'
                    style={{
                      width: '200px',
                      height: '40px',
                    }}
                  >
                    <MenuItem value='Admin'>Admin</MenuItem>
                    <MenuItem value='Manager'>Manager</MenuItem>
                    <MenuItem value='User'>User</MenuItem>
                  </Select>
                </div>
                <div>
                  <FormControlLabel
                    value={state.disabled}
                    onChange={(e) => {
                      setState({ ...state, disabled: e.target.checked });
                    }}
                    control={<Switch color='primary' />}
                    label='Disabled'
                    labelPlacement='top'
                  />
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '20px',
                }}
              >
                <Button onClick={handleSubmit} label='Submit' />
              </div>
            </div>
          </TuiFormGroupField>
        </TuiFormGroupContent>
      </TuiForm>
    );
  };
  
  export default NewUser;
  