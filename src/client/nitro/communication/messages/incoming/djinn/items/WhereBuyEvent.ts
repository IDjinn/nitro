import { IMessageEvent } from '../../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../../core/communication/messages/MessageEvent';
import { WhereBuyEventParser } from '../../../parser/djinn/items/WhereBuyEventParser';

export class WhereBuyEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WhereBuyEventParser);
    }

    public getParser(): WhereBuyEventParser
    {
        return this.parser as WhereBuyEventParser;
    }
}
