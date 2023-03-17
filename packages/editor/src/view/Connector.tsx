import { useState } from 'react';
import { v4 } from 'uuid';
import { CellActions, CellStore } from '@tf/core';
import { MqttAgent } from '../lib/MqttAgent';

const mqtt = new MqttAgent();
export const Connector = () => {
  const [topic, setTopic] = useState(window.localStorage['think_topic'] ?? '');

  const login = () => {
    mqtt.connect('wss://dev.beeart.com/mqtt/', 'placeholder', window.localStorage['think_token'] ?? '', v4());
    mqtt.event.addListener('message', (message: any) => {
      const data = JSON.parse(message);
      if (data.type === 'graphEdit') {
        data.payload.changes.forEach((change: any) => {
          if (change.type === 'VertexCreate') {
            CellStore.dispatch(CellActions.addSticky({ id: change.cellId, text: change.value.label, geometry: change.geometry }));
          }
        });
      }
      console.log('message', JSON.parse(message));
    });
    mqtt.event.addListener('subscribe', () => {
      console.log('subscribe');
    });
    mqtt.event.addListener('connect', () => {
      console.log('connect');
    });
  };

  const sub = () => {
    mqtt.subscribe(topic);
  };
  return (
    <div>
      <input
        type="text"
        style={{ width: '400px' }}
        value={topic}
        placeholder="输入topic"
        onChange={(event) => {
          setTopic(event.target.value);
          window.localStorage['think_topic'] = event.target.value;
        }}
      ></input>
      <input type="button" value="登录" onClick={login} />
      <input type="button" value="监听 topic" onClick={sub} />
    </div>
  );
};
