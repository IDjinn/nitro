import { Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { ModTool } from '../../tool.component';
import { ModToolService } from '../../../services/mod-tool.service';
import { ModToolUserInfoService } from '../../../services/mod-tool-user-info.service';
import { UserToolUser } from '../user-tool/user-tool-user';
import { ModtoolUserVisitedRoomsRoom } from '../../../../../../client/nitro/communication/messages/parser/modtool/utils/ModtoolUserVisitedRoomsRoom';
import { NavigatorService } from '../../../../navigator/services/navigator.service';


@Component({
    selector: 'nitro-mod-tool-user-visited-rooms-component',
    templateUrl: './template.html'
})
export class ModToolUserVisitedRoomsComponent extends ModTool implements OnInit, OnDestroy
{
    @Input()
    public user: UserToolUser = null;


    constructor(
        private _modToolService: ModToolService,
        private _modToolUserInfoService: ModToolUserInfoService,
        private _navigatorService: NavigatorService
    )
    {
        super();
    }

    public ngOnInit(): void
    {
    }

    public ngOnDestroy(): void
    {
    }

    public close(): void
    {
        this._modToolService.closeRoomVisitedTool();
    }

    public get roomVisitedForUser(): ModtoolUserVisitedRoomsRoom[]
    {
        if(!this._modToolService.roomUserVisitedData) return [];

        return this._modToolService.roomUserVisitedData.rooms;
    }

    public showTime(room: ModtoolUserVisitedRoomsRoom): string
    {
        const a = room._Str_22929;
        const b = room._Str_25550;
        return this.prependZero(a) + ':' + this.prependZero(b);
    }

    private prependZero(k: number): string
    {
        return (k < 10) ? `0${k}` : k.toString();
    }

    public goToRoom(room: ModtoolUserVisitedRoomsRoom): void
    {
        this._navigatorService.goToPrivateRoom(room.roomId);
    }



}
