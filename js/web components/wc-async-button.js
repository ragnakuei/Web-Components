window.customElements.define("wc-async-button", class extends HTMLElement {
    // lifecycle hooks
    constructor() {
        super();
    }
    connectedCallback() {
        const text = this.innerText || this.text;

        this.innerHTML = `
<style nonce="123abc">

    .spinner {
      display: inline-block;
      border: 3px solid rgba(0, 0, 0, 0);
      border-top: 3px solid rgba(0, 0, 255, 1);
      border-left: 3px solid rgba(0, 0, 255, 1);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      vertical-align: text-bottom;
    }
    
    .spinner.hide {
        display: none;
        visibility: hidden;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
</style>

<button class="wcBtn hide">
    <span class="spinner hide"></span>
    <span id="btnText"></span>
</button>
    `;
        [this._wcBtnDom, this._btnTextDom, this._spinnerDom] = this.querySelectors([".wcBtn", "#btnText", ".spinner"]);

        this._wcBtnDom.setAttribute("type", this.type);
        
        this["class"]?.split(' ').forEach(c => this._wcBtnDom.classList.add(c));
        this.removeAttribute("class");
        
        this._wcBtnDom.classList.remove("hide");
        this._wcBtnDom.addEventListener("click", this._click);

        this._btnTextDom.innerText = text;

        this.removeAttribute('onclick');
    }

    // fields
    _wcBtnDom = null;
    _btnTextDom = null;
    _spinnerDom = null;

    // property

    get id() {
        return this.getAttribute("id");
    }

    get type() {
        return this.getAttribute("type");
    }

    get text() {
        return this.getAttribute("text");
    }
    
    get "class"() {
        return this.getAttribute("class");
    }

    AsyncClick = async () => {
    };

    // functions
    _click = async (e) => {

        const height = this._btnTextDom.offsetHeight;
        this._spinnerDom.style.width = `${height}px`;
        this._spinnerDom.style.height = `${height}px`;

        console.log(`click button: ${this._btnTextDom.innerText}`);
        this._spinnerDom.classList.remove('hide');
        this._wcBtnDom.setAttribute('disabled', 'disabled');

        await this.AsyncClick();

        console.log('finished handler');
        this._spinnerDom.classList.add('hide');
        this._wcBtnDom.removeAttribute('disabled');
    }
    
    ShowLoading = () => {
        this._spinnerDom.classList.remove('hide');
        this._wcBtnDom.setAttribute('disabled', 'disabled');
    }
    
    HideLoading = () => {
        this._spinnerDom.classList.add('hide');
        this._wcBtnDom.removeAttribute('disabled');
    }

})
