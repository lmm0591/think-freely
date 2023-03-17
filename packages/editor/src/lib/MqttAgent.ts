import { MqttClient, IClientOptions, IPublishPacket, connect, ISubscriptionGrant } from 'mqtt';
import { EventEmitter } from 'eventemitter3';

export type MqttAgentEvent =
  | 'message'
  | 'connect'
  | 'error'
  | 'reconnect'
  | 'close'
  | 'offline'
  | 'packetsend'
  | 'packetreceive'
  | 'subscribe';

export class MqttAgent {
  client?: MqttClient;
  topic: string = '';
  event: EventEmitter<MqttAgentEvent> = new EventEmitter<MqttAgentEvent>();

  connect(brokerUrl: string, username: string, token: string, clientId: string) {
    const params: IClientOptions = {
      clientId,
      username,
      password: token,
      keepalive: 20,
      protocolVersion: 5,
      reconnectPeriod: 5000,
      clean: false,
      properties: {
        sessionExpiryInterval: 60 * 60, // 1 hour
      },
    };

    if (this.client) {
      this.client.end();
    }

    const client = (this.client = connect(brokerUrl, { ...params, browserBufferSize: 1024 * 1024 * 5 } as any));

    client.on('message', (topic, content, packet: IPublishPacket) => {
      if (packet.properties?.contentType !== 'command') {
        this.event.emit('message', content.toString('utf8'));
      }
    });

    client.on('connect', () => {
      this.event.emit('connect');
    });

    client.on('error', (error) => {
      // @ts-ignore
      console.warn('Abnormal connection code:', error.code);
      this.event.emit('error', error);
    });

    client.on('reconnect', () => {
      console.warn('Reconnect');
      this.event.emit('reconnect');
    });

    client.on('close', () => {
      console.warn('Connection closed');
      this.event.emit('close');
    });

    client.on('offline', () => {
      console.warn('offline');
      this.event.emit('offline');
    });

    client.on('packetsend', (packet) => {
      this.sendExtensionMQTT({ ...packet, isSend: true });
    });

    client.on('packetreceive', (packet: any) => {
      if (packet.payload) {
        this.sendExtensionMQTT({ ...packet, isSend: false, payload: packet.payload.toString('utf8') });
      } else {
        this.sendExtensionMQTT({ ...packet, isSend: false });
      }
    });

    return this.event;
  }

  subscribe(topic: string, isDefaultTopic = false) {
    console.warn(`sub: ${topic}`);

    if (!isDefaultTopic) {
      this.topic = topic;
    }

    this.client?.subscribe(`${topic}/event`, { qos: 2 }, (error: Error, granted: ISubscriptionGrant[]) => {
      console.log('granted: ', granted);
      if (error) {
        this.event.emit('error', error);
      } else {
        this.event.emit('subscribe', granted);
      }
    });
    return this.event;
  }

  // 如果浏览器有安装 mqtt 插件就有 chrome_extensions_mqtt 对象
  private sendExtensionMQTT(data: any) {
    try {
      if ((window as any)['chrome_extensions_mqtt']) {
        (window as any)['chrome_extensions_mqtt'].next(data);
      }
    } catch (error) {}
  }
}
