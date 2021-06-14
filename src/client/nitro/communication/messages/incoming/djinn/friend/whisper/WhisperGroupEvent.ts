import { IMessageEvent } from '../../../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../../../core/communication/messages/MessageEvent';
import { WhisperGroupEventParser } from '../../../../parser/djinn/whisper/WhisperGroupEventParser';

export class WhisperGroupEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WhisperGroupEventParser);
    }

    public getParser(): WhisperGroupEventParser
    {
        return this.parser as WhisperGroupEventParser;
    }
}
