let books = [];
const [
    tbodyDom,
    pagerDom,
    spagerDom
] = getDomsByIds( [
                      "tbody",
                      "pager",
                      "s-pager"
                  ] );

pagerDom.addCustomEventListener( 'onChangePageNo', d => toPage( d ) );
spagerDom.addCustomEventListener( 'onChangePageNo', d => toPage( d ) );

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

        tbodyDom.appendChild( row );
    } );
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

    pagerDom.ToPage();
};

window.onload = async () => {
    books = await getBooks();

    pagerDom.TotalCount = books.length;
    pagerDom.ToPage( 1 );

    spagerDom.TotalCount = books.length;
    spagerDom.ToPage( 1 );
}