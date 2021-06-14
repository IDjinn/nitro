import { IDisposable } from '../../core/common/disposable/IDisposable';
import { RoomInfoComposer } from '../communication/messages/outgoing/room/data/RoomInfoComposer';
import { Nitro } from '../Nitro';
import { MouseButtonType } from '../ui/MouseButtonType';
import { SessionDataManager } from './SessionDataManager';

export class RoomHistoryManager implements IDisposable
{
    private _sessionDataManager: SessionDataManager;
    private _previousRoomId: number | null;
    private _currentRoomId: number | null;
    private _timeout: number;
    private _disposed: boolean;

    constructor(sessionDataManager: SessionDataManager)
    {
        this._sessionDataManager = sessionDataManager;
        this._currentRoomId = null;
        this._previousRoomId = null;
        this._timeout = 0;
    }

    public handleExtraButtonsClickEvent(buttons: number[]): boolean
    {
        if(Date.now() - this._timeout < 3_000) return true;

        const someExtraFoward = buttons.find(button => button == MouseButtonType.EXTRA_FORWARD) != null;
        const someExtraBack = buttons.find(button => button == MouseButtonType.EXTRA_BACK) != null;

        if((someExtraFoward || someExtraBack) && this._previousRoomId != this._currentRoomId)
        {
            Nitro.instance.communication.connection.send(new RoomInfoComposer(this._previousRoomId, false, true));
        }
        else
        {
            return false;
        }

        this._timeout = Date.now();
        return true;
    }

    public onEnterRoom(roomId: number): void
    {
        this._previousRoomId = this._currentRoomId;
        this._currentRoomId = roomId;
    }


    public init(): void
    {
    }

    public dispose(): void
    {
        if(this.disposed) return;
        this._previousRoomId = null;
        this._currentRoomId = null;
        this._disposed = true;
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }
}
