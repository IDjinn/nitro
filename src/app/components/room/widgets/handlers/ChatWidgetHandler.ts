import { Point } from 'pixi.js';
import { IConnection } from '../../../../../client/core/communication/connections/IConnection';
import { NitroEvent } from '../../../../../client/core/events/NitroEvent';
import { AvatarFigurePartType } from '../../../../../client/nitro/avatar/enum/AvatarFigurePartType';
import { AvatarScaleType } from '../../../../../client/nitro/avatar/enum/AvatarScaleType';
import { AvatarSetType } from '../../../../../client/nitro/avatar/enum/AvatarSetType';
import { IAvatarImageListener } from '../../../../../client/nitro/avatar/IAvatarImageListener';
import { PetFigureData } from '../../../../../client/nitro/avatar/pets/PetFigureData';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { RoomObjectCategory } from '../../../../../client/nitro/room/object/RoomObjectCategory';
import { RoomObjectType } from '../../../../../client/nitro/room/object/RoomObjectType';
import { RoomObjectVariable } from '../../../../../client/nitro/room/object/RoomObjectVariable';
import { RoomSessionChatEvent } from '../../../../../client/nitro/session/events/RoomSessionChatEvent';
import { IRoomWidgetHandler } from '../../../../../client/nitro/ui/IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../../../../../client/nitro/ui/IRoomWidgetHandlerContainer';
import { RoomWidgetEnum } from '../../../../../client/nitro/ui/widget/enums/RoomWidgetEnum';
import { SystemChatStyleEnum } from '../../../../../client/nitro/ui/widget/enums/SystemChatStyleEnum';
import { RoomWidgetUpdateEvent } from '../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetMessage } from '../../../../../client/nitro/ui/widget/messages/RoomWidgetMessage';
import { IVector3D } from '../../../../../client/room/utils/IVector3D';
import { PointMath } from '../../../../../client/room/utils/PointMath';
import { Vector3d } from '../../../../../client/room/utils/Vector3d';
import { ChatHistoryItem } from '../../../chat-history/common/ChatHistoryItem';
import { ChatHistoryService } from '../../../chat-history/services/chat-history.service';
import { RoomWidgetChatUpdateEvent } from '../events/RoomWidgetChatUpdateEvent';
import { RoomWidgetRoomViewUpdateEvent } from '../events/RoomWidgetRoomViewUpdateEvent';
import { RoomChatComponent } from '../roomchat/component';

export class ChatWidgetHandler implements IRoomWidgetHandler, IAvatarImageListener
{
    private _container: IRoomWidgetHandlerContainer;
    private _widget: RoomChatComponent;

    private _connection: IConnection;

    private _avatarColorCache: Map<string, number>;
    private _avatarImageCache: Map<string, HTMLImageElement>;
    private _petImageCache: Map<string, HTMLImageElement>;
    private _primaryCanvasScale: number;
    private _primaryCanvasOriginPos: Point;
    private _tempScreenPosVector: Vector3d;
    private _lastPoint: Point = null;

    private _disposed: boolean;

    constructor(private _chatHistoryService: ChatHistoryService)
    {
        this._container = null;
        this._widget = null;

        this._connection = null;

        this._avatarColorCache = new Map();
        this._avatarImageCache = new Map();
        this._petImageCache = new Map();
        this._primaryCanvasScale = 0;
        this._primaryCanvasOriginPos = null;
        this._tempScreenPosVector = new Vector3d();

        this._disposed = false;
    }

    public dispose(): void
    {
        if (this._disposed) return;

        this._container = null;
        this._widget = null;
        this._disposed = true;
    }

    public update(): void
    {
        this._Str_20006();
    }

