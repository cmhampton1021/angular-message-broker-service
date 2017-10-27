import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from '../environments/environment';

import { MessageBrokerService } from '../shared/services/message-broker.service';

import { MessageBrokerObject } from '../shared/models/message-broker-object';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public title = 'Angular Message Broker Service';
  public messageObject: MessageBrokerObject;

  private messageBrokerObject: Observable<MessageBrokerObject>;

  constructor(private messageBrokerService: MessageBrokerService) {
    this.messageBrokerObject = this.messageBrokerService.message;
    this.messageBrokerObject.subscribe((message) => this.onNextMessageBrokerObject(message));

    this.messageObject = new MessageBrokerObject();

    const message = new MessageBrokerObject({
      queueName: environment.messageBrokerConfig.testQueueName,
      entity: 'This is a test message.'
    });
    this.messageBrokerService.publish(message);

  }

  public sendMessage() {
    console.log(this.messageObject);
    const message = new MessageBrokerObject({
      queueName: this.messageObject.queueName,
      entity: this.messageObject.entity
    });
    
    this.messageBrokerService.publish(message);

    this.messageObject = new MessageBrokerObject();
  }

  private onNextMessageBrokerObject(message: MessageBrokerObject) {
    console.log(message);
  }

}
