function getDomById( id ) {
    const dom = document.getElementById( id );

    if ( !dom ) {
        console.error( `Can't find dom by id: ${ id }` );
    }

    return dom;
}

function getDomsByIds( ids ) {
    const doms = ids.map( id => getDomById( id ) );

    return doms;
}

function extractTemplate( id ) {
    const template = getDomById( id );
    if ( !template ) {
        console.error( `Can't find template by id: ${ id }` );
    }

    template.classList.remove( 'hide' );

    return template?.cloneNode( true );
}

HTMLElement.prototype.dispatchCustomEvent = ( eventName, detail ) => {
    this.dispatchEvent( new CustomEvent( eventName, {
        detail: detail
    } ) );
}
HTMLElement.prototype.addCustomEventListener = ( eventName, callback ) => {
    this.addEventListener( eventName, ( e ) => callback( e.detail, e ) );
}

Array.prototype.getPagedData = function ( pageNo, pageSize ) {
    const startIndex = ( pageNo - 1 ) * pageSize;
    const endIndex = startIndex + pageSize;

    const pagedData = this.slice( startIndex, endIndex );

    return pagedData;
}

Node.prototype.setInnerText = function ( selector, text ) {
    const dom = this.querySelector( selector );
    if ( dom ) {
        dom.innerText = text;
        return;
    }

    console.error( `Can't find dom by selector: ${ selector }` );
}
Node.prototype.setInnerTexts = function ( selectorTextPairs ) {
    for ( let selector in selectorTextPairs ) {
        const text = selectorTextPairs[selector];
        this.setInnerText( selector, text );
    }
}