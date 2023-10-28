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

function setValueToDoms( target, obj, assigners ) {
    for ( let key in assigners ) {

        const dom = target.querySelector( '#' + key );
        if ( !dom ) {
            console.error( `Can't find dom by selector: ${ key }` );
            continue;
        }

        const value = obj[key];
        const assigner = assigners[key];
        if ( assigner ) {
            assigner( dom, value );
            continue;
        }

        if ( dom ) {
            dom.value = value || '';
        }

    }
}

// 注意：以 prototype 擴充時，不要用 arrow function，否則 this 會指向 window

Array.prototype.getPagedData = function ( pageNo, pageSize ) {
    const startIndex = ( pageNo - 1 ) * pageSize;
    const endIndex = startIndex + pageSize;

    const pagedData = this.slice( startIndex, endIndex );

    return pagedData;
}
Array.prototype.globalSort = function ( column, order ) {
    if ( this.length > 0 === false
        || !column
        || !order ) {
        return;
    }

    // 如果是數字 / boolean / Date
    if ( [ 'number', 'boolean' ].includes( typeof this[0][column] )
        || this[0][column] instanceof Date ) {
        this.globalNumberSort( column, order );
        return;
    }

    // 其他
    this.globalStringSort( column, order );
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
