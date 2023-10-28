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

// 注意：以 prototype 擴充時，不要用 arrow function，否則 this 會指向 window

HTMLElement.prototype.querySelectors = function ( selectors ) {
    const doms = selectors.map( selector => this.querySelector( selector ) );
    return doms;
}
HTMLElement.prototype.dispatchCustomEvent = function ( eventName, detail ) {
    this.dispatchEvent( new CustomEvent( eventName, {
        detail: detail
    } ) );
}
HTMLElement.prototype.addCustomEventListener = function ( eventName, callback ) {
    this.addEventListener( eventName, ( e ) => callback( e.detail, e ) );
}

Array.prototype.getPagedData = function ( pageNo, pageSize ) {
    const startIndex = ( pageNo - 1 ) * pageSize;
    const endIndex = startIndex + pageSize;

    const pagedData = this.slice( startIndex, endIndex );

    return pagedData;
}
Array.prototype.globalSort = function ( column, order ) {
    if ( this.length > 0 === false ) {
        return;
    }

    // 如果是數字
    if ( typeof this[0][column] === 'number' ) {
        this.globalNumberSort( column, order );
    }

    // 如果是字串
    if ( typeof this[0][column] === 'string' ) {
        this.globalStringSort( column, order );
    }
}
Array.prototype.globalNumberSort = function ( column, order ) {
    this.sort( ( a, b ) => {
        if ( order === 'asc' ) {
            return a[column] - b[column];
        } else {
            return b[column] - a[column];
        }
    } );
}
Array.prototype.globalStringSort = function ( column, order ) {
    this.sort( ( a, b ) => {
        if ( order === 'asc' ) {
            return a[column].localeCompare( b[column] );
        } else {
            return b[column].localeCompare( a[column] );
        }
    } );
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