    private _Str_20006(): void
    {
        if (!this._container || !this._container.roomSession || !this._container.roomEngine || !this._container.events) return;

        const canvasId = this._container.getFirstCanvasId();
        const roomId = this._container.roomSession.roomId;
        const canvas = this._container.roomEngine.getRoomInstanceRenderingCanvas(roomId, canvasId);

        if (!canvas) return;

        const geometry = canvas.geometry;
        const geometryScale = (geometry.scale / canvas.scale);

        if (!geometry) return;

        let scale = 1;

        if (this._primaryCanvasScale > 0) scale = (geometry.scale / this._primaryCanvasScale);

        if (!this._primaryCanvasOriginPos)
        {
            this._tempScreenPosVector.x = 0;
            this._tempScreenPosVector.y = 0;
            this._tempScreenPosVector.z = 0;
            this._primaryCanvasOriginPos = geometry.getScreenPoint(this._tempScreenPosVector);
            this._primaryCanvasScale = (geometry.scale - 10);
        }

        let eventType = '';
        let _local_6: RoomWidgetUpdateEvent = null;

        this._tempScreenPosVector.x = 0;
        this._tempScreenPosVector.y = 0;
        this._tempScreenPosVector.z = 0;

        const screenPoint = geometry.getScreenPoint(this._tempScreenPosVector);

        if (screenPoint)
        {
            const offset = this._container.roomEngine.getRoomInstanceRenderingCanvasOffset(roomId, canvasId);

            if (offset)
            {
                screenPoint.set((screenPoint.x + offset.x), (screenPoint.y + offset.y));
            }

            if (((!(screenPoint.x == this._primaryCanvasOriginPos.x)) || (!(screenPoint.y == this._primaryCanvasOriginPos.y))))
            {
                const _local_9 = PointMath._Str_15193(screenPoint, PointMath._Str_6038(this._primaryCanvasOriginPos, scale));

                if (((!(_local_9.x == 0)) || (!(_local_9.y == 0))))
                {
                    eventType = RoomWidgetRoomViewUpdateEvent.POSITION_CHANGED;
                    _local_6 = new RoomWidgetRoomViewUpdateEvent(eventType, null, _local_9);

                    this._container.events.dispatchEvent(_local_6);
                }

                this._primaryCanvasOriginPos = screenPoint;
            }
        }

        if (geometry.scale !== this._primaryCanvasScale)
        {
            eventType = RoomWidgetRoomViewUpdateEvent.SCALE_CHANGED;
            _local_6 = new RoomWidgetRoomViewUpdateEvent(eventType, null, null, geometry.scale);

            this._container.events.dispatchEvent(_local_6);

            this._primaryCanvasScale = geometry.scale;
        }
    }

    private getBubbleLocation(roomId: number, userLocation: IVector3D): Point
    {

        if (this._lastPoint)
            return this._lastPoint;

        const geometry = this._container.roomEngine.getRoomInstanceGeometry(roomId, this._container.getFirstCanvasId());
        const scale = this._container.roomEngine.getRoomInstanceRenderingCanvasScale(roomId, this._container.getFirstCanvasId());

        let x = ((document.body.offsetWidth * scale) / 2);
        let y = ((document.body.offsetHeight * scale) / 2);

        if (geometry && userLocation)
        {
            const screenPoint = geometry.getScreenPoint(userLocation);

            if (screenPoint)
            {
                x = (x + (screenPoint.x * scale));
                y = (y + (screenPoint.y * scale));

                const offsetPoint = this._container.roomEngine.getRoomInstanceRenderingCanvasOffset(roomId, this._container.getFirstCanvasId());

                if (offsetPoint)
                {
                    x = (x + offsetPoint.x);
                    y = (y + offsetPoint.y);
                }
            }
        }

        this._lastPoint = new Point(x, y);
        return new Point(x, y);
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if (!message || this._disposed) return null;

        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        if (!event || this._disposed) return;

        switch (event.type)
        {
            case RoomSessionChatEvent.CHAT_EVENT: {
                const chatEvent = (event as RoomSessionChatEvent);

                const roomObject = this._container.roomEngine.getRoomObject(chatEvent.session.roomId, chatEvent.objectId, RoomObjectCategory.UNIT);

                if (roomObject)
                {
                    const roomGeometry = this._container.roomEngine.getRoomInstanceGeometry(chatEvent.session.roomId, this._container.getFirstCanvasId());

                    if (roomGeometry)
                    {
                        this._Str_20006();

                        const objectLocation = roomObject.getLocation();
                        const bubbleLocation = this.getBubbleLocation(chatEvent.session.roomId, objectLocation);
                        const userData = this._container.roomSession.userDataManager.getUserDataByIndex(chatEvent.objectId);

                        let username = '';
                        let avatarColor = 0;
                        let image: HTMLImageElement = null;
                        const chatType = chatEvent.chatType;
                        let styleId = chatEvent.style;
                        let userType = 0;
                        let petType = -1;


                        if (userData)
                        {
                            userType = userData.type;

                            const figure = userData.figure;

                            switch (userType)
                            {
                                case RoomObjectType.PET:
                                    image = this.getPetImage(figure, 2, true, 64, roomObject.model.getValue<string>(RoomObjectVariable.FIGURE_POSTURE));
                                    petType = new PetFigureData(figure).typeId;
                                    break;
                                case RoomObjectType.USER:
                                    image = this.getUserImage(figure);
                                    break;
                                case RoomObjectType.RENTABLE_BOT:
                                case RoomObjectType.BOT:
                                    styleId = SystemChatStyleEnum.BOT;
                                    break;

                            }

                            avatarColor = this._avatarColorCache.get(figure);
                            username = userData.name;
                        }

                        let text = chatEvent.message;

                        switch (chatType)
                        {
                            case RoomSessionChatEvent._Str_5821:
                                text = Nitro.instance.getLocalizationWithParameter('widgets.chatbubble.respect', 'username', username);
                                break;
                            case RoomSessionChatEvent._Str_6081:
                                text = Nitro.instance.getLocalizationWithParameter('widget.chatbubble.petrespect', 'petname', username);
                                break;
                            case RoomSessionChatEvent._Str_5958:
                                text = Nitro.instance.getLocalizationWithParameter('widget.chatbubble.pettreat', 'petname', username);
                                break;
                            case RoomSessionChatEvent._Str_8971:
                                text = Nitro.instance.getLocalizationWithParameters('widget.chatbubble.handitem', ['username', 'handitem'], [username, Nitro.instance.getLocalization(('handitem' + chatEvent.extraParam))]);
                                break;
                            case RoomSessionChatEvent._Str_8909: {
                                const hours = ((chatEvent.extraParam > 0) ? Math.floor((chatEvent.extraParam / 3600)) : 0).toString();
                                const minutes = ((chatEvent.extraParam > 0) ? Math.floor((chatEvent.extraParam % 3600) / 60) : 0).toString();
                                const seconds = (chatEvent.extraParam % 60).toString();

                                text = Nitro.instance.getLocalizationWithParameters('widget.chatbubble.mutetime', ['hours', 'minutes', 'seconds'], [hours, minutes, seconds]);
                                break;
                            }
                        }

                        const historyEntry = new ChatHistoryItem();

                        historyEntry.senderId = chatEvent.objectId;
                        historyEntry.senderName = (userData.name + ':');
                        historyEntry.senderColor = avatarColor;

                        if (image && image.src) historyEntry.senderImageUrl = image.src;

                        historyEntry.content = text;
                        historyEntry.chatType = chatType;
                        historyEntry.chatStyle = styleId;

                        this._chatHistoryService.addItem(chatEvent.session.roomId, historyEntry);

                        if (this._container && this._container.events) this._container.events.dispatchEvent(new RoomWidgetChatUpdateEvent(RoomWidgetChatUpdateEvent.RWCUE_EVENT_CHAT, userData.roomIndex, text, username, RoomObjectCategory.UNIT, userType, petType, bubbleLocation.x, bubbleLocation.y, image, avatarColor, chatEvent.session.roomId, chatType, styleId, []));
                    }
                }

                return;
            }
        }
    }

