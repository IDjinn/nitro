import { EventEmitter, Injectable, NgZone, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { FigureSetIdsMessageEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/clothes/FigureSetIdsMessageEvent';
import { Nitro } from '../../../../client/nitro/Nitro';
import { RoomSessionEvent } from '../../../../client/nitro/session/events/RoomSessionEvent';
import { IRoomSession } from '../../../../client/nitro/session/IRoomSession';
import { SettingsService } from '../../../core/settings/service';
import { InventoryBotsComponent } from '../components/bots/bots.component';
import { InventoryFurnitureComponent } from '../components/furniture/furniture.component';
import { InventoryMainComponent } from '../components/main/main.component';
import { InventoryPetsComponent } from '../components/pets/pets.component';
import { InventoryTradingComponent } from '../components/trading/trading.component';
import { UnseenItemCategory } from '../unseen/UnseenItemCategory';
import { UnseenItemTracker } from '../unseen/UnseenItemTracker';

@Injectable()
export class InventoryService implements OnDestroy
{
    private _messages: IMessageEvent[] = [];
    private _events: Subject<string> = null;

    private _botsController: InventoryBotsComponent = null;
    private _furniController: InventoryFurnitureComponent = null;
    private _controller: InventoryMainComponent = null;
    private _petsController: InventoryPetsComponent = null;
    private _tradeController: InventoryTradingComponent = null;
    private _unseenTracker: UnseenItemTracker;
    private _roomSession: IRoomSession = null;
    private _unseenCount: number = 0;
    private _unseenCounts: Map<number, number>;
    private _botsVisible: boolean = false;
    private _furnitureVisible: boolean = false;
    private _petsVisible: boolean = false;
    private _tradingVisible: boolean = false;

    private _figureSetIds: number[] = [];
    private _boundFurnitureNames: string[] = [];

    constructor(
        private _settingsService: SettingsService,
        private _ngZone: NgZone)
    {
        this._events            = new EventEmitter();
        this._unseenTracker     = new UnseenItemTracker(Nitro.instance.communication, this);
        this._unseenCounts      = new Map();

        this.onRoomSessionEvent = this.onRoomSessionEvent.bind(this);

        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();

        if(this._unseenTracker)
        {
            this._unseenTracker.dispose();

            this._unseenTracker = null;
        }
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent);
            Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent);

            this._messages = [
                new FigureSetIdsMessageEvent(this.onFigureSetIdsMessageEvent.bind(this))
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    public unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent);
            Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent);

            for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }

    private onRoomSessionEvent(event: RoomSessionEvent): void
    {
        if(!event) return;

        switch(event.type)
        {
            case RoomSessionEvent.STARTED:
                this._roomSession = event.session;
                return;
            case RoomSessionEvent.ENDED:
                this._roomSession = null;

                this._ngZone.run(() => this.hideWindow());
                return;
        }
    }

    private onFigureSetIdsMessageEvent(event: FigureSetIdsMessageEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._figureSetIds          = parser.figureSetIds;
            this._boundFurnitureNames   = parser.boundsFurnitureNames;
        });
    }

    public updateUnseenCount(): void
    {
        function run()
        {
            let count = 0;

            const furniCount = this._unseenTracker._Str_5621(UnseenItemCategory.FURNI);

            count += furniCount;

            this._unseenCounts.set(UnseenItemCategory.FURNI, furniCount);

            this._unseenCount = count;
        }

        if(!NgZone.isInAngularZone())
        {
            this._ngZone.run(() => run.apply(this));
        }
        else
        {
            run.apply(this);
        }
    }

    public updateItemLocking(): void
    {
        if(!this.controller) return;

        this.controller.updateItemLocking();
    }

    public showWindow(): void
    {
        this._settingsService.showInventory();
    }

    public hideWindow(): void
    {
        (this.furniController && (this.furniController.mouseDown = false));

        this._settingsService.hideInventory();
    }

    public hasFigureSetId(k: number): boolean
    {
        return (this._figureSetIds.indexOf(k) > -1);
    }

    public hasBoundFigureSetFurniture(k: string): boolean
    {
        return (this._boundFurnitureNames.indexOf(k) > -1);
    }

    public get events(): Subject<string>
    {
        return this._events;
    }

    public get botsController(): InventoryBotsComponent
    {
        return this._botsController;
    }

    public set botsController(controller: InventoryBotsComponent)
    {
        this._botsController = controller;
    }

    public get furniController(): InventoryFurnitureComponent
    {
        return this._furniController;
    }

    public set furniController(controller: InventoryFurnitureComponent)
    {
        this._furniController = controller;
    }

    public get controller(): InventoryMainComponent
    {
        return this._controller;
    }

    public set controller(controller: InventoryMainComponent)
    {
        this._controller = controller;
    }

    public get petsController(): InventoryPetsComponent
    {
        return this._petsController;
    }

    public set petsController(controller: InventoryPetsComponent)
    {
        this._petsController = controller;
    }

    public get tradeController(): InventoryTradingComponent
    {
        return this._tradeController;
    }

    public set tradeController(controller: InventoryTradingComponent)
    {
        this._tradeController = controller;
    }

    public get unseenTracker(): UnseenItemTracker
    {
        return this._unseenTracker;
    }

    public get roomSession(): IRoomSession
    {
        return this._roomSession;
    }

    public get unseenCount(): number
    {
        return this._unseenCount;
    }

    public get botsVisible(): boolean
    {
        return this._botsVisible;
    }

    public set botsVisible(flag: boolean)
    {
        this._botsVisible = flag;
    }

    public get furnitureVisible(): boolean
    {
        return this._furnitureVisible;
    }

    public set furnitureVisible(flag: boolean)
    {
        this._furnitureVisible = flag;
    }

    public get petsVisible(): boolean
    {
        return this._petsVisible;
    }

    public set petsVisible(flag: boolean)
    {
        this._petsVisible = flag;
    }

    public get tradingVisible(): boolean
    {
        return this._tradingVisible;
    }

    public set tradingVisible(flag: boolean)
    {
        this._tradingVisible = flag;
    }

    public get figureSetIds(): number[]
    {
        return this._figureSetIds;
    }

    public get boundFurnitureNames(): string[]
    {
        return this._boundFurnitureNames;
    }
}