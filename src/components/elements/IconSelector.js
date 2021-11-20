import { icons } from '../flow/FlowNodeIcons';
import { useState } from 'react';
import { Button, Popover } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { addIcon } from '../../redux/reducers/iconSlice';

const IconSelector = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div
      style={{
        margin: '50px',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Button variant='contained' color='primary' onClick={handlePopover}>
        Select icon
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
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
                dispatch(addIcon(Object.keys(icons)[index]));
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
