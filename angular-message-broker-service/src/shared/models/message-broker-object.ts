export class MessageBrokerObject {
	id: number;
    queueName: string;
    entity: any;

    constructor(obj?:any) {
        if (typeof obj !== 'undefined') {
            return this.parse(obj);
        }
    }

    parse(obj:any) {

        this.id = new Date().getTime();

        try {

            if (typeof obj.queueName !== 'undefined') {
                this.queueName = obj.queueName;
            }

            if (typeof obj.entity !== 'undefined') {
                this.entity = obj.entity;
            }

        }
        catch(ex) {
            console.error(ex);
        }

        return this;
    }
}