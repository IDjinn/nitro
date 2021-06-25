import { MessengerFriend } from '../../../../../../../app/components/friendlist/common/MessengerFriend';
import { FriendListService } from '../../../../../../../app/components/friendlist/services/friendlist.service';
import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';
import { FriendParser } from '../../../incoming/friendlist/FriendParser';
export class WhisperGroupEventParser implements IMessageParser
{
    private _id: number;
    private _friends: MessengerFriend[];
    private _delete: boolean;

    flush(): boolean
    {
        this._id = -1;
        this._friends = [];
        this._delete = false;
        return true;
    }

    parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) throw new Error('invalid_wrapper');

        this._id = wrapper.readInt();
        this._delete = wrapper.readBoolean();

        const count = wrapper.readInt();
        for(let i = 0; i < count; i++)
        {
            const friend = new MessengerFriend();
            const friendWrapper = new FriendParser(wrapper);
            friend.populate(friendWrapper);

            this._friends.push(friend);
        }

        return true;
    }

    public get id(): number
    {
        return this._id;
    }

    public get friends(): MessengerFriend[]
    {
        return this._friends;
    }

    public get delete(): boolean
    {
        return this._delete;
    }

}
