import { IMessageComposer } from '../../../../../../core/communication/messages/IMessageComposer';
export class EmptyItemsComposer implements IMessageComposer<ConstructorParameters<typeof EmptyItemsComposer>>
{
    private _data: ConstructorParameters<typeof EmptyItemsComposer>;

    constructor(emptyAllItems: boolean, count: number, ...itemsToDelete: number[])
    {
        this._data = [emptyAllItems, count, ...itemsToDelete];
    }


    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }

}