    public getUserImage(figure: string): HTMLImageElement
    {
        let existing = this._avatarImageCache.get(figure);

        if (!existing)
        {
            existing = this.setFigureImage(figure);
        }

        return existing;
    }

    private setFigureImage(figure: string): HTMLImageElement
    {
        const avatarImage = this._container.avatarRenderManager.createAvatarImage(figure, AvatarScaleType.LARGE, null, this);

        if (!avatarImage) return;

        const image = avatarImage.getCroppedImage(AvatarSetType.HEAD);
        const color = avatarImage.getPartColor(AvatarFigurePartType.CHEST);

        this._avatarColorCache.set(figure, ((color && color._Str_915) || 16777215));

        avatarImage.dispose();

        this._avatarImageCache.set(figure, image);

        return image;
    }

    private getPetImage(figure: string, direction: number, _arg_3: boolean, scale: number = 64, posture: string = null): HTMLImageElement
    {
        let existing = this._petImageCache.get((figure + posture));

        if (existing) return existing;

        const figureData = new PetFigureData(figure);
        const typeId = figureData.typeId;

        const image = this._container.roomEngine.getRoomObjectPetImage(typeId, figureData.paletteId, figureData.color, new Vector3d((direction * 45)), scale, null, false, 0, figureData.customParts, posture);

        if (image)
        {
            existing = Nitro.instance.renderer.extract.image(image.data);

            this._petImageCache.set((figure + posture), existing);
        }

        return existing;
    }

    public resetFigure(figure: string): void
    {
        this.setFigureImage(figure);
    }

    public get type(): string
    {
        return RoomWidgetEnum.CHAT_WIDGET;
    }

    public get messageTypes(): string[]
    {
        return [];
    }

    public get eventTypes(): string[]
    {
        return [RoomSessionChatEvent.CHAT_EVENT];
    }

    public get container(): IRoomWidgetHandlerContainer
    {
        return this._container;
    }

    public set container(container: IRoomWidgetHandlerContainer)
    {
        this._container = container;
    }

    public get widget(): RoomChatComponent
    {
        return this._widget;
    }

    public set widget(widget: RoomChatComponent)
    {
        this._widget = widget;
    }

    public get connection(): IConnection
    {
        return this._connection;
    }

    public set connection(connection: IConnection)
    {
        this._connection = connection;
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }
}
