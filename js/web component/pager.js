let books = [];
const [
    tbody,
    pager,
    spager
] = getDomsByIds( [
                      "tbody",
                      "pager",
                      "s-pager"
                  ] );

pager.addCustomEventListener( 'onChangePageNo', ( e, d ) => toPage( d ) );
spager.addCustomEventListener( 'onChangePageNo', ( e, d ) => toPage( d ) );

const bookRowTemplate = extractTemplate( "bookRowTemplate" );

async function getBooks() {
    return new Promise( resolve => {
        setTimeout( () => {
            resolve( Array.from( Array( 123 ).keys() ).map( i => {
                return {
                    Id: i + 1,
                    Title: `Title ${ i + 1 }`,
                    Author: `Author ${ i + 1 }`,
                    Price: ( i + 1 ) * 1000
                };
            } ) );
        }, 100 );
    } );
}

function toPage( eventDetail ) {
    const { pageNo } = eventDetail;

    const pagedData = books.getPagedData( pageNo, pager.PageSize );
    if ( ( pagedData?.length >= 0 ) === false ) {
        console.log( 'No data' );
        return;
    }

    tbody.innerHTML = "";
    pagedData.forEach( book => {

        const row = bookRowTemplate.cloneNode( true );

        row.setInnerTexts( {
                               '#Id': book.Id,
                               '#Title': book.Title,
                               '#Author': book.Author,
                               '#Price': book.Price
                           } );

        tbody.appendChild( row );
    } );
}

window.onload = async () => {
    books = await getBooks();

    pager.TotalCount = books.length;
    pager.ToPage( 1 );

    spager.TotalCount = books.length;
    spager.ToPage( 1 );
}