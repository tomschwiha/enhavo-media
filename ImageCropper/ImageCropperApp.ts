import ActionManager from "@enhavo/app/Action/ActionManager";
import EventDispatcher from "@enhavo/app/ViewStack/EventDispatcher";
import View from "@enhavo/app/View/View";
import CloseEvent from "@enhavo/app/ViewStack/Event/CloseEvent";
import RemoveEvent from "@enhavo/app/ViewStack/Event/RemoveEvent";
import Confirm from "@enhavo/app/View/Confirm";
import FormatData from "@enhavo/media/ImageCropper/FormatData";
import FlashMessenger from "@enhavo/app/FlashMessage/FlashMessenger";
import UpdatedEvent from "@enhavo/app/ViewStack/Event/UpdatedEvent";
import ComponentRegistryInterface from "@enhavo/core/ComponentRegistryInterface";
import * as _ from "lodash";

export default class ImageCropperApp
{
    public data: FormatData;

    private eventDispatcher: EventDispatcher;
    private view: View;
    private actionManager: ActionManager;
    private flashMessenger: FlashMessenger;
    private componentRegistry: ComponentRegistryInterface;

    constructor(data: FormatData, eventDispatcher: EventDispatcher, view: View, actionManager: ActionManager, flashMessenger: FlashMessenger, componentRegistry: ComponentRegistryInterface)
    {
        this.data  = _.extend(data, new FormatData);
        this.eventDispatcher = eventDispatcher;
        this.view = view;
        this.actionManager = actionManager;
        this.flashMessenger = flashMessenger;
        this.componentRegistry = componentRegistry;
    }

    public init()
    {
        if(this.flashMessenger.has('success')) {
            this.eventDispatcher.dispatch(new UpdatedEvent(this.view.getId()))
        }

        this.view.init();
        this.actionManager.init();
        this.flashMessenger.init();

        this.componentRegistry.registerStore('imageCropper', this);
        this.componentRegistry.registerData(this.data);

        this.addCloseListener();
        this.view.ready();
    }

    protected addCloseListener()
    {
        this.eventDispatcher.on('close', (event: CloseEvent) => {
            if(this.view.getId() === event.id) {
                if(this.data.changed) {
                    this.view.confirm(new Confirm(
                        'not saved confirm',
                        () => {
                            event.resolve();
                            let id = this.view.getId();
                            this.eventDispatcher.dispatch(new RemoveEvent(id));
                        },
                        () => {
                            event.reject();
                        }
                    ));
                } else {
                    event.resolve();
                    let id = this.view.getId();
                    this.eventDispatcher.dispatch(new RemoveEvent(id, event.saveState));
                }
            }
        });
    }
}