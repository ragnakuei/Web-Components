let books = [];
const [
    tbodyDom,
    pagerDom,
    spagerDom,
    btnAddBookDom,
    editBookDom,
] = getDomsByIds( [
                      "tbody",
                      "pager",
                      "s-pager",
                      "btnAddBook",
                      "editBook",
                  ] );

pagerDom.addCustomEventListener( 'onChangePageNo', d => toPage( d ) );
spagerDom.addCustomEventListener( 'onChangePageNo', d => toPage( d ) );
editBookDom.addCustomEventListener( 'onSaveBook', book => {
    const index = books.findIndex( b => b.Id === book.Id );
    if ( index >= 0 ) {
        books[index] = book;
    } else {
        book.Id = books.length + 1;
        books.push( book );
    }
    
    pagerDom.TotalCount = books.length;
    reloadPage();
} );
btnAddBookDom.addEventListener( 'click', () => {
    editBookDom.Show( {} );
} );

const bookRowTemplate = extractTemplate( "bookRowTemplate" );

async function getBooks() {
    const result = await new Promise( resolve => {
        setTimeout( () => {
            resolve( Array.from( Array( 123 ).keys() ).map( i => {
                const no = i + 1;
                return {
                    Id: no,
                    Title: `Title ${ no }`,
                    Author: `Author ${ no }`,
                    Price: ( no ) * 1000
                };
            } ) );
        }, 100 );
    } );

    result.globalSort( sortColumns.Current.id, sortColumns.Current.Order );

    return result;
}

function toPage( eventDetail ) {
    const { pageNo } = eventDetail;

    const pagedData = books.getPagedData( pageNo, pagerDom.PageSize );
    if ( ( pagedData?.length >= 0 ) === false ) {
        console.log( 'No data' );
        return;
    }

    tbodyDom.innerHTML = "";
    pagedData.forEach( book => {

        const row = bookRowTemplate.cloneNode( true );

        row.setInnerTexts( {
                               '#Id': book.Id,
                               '#Title': book.Title,
                               '#Author': book.Author,
                               '#Price': book.Price
                           } );

        row.querySelector( '#btnEditBook' ).addEventListener( 'click', () => {
            editBookDom.Show( book );
        } );

        row.querySelector( '#btnDeleteBook' ).addEventListener( 'click', () => {
            const index = books.findIndex( b => b.Id === book.Id );
            if ( index >= 0 ) {
                books.splice( index, 1 );
            }

            pagerDom.TotalCount = books.length;
            reloadPage();
        } );

        tbodyDom.appendChild( row );
    } );
}

function reloadPage() {
    pagerDom.ToPage();
}

const sortColumns = new SortColumns( [
                                         { text: '編號', id: 'Id', },
                                         { text: '標題', id: 'Title', },
                                         { text: '作者', id: 'Author', },
                                         { text: '售價', id: 'Price', },
                                     ] );
sortColumns.SortChange = ( column, order ) => {
    // console.log('column', column);
    // console.log('order', order);

    books.globalSort( column.id, order );

    reloadPage();
};

window.onload = async () => {
    books = await getBooks();

    pagerDom.TotalCount = books.length;
    pagerDom.ToPage( 1 );

    spagerDom.TotalCount = books.length;
    spagerDom.ToPage( 1 );
}

customElements.define( 'edit-book', class extends HTMLElement {

    constructor() {
        super();

        this.innerHTML = `
<wc-modal id="modal">
    <div class="modal-header">
        <h5 class="modal-title">編輯書籍</h5>
    </div>    
    <form>
        <div class="modal-body">
                <div class="mb-3">
                    <label for="id" class="form-label">編號</label>
                    <input type="text" class="form-control" id="Id" disabled>
                </div>
                <div class="mb-3">
                    <label for="title" class="form-label">標題</label>
                    <input type="text" class="form-control" id="Title">
                </div>
                <div class="mb-3">
                    <label for="author" class="form-label">作者</label>
                    <input type="text" class="form-control" id="Author">
                </div>
                <div class="mb-3">
                    <label for="price" class="form-label">售價</label>
                    <input type="number" class="form-control" id="Price">
                </div>
        </div>
        <div class="modal-footer">
            <button type="submit" class="btn btn-outline-primary" >儲存</button>
            <button type="button" class="btn btn-outline-secondary" id="btnCancel">取消</button>
        </div>
    </form>
</wc-modal>       
`;
        [
            this._modalDom,
            this._btnCancelDom,
            this._formDom,
            this._IdDom,
            this._TitleDom,
            this._AuthorDom,
            this._PriceDom,
        ] = this.querySelectors( [
                                     '#modal',
                                     '#btnCancel',
                                     'form',
                                     '#Id',
                                     '#Title',
                                     '#Author',
                                     '#Price',
                                 ] );

        this._btnCancelDom.addEventListener( 'click', () => {
            this._modalDom.Hide();
        } );

        this._formDom.addEventListener( 'submit', ( e ) => {
            e.preventDefault();

            const book = {
                Id: Number( this._IdDom.value ),
                Title: this._TitleDom.value,
                Author: this._AuthorDom.value,
                Price: this._PriceDom.value,
            };

            this.dispatchCustomEvent( 'onSaveBook', { ...book } );

            this._modalDom.Hide();
        } );

    }

    // fields
    _editBook = null;
    _modalDom = null;
    _btnCancelDom = null;
    _formDom = null;
    _IdDom = null;
    _TitleDom = null;
    _AuthorDom = null;
    _PriceDom = null;

    Show = ( book ) => {
        this._editBook = book;

        this._modalDom.Show();

        this._IdDom.value = this._editBook.Id || '';
        this._TitleDom.value = this._editBook.Title || '';
        this._AuthorDom.value = this._editBook.Author || '';
        this._PriceDom.value = this._editBook.Price || '';
    };

} );