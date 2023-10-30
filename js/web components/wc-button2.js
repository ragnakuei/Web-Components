window.customElements.define( 'wc-button', class extends HTMLElement {
    // lifecycle hooks
    constructor() {
        super();
    }

    connectedCallback() {

        this.innerHTML = `
<style nonce="123abc">

    .wcBtn {
    }

    .spinner {
      animation: spin 1s linear infinite;
      vertical-align: text-bottom;
    }

    .one-third-circle {
      fill: none;
      stroke: blue;
      stroke-width: 4;
      stroke-dasharray: 16.76 33.51;
    }    

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
</style>

<button class="wcBtn hide">
    <svg class="spinner hide" width="20" height="20" viewBox="0 0 20 20">
      <circle class="one-third-circle" cx="10" cy="10" r="8" />
    </svg>
    <span id="btnText"></span>
</button>
    `;
        [
            this._wcBtnDom,
            this._btnTextDom,
            this._spinnerDom
        ] = this.querySelectors( [
                                     '.wcBtn',
                                     '#btnText',
                                     '.spinner',
                                 ] );

        this._btnTextDom.innerText = this.text;

        this._wcBtnDom.setAttribute( 'type', this.type );
        this._wcBtnDom.classList.remove( 'hide' );
        this._wcBtnDom.addEventListener( 'click', this._click );
    }

    // fields
    _wcBtnDom = null;
    _btnTextDom = null;
    _spinnerDom = null;

    // property

    get id() {
        return this.getAttribute( 'id' );
    }

    get type() {
        return this.getAttribute( 'type' );
    }

    get text() {
        return this.getAttribute( 'text' );
    }

    asyncClick = async () => {
        await new Promise( resolve => setTimeout( resolve, 100 ) );
        console.log( 'asyncClick' );
    };

    // functions
    _click = async ( e ) => {
        console.log( `click button: ${ this.text }` );
        this._spinnerDom.classList.remove( 'hide' );
        this._wcBtnDom.setAttribute( 'disabled', 'disabled' );

        await this.asyncClick();

        console.log( 'finished handler' );
        this._spinnerDom.classList.add( 'hide' );
        this._wcBtnDom.removeAttribute( 'disabled' );
    }

} )
