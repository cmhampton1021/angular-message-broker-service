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

    private log(message: MessageBrokerObject) {

        // If we have reached the limit of the log, pull the oldest (first) item off the array.
        if (this.messageLog.length >= this.maxLogEntries) {
            this.messageLog.shift();
        }

        this.messageLog.push(message);
        console.log(this.messageLog);

    }
	
}
