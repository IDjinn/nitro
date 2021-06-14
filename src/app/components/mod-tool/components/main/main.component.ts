import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { SettingsService } from '../../../../core/settings/service';
import { ModToolUserInfoService } from '../../services/mod-tool-user-info.service';
import { ModToolService } from '../../services/mod-tool.service';
import { UserToolUser } from '../user/user-tool/user-tool-user';

@Component({
    selector: 'nitro-mod-tool-main-component',
    templateUrl: './main.template.html'
})
export class ModToolMainComponent implements OnInit, OnDestroy
{
    @Input()
    public visible: boolean = true;

    public roomToolVisible: boolean = false;
    public chatlogToolVisible: boolean = false;
    public userToolVisible: boolean = false;
    public reportsToolVisible: boolean = false;

    public clickedUser: UserToolUser = null;

    constructor(
        private _settingsService: SettingsService,
        private _modToolService: ModToolService,
        private _modToolsUserService: ModToolUserInfoService,
        private _ngZone: NgZone)
    {
    }

    public ngOnInit(): void
    {
        this._modToolService.component = this;
    }

    public ngOnDestroy(): void
    {
        this._modToolService.component = null;
    }

    public toggleRoomTool(): void
    {
        this._modToolService.showRoomTools = !this._modToolService.showRoomTools;
    }

    public openRoomTool(): void
    {
        this._modToolService.openRoomTool();
    }

    public openChatlogTool(): void
    {
        this._modToolService.openChatlogTool();
    }

    public toggleChatlogTool(): void
    {
        this._modToolService.showRoomChatLogs = !this._modToolService.showRoomChatLogs;
        if(this._modToolService.showRoomChatLogs)
            this._modToolService.openChatlogTool();
    }

    public selectUser(): void
    {
        this.userToolVisible = !this.userToolVisible;
        this.clickedUser = this.selectedUser;
        this._modToolsUserService.load(this.selectedUser.id);
    }

    public toggleReportsTool(): void
    {
        this.reportsToolVisible = !this.reportsToolVisible;
    }

    public hasRoomInfo(): boolean
    {
        return !!this._modToolService.currentRoom;
    }

    public get users(): UserToolUser[]
    {
        return this._modToolService.users;
    }

    public get selectedUser(): UserToolUser
    {
        return this._modToolService.selectedUser;
    }

    public get showModActionOnUser(): boolean
    {
        return this._modToolService.showModActionOnUser;
    }

    public get showVisitedRoomsForUser(): boolean
    {
        return this._modToolService.showVisitedRoomsForUser;
    }

    public get showSendUserMessage(): boolean
    {
        return this._modToolService.showSendUserMessage;
    }

    public get showSendUserChatlogs(): boolean
    {
        return this._modToolService.showSendUserChatlogs;
    }

    public get showRoomChatlogs(): boolean
    {
        return this._modToolService.showRoomChatLogs;
    }

    public get showRoomTool(): boolean
    {
        return this._modToolService.showRoomTools;
    }

    public toggleModTools()
    {
        this.visible = !this.visible;
    }

    public toggleItemsTool()
    {
        this._modToolService.toggleItemTool();
    }

    public get showItemTool()
    {
        return this._modToolService.showItemTool;
    }
}
