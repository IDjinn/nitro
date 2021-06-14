import { IMessageComposer } from '../../../../../../../core/communication/messages/IMessageComposer';
export class WhisperGroupOpComposer implements IMessageComposer<ConstructorParameters<typeof WhisperGroupOpComposer>>
{
    private _data: ConstructorParameters<typeof WhisperGroupOpComposer>;

    public static OP_TYPE = Object.freeze({
        NONE: 0,
        ADD: 1,
        REMOVE: 2,
        DELETE: 3
    })

    constructor(opType: number, data: string)
    {
        this._data = [opType, data];
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
