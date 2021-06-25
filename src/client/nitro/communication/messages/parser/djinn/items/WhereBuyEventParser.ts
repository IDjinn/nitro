import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';


export class WhereBuyEventParser implements IMessageParser
{
    private _items = new Map<number, number>();

    flush(): boolean
    {
        this._items.clear();
        return true;
    }

    parse(wrapper: IMessageDataWrapper): boolean
    {
        if (!wrapper) throw new Error('invalid_wrapper');


        const count = wrapper.readInt();
        for (let i = 0; i < count; i++)
        {
            this._items.set(wrapper.readInt(), wrapper.readInt());
        }

        return true;
    }

    public get items()
    {
        return this._items;
    }
}
