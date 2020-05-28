import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

// Import the environment configs.
import { environment } from '../../environments/environment';

// Import models.
import { MessageBrokerObject } from '../models/message-broker-object';

@Injectable()
export class MessageBrokerService {

    public message: Subject<MessageBrokerObject>;
    public messageLog: MessageBrokerObject[];

    private maxLogEntries: number;

    constructor() {
        this.maxLogEntries = environment.messageBrokerConfig.maxLogEntries;
        this.message = new Subject();
        this.messageLog = [];
    }

    public publish(message: MessageBrokerObject) {

        this.log(message);
        this.message.next(message);
    }

    public getLogStackForQueue(queueName: string) {
        return this.messageLog.filter(l => l.queueName === queueName);
    }

    public getLastMessageForQueue(queueName: string) {
        return this.getLogStackForQueue(queueName)?.sort((a,b) => b.id - a.id)[0];
    }

    public getPreviousMessageForQueue(queueName: string) {
        const queueStack = this.getLogStackForQueue(queueName);
        return queueStack.length > 1 ? queueStack[1] : null;
    }

    public getFirstMessageForQueue(queueName: string) {
        return this.getLogStackForQueue(queueName)?.sort((a,b) => a.id - b.id)[0];
    }

    private log(message: MessageBrokerObject) {

        // If we have reached the limit of the log, pull the oldest (first) item off the array.
        if (this.messageLog.length >= this.maxLogEntries) {
            this.messageLog.shift();
        }

        this.messageLog.push(message);
        console.log(this.messageLog);

    }

}
