import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import {
  TuiForm,
  TuiFormGroupContent,
  TuiFormGroupField,
  TuiFormGroupHeader,
} from '../tui/TuiForm';
import JsonEditor from '../../elements/editors/JsonEditor';
import TimeInput from '../forms/inputs/TimeInput';
import Button from './Button';

const ScheduledForm = () => {
  const [eventType, setEventType] = useState('')
  const [properties, setProperties] = useState('')
  const [schedule, setSchedule] = useState('')
  

  const handleSubmit = () => {
    const data = {
      eventType,
      properties,
      schedule,
    }
    console.log(data);
  };

  return (
    <TuiForm
      style={{
        margin: '20px',
      }}
    >
      <TuiFormGroupHeader header='Schedule task' />
      <TuiFormGroupContent>
        <TuiFormGroupField>
          <TextField
            label='Event type'
            variant='outlined'
            type='text'
            size='small'
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            style={{
              marginTop: '5px',
            }}
          />
          <div
            style={{
              marginTop: '15px',
              width: '600px',
              border: '1px solid #ccc',
              paddingTop: '10px',
              position: 'relative',
            }}
          >
            <label
              style={{
                fontSize: '12px',
                position: 'absolute',
                top: '-10px',
                left: '20px',
                backgroundColor: 'white',
                padding: '0px 10px',
              }}
            >
              Properties
            </label>
            <JsonEditor
              value={properties}
              onChange={(newValue) =>
                setProperties(newValue)
              }
            />
          </div>
          <div>
            <TimeInput
              value={schedule}
              onChange={setSchedule}
            />
            <Button
              disabled={
                eventType === '' ||
                properties === null ||
                schedule === null
              }
              onClick={handleSubmit}
              style={{
                width: '130px',
                marginLeft: '232px',
              }}
              label='Submit'
            />
          </div>
        </TuiFormGroupField>
      </TuiFormGroupContent>
    </TuiForm>
  );
};

export default ScheduledForm;
