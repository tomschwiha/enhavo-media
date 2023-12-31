import * as $ from "jquery";
import MediaItemMeta from "@enhavo/media/Type/MediaItemMeta";
import MediaRow from "@enhavo/media/Type/MediaRow";

export default class MediaItem
{
    private $element: JQuery;

    private meta: MediaItemMeta;

    private row: MediaRow;

    constructor(element:HTMLElement, meta:MediaItemMeta, row:MediaRow)
    {
        this.$element = $(element);
        this.meta = meta;
        this.row = row;
        this.addHandler();
    }

    private addHandler()
    {
        let self = this;

        if(this.row.getMedia().getConfig().edit) {
            this.$element.click(function() {
                self.openEdit();
            });
        }

        this.$element.find('[data-media-item-delete]').click(function(event) {
            event.stopPropagation();
            event.preventDefault();
            self.remove();
        });
    }

    inactive()
    {
        this.$element.removeClass('active');
    }

    active()
    {
        this.$element.addClass('active');
    }

    remove()
    {
        this.$element.remove();
        this.row.closeEdit();
        this.row.setOrder();
    }

    getElement():HTMLElement
    {
        return <HTMLElement>this.$element.get(0);
    }

    getEditElements():Array<HTMLElement>
    {
        return <HTMLElement[]>this.$element.find('[data-media-edit]').children().toArray();
    }

    setEditElements(element:HTMLElement|Array<HTMLElement>)
    {
        return this.$element.find('[data-media-edit]').append(element);
    }

    setOrder(order:number)
    {
        this.meta.order = order;
        this.$element.find('[data-position]').val(order);
    }

    setFilename(filename:string)
    {
        this.meta.filename = filename;
        this.$element.find('[data-media-item-filename]').val(filename);
    }

    setId(id:number)
    {
        this.meta.id = id;
        this.$element.find('[data-media-item-id]').val(id);
    }

    getId(): number
    {
        return this.meta.id;
    }

    openEdit()
    {
        this.row.openEdit(this);
    }

    closeEdit()
    {
        this.row.closeEdit();
    }

    getRow(): MediaRow
    {
        return this.row;
    }

    getMeta(): MediaItemMeta
    {
        return this.meta;
    }

    updateThumb()
    {
        // reset
        this.$element.find('[data-media-thumb]').css('background-image', 'none');
        this.$element.find('[data-media-thumb-icon]').removeClass().addClass('icon');

        // set icon/image
        switch (this.meta.mimeType) {
            case 'image/png':
            case 'image/jpg':
            case 'image/jpeg':
            case 'image/gif':
                this.$element.find('[data-media-thumb]').css('background-image', 'url('+this.getThumbUrl()+')');
                break;
            case 'video/mpeg':
            case 'video/mp4':
            case 'video/quicktime':
            case 'video/vnd.vivo':
            case 'video/x-msvideo':
            case 'video/x-sgi-movie':
                this.$element.find('[data-media-thumb-icon]').addClass('icon-file_video');
                break;
            case 'audio/basic':
            case 'audio/echospeech':
            case 'audio/tsplayer':
            case 'audio/voxware':
            case 'audio/x-aiff':
            case 'audio/x-dspeeh':
            case 'audio/x-midi':
            case 'audio/x-mpeg':
            case 'audio/x-pn-realaudio':
            case 'audio/x-pn-realaudio-plugin':
            case 'audio/x-qt-stream:':
            case 'audio/x-wav':
                this.$element.find('[data-media-thumb-icon]').addClass('icon-file_audio');
                break;
            case 'text/plain':
            case 'application/postscript':
            case 'application/rtf':
            case 'application/msword':
            case 'application/vnd.oasis.opendocument.text':
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                this.$element.find('[data-media-thumb-icon]').addClass('icon-file_text');
                break;
            case 'application/pdf':
                this.$element.find('[data-media-thumb-icon]').addClass('icon-file_pdf');
                break;
            case 'application/msexcel':
            case 'application/vnd.oasis.opendocument.spreadsheet':
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                this.$element.find('[data-media-thumb-icon]').addClass('icon-file_xls');
                break;
            case 'application/mspowerpoint':
                this.$element.find('[data-media-thumb-icon]').addClass('icon-file_ppt');
                break;
            case 'text/css':
            case 'text/html':
            case 'text/javascript':
            case 'text/xml':
            case 'text/x-php':
            case 'application/json':
            case 'application/xhtml+xml':
            case 'application/xml':
            case 'application/x-httpd-php':
            case 'application/x-javascript':
            case 'application/x-latex':
            case 'application/x-php':
                this.$element.find('[data-media-thumb-icon]').addClass('icon-file_code');
                break;
            default:
                this.$element.find('[data-media-thumb-icon]').addClass('icon-file_document');
        }
    }

    getThumbUrl(): string
    {
        let url = ' /file/resolve/{token}/{format}?v={random}';
        url = url.replace('{token}', this.meta.token.toString());
        url = url.replace('{format}', 'enhavoPreviewThumb');
        url = url.replace('{random}', Math.random().toString());
        return url;
    }

    getFileUrl(): string
    {
        let url = ' /file/resolve/{token}?v={random}';
        url = url.replace('{token}', this.meta.token.toString());
        url = url.replace('{random}', Math.random().toString());
        return url;
    }
}