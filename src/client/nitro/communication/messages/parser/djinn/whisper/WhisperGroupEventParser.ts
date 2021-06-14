import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';
export class WhisperGroupEventParser implements IMessageParser
{
    private _id: number;
    private _users: string[];

    flush(): boolean
    {
        this._id = -1;
        this._users = [];
        return true;
    }

    parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) throw new Error('invalid_wrapper');

        this._id = wrapper.readInt();

        const count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            this._users[i] = wrapper.readString();
        }

        return true;
    }

    public get id(): number
    {
        return this._id;
    }

    public get users(): string[]
    {
        return this._users;
    }


}
