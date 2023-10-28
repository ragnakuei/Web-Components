// events： onChangePageNo
customElements.define( "wc-pager", class extends HTMLElement {

    // lifecycle hooks

    constructor() {
        super();

        this.PageSize = Number( this.getAttribute( "page-size" ) ) || 10;
        this._pageOffSet = this.getAttribute( "page-offset" ) || 3;
        this._pageNo = 1;
    }

    connectedCallback() {
    }

    // fields
    _pageOffSet = null;
    _pageNo = null;

    // properties
    PageSize = null;
    TotalCount = null;

    get _pageCount() {
        return Math.ceil( this.TotalCount / this.PageSize );
    };

    // functions

    _render = () => {
        if ( this._pageCount === 0 ) return;

        // 如果目前頁碼大於總頁數，則將目前頁碼設定為總頁數
        if(this._pageNo > this._pageCount) {
            this._pageNo = this._pageCount;
            this.ToPage();
        }

        this.innerHTML = `
<nav aria-label="Page navigation example">
    <ul class="pagination">
    </ul>
</nav>
                `;

        const ul = this.querySelector( "ul" );

        if ( this._pageNo > 1 ) {
            const firstPageSpan = this._createPageItem( '<<', 1, false );
            ul.appendChild( firstPageSpan );

            const prevPageSpan = this._createPageItem( '<', Math.max( 1, this._pageNo - 1 ), false );
            ul.appendChild( prevPageSpan );
        }

        const firstPageNo = Math.max( 1, this._pageNo - this._pageOffSet );
        const lastPageNo = Math.min( this._pageNo + this._pageOffSet, this._pageCount );
        for ( let i = firstPageNo; i <= lastPageNo; i++ ) {
            const pageSpan = this._createPageItem( i, i );
            ul.appendChild( pageSpan );
        }

        if ( this._pageNo < this._pageCount ) {
            const nextPageSpan = this._createPageItem( '>', Math.min( this._pageCount, this._pageNo + 1 ), false );
            ul.appendChild( nextPageSpan );

            const lastPageSpan = this._createPageItem( '>>', this._pageCount, false );
            ul.appendChild( lastPageSpan );
        }
    }

    _createPageItem = ( text, pageNo, isShowActive = true ) => {
        const pageItem = document.createElement( "li" );
        pageItem.className = "page-item";

        if ( this._pageNo === pageNo && isShowActive ) {
            pageItem.className += " active";
        }

        const pageLink = document.createElement( "a" );
        pageLink.className = "page-link";
        pageLink.href = "#";
        pageLink.innerText = text;
        pageLink.onclick = () => {
            this.ToPage( pageNo );
        }

        pageItem.appendChild( pageLink );
        return pageItem;
    }

    ToPage = ( pageNo ) => {

        // 如果不給定 pageNo，則使用目前的 pageNo，可以當作目前頁面 reload
        this._pageNo = pageNo || this._pageNo;

        this.dispatchCustomEvent( 'onChangePageNo', { pageNo: this._pageNo, } );

        this._render();
    }
} );