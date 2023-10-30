window.customElements.define( 'wc-modal', class extends HTMLElement {
    // lifecycle hooks
    constructor() {
        super();
        this.shadowRoot = this.attachShadow( { mode: "open" } )
    }

    connectedCallback() {
        
        this.shadowRoot.innerHTML = `
<style nonce="123abc">

    dialog::backdrop {
        background-color: rgba(0, 0, 0, 0.3);
    }
    
    dialog {
        border: none;
        border-radius: 7px;
        max-height: calc(100vh - 30px);
        overflow: hidden;
        padding: 0;
        
        box-shadow: rgba(0, 0, 0, 0.6) 5px 5px 15px 0;
    }
    
    dialog:[open] {
    
    }
    
    .dialog-inner {
        border-radius: 8px;
        padding: 10px;
        
        /* -20px <= padding -10px * 2 */
        max-height: calc(100vh - 50px);
        overflow: auto;
    }
    
    .fadein {
        animation: fadein 0.5s;
    }
    @keyframes fadein {
        from { 
            top: -100px;
        }
        to { 
            top: 0; 
        }
    }

</style>

<dialog>
    <div class="dialog-inner">
        <slot></slot>
    </div>
</dialog>
    `;
        this._dialogDom = this.shadowRoot.querySelector( 'dialog' );
    }

    // fields
    _dialogDom = null;

    // property
    shadowRoot = null;

    get id() {
        return this.getAttribute( 'id' );
    }

    // functions
    Show = () => {
        // console.log( 'show', this.id );
        // console.log( 'vertial', this.vertical );

        this._dialogDom.showModal();
        this._dialogDom.classList.add( 'fadein' );

        const slot = this.shadowRoot.querySelector( 'slot' );
        const slotNodes = slot.assignedNodes().filter( node => node.nodeType === Node.ELEMENT_NODE );
    }
    Hide = () => {
        this._dialogDom.classList.remove( 'fadein' );
        
        this._dialogDom.close();
    }

} )
