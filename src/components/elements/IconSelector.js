import { icons } from '../flow/FlowNodeIcons';
import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Input,
  InputAdornment,
  Popover,
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';

const IconSelector = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [iconName, setIconName] = useState('');

  const handlePopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        margin: '10px',
      }}
    >
      <Input
        style={{
          width: '150px',
        }}
        placeholder='Icon Name'
        value={iconName}
        endAdornment={
          <InputAdornment positon='end'>
            <IconButton onClick={() => navigator.clipboard.writeText(iconName)}>
              <FileCopyIcon fontSize='small' color='primary' />
            </IconButton>
          </InputAdornment>
        }
      />
      <Button
        style={{
          marginLeft: '10px',
        }}
        variant='contained'
        color='primary'
        onClick={handlePopover}
      >
        Select icon
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div
          style={{
            width: '300px',
            height: '400px',
          }}
        >
          {Object.values(icons).map((item, index) => (
            <Button
              key={index}
              onClick={() => {
                setIconName(Object.keys(icons)[index]);
              }}
            >
              {item}
            </Button>
          ))}
        </div>
      </Popover>
    </div>
  );
};

export default IconSelector;
