// 會抓出 document 內的所有 wc-column-sort
class SortColumns {

    // column 為 { 
    //     text: '',       => 顯示出來的文字
    //     id: '',         => id 就是 row 的 column property name，也是 wc-column-sort 的 id      
    //     wc: '',         => wc-column-sort 的 dom
    // }
    constructor( columns ) {
        this._columns = columns;

        this._columns.forEach( col => {

            col.wc = getDomById( col.id );
            col.wc.Text = col.text;
            col.wc.addCustomEventListener( 'onSortChange', d => {
                this._current = {
                    ...col,
                    Order: d.Order,
                }
                this.SortChange( col, d.Order );

                this.ResetOtherColumnOrder( col );
            } )

        } )
    }

    // field
    _columns = null;
    _current = {};

    // property
    get Current() {
        return this._current;
    }

    // callback
    SortChange = null;

    // functions
    ResetOtherColumnOrder = ( col ) => {
        this._columns.filter( c => c !== col )
            .forEach( other => {
                other.wc.ResetOrder();
            } )
    }

}

// 排序 icon
// events： onSortChange
window.customElements.define( 'wc-column-sort', class extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
<a href="javascript:;" >
    <span id="text"></span>
    <span class="hide" id="asc">↓</span>
    <span class="hide" id="desc">↑</span>
</a>
`;
        this.addEventListener( 'click', () => {
            this._toggleSort();
        } );

        [
            this._textDom,
            this._ascDom,
            this._descDom
        ] = this.querySelectors( [
                                     '#text',
                                     '#asc',
                                     '#desc'
                                 ] );
    }

    // field
    _textDom = null;
    _ascDom = null;
    _descDom = null;

    // asc / desc
    _order = null;

    // property

    set Text( value ) {
        this._textDom.innerText = value;
    }

    // functions

    // 用於其他欄位進行排序時，可以透過這個 function 重置
    ResetOrder = () => {
        this._setOrder( null );
    }

    _toggleSort = () => {
        switch ( this._order ) {
            case 'asc':
                this._setOrder( 'desc' );
                break;
            case 'desc':
            default:
                this._setOrder( 'asc' );
                break;
        }
    }

    _setOrder( value ) {
        this._order = value;
        switch ( value ) {
            case 'asc':
                this._ascDom.classList.remove( 'hide' );
                this._descDom.classList.add( 'hide' );
                break;
            case 'desc':
                this._ascDom.classList.add( 'hide' );
                this._descDom.classList.remove( 'hide' );
                break;
            default:
                this._ascDom.classList.add( 'hide' );
                this._descDom.classList.add( 'hide' );
                break;
        }

        // 沒值不觸發事件，用於重置 Order 狀態
        if ( !!this._order ) {
            this.dispatchCustomEvent( 'onSortChange', { Order: this._order, } );
        }
    }

} );
  
