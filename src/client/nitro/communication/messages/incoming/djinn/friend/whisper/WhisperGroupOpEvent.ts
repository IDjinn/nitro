import { IMessageEvent } from '../../../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../../../core/communication/messages/MessageEvent';
import { WhisperGroupOpEventParser } from '../../../../parser/djinn/whisper/WhisperGroupOpEventParser';

export class WhisperGroupOpEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WhisperGroupOpEventParser);
    }

    public getParser(): WhisperGroupOpEventParser
    {
        return this.parser as WhisperGroupOpEventParser;
    }
}
