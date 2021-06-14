import { IMessageComposer } from '../../../../../../../core/communication/messages/IMessageComposer';
export class WhisperGroupComposer implements IMessageComposer<ConstructorParameters<typeof WhisperGroupComposer>>
{
    private _data: ConstructorParameters<typeof WhisperGroupComposer>;

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
