import { IMessageComposer } from '../../../../../../core/communication/messages/IMessageComposer';
export class WhereBuyComposer implements IMessageComposer<ConstructorParameters<typeof WhereBuyComposer>>
{
    private _data: ConstructorParameters<typeof WhereBuyComposer>;

    constructor()
    {
        this._data = [];
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
