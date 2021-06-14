import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';
export class WhisperGroupOpEventParser implements IMessageParser
{
    private _id: number;
    private _op: number;
    private _data: string;

    flush(): boolean
    {
        this._id = -1;
        this._op = 0;
        this._data = '';
        return true;
    }
    parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) throw new Error('invalid_wrapper');

        this._id = wrapper.readInt();
        this._op = wrapper.readInt();
        this._data = wrapper.readString();

        return true;
    }

    public get id(): number
    {
        return this._id;
    }

    public get op(): number
    {
        return this._op;
    }

    public get data(): string
    {
        return this._data;
    }
}
