window.customElements.define('wc-modal', class extends HTMLElement {
    // lifecycle hooks
    constructor() {
        super();
        this.shadowRoot = this.attachShadow({mode: "open"})
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
<style>
    .modal {
        /* modal 外框忽略滑鼠事件 */
        pointer-events: none;
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 1000;
        
        /* inner */
        /* center */
        display: flex;
        justify-content: center;
        align-items: center;
        
        overflow: hidden auto;
    }
        .modal.hidden {
            display: none;
            visibility:hidden;
        }
    
    .modal-dialog {
        position: relative;
        pointer-events: none;
        
        max-width: 100vw;
        max-height: 100vh;
    }
    
        /*.modal-dialog.sm {*/
        /*    width: 300px;*/
        /*}*/
        /*.modal-dialog.md {*/
        /*    width: 800px;*/
        /*}*/
        /*.modal-dialog.lg {*/
        /*    width: 1140px;*/
        /*}*/
        /*.modal-dialog.xl {*/
        /*    width: 1400px;*/
        /*}*/
        .modal-dialog.vertical-centered {
            position: absolute;
            top: 50%; 
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .modal-dialog.fadein {
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

        .modal-dialog.verticial-centered-fadein {
            animation: verticial-centered-fadein 0.5s;
        }
        @keyframes verticial-centered-fadein {
            from { 
                top: calc(50% - 100px);
            }
            to { 
                top: 50%;
            }
        }

    .dialog-inner {
        /* dialog 上方空間 */
        margin-top: 20px;
        /* dialog 下方空間 */
        padding-bottom: 20px;
    }

    .modal-content {
        background-color: white;
        border-radius: 8px;
        padding: 1rem; 
        
        /* 必要，讓滑鼠可以點到 slot 內的內容 */
        pointer-events: auto;
    }
</style>

 <div class="modal hidden" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="dialog-inner">
                <div class="modal-content">
                    <slot></slot>
                </div>
            </div>
        </div>
</div>
    `;
        // 此 web component 預設不顯示 display: none;，在初始化前就不會有閃爍的問題 
        // 在 connectedCallback 時，就可以顯示了
        this.classList.remove('hidden');
        
        this.modalInstance = this.shadowRoot.querySelector('.modal');
        this.modalDialogInstance = this.shadowRoot.querySelector('.modal-dialog');

        if (this.size) {
            this.addCssClass(this.modalDialogInstance, this.size);
        }

        if (this.vertical) {
            this.addCssClass(this.modalDialogInstance, 'vertical-centered');
        }

    }

    // fields
    _tabbableElements = [];

    // property
    shadowRoot = null;
    modalInstance = null;
    modalDialogInstance = null;

    get id() {
        return this.getAttribute('id');
    }

    get size() {
        // available values: sm, md, lg, xl, (未指定) 全寬
        return this.getAttribute('size');
    }

    get vertical() {
        // 如果未給定 attribute 則回傳 null，反之回傳 ""
        return this.getAttribute('vertical') != null;
    }

    // functions
    show = () => {
        console.log('show', this.id);
        console.log('vertial', this.vertical);

        this.modalInstance.classList.remove('hidden');

        if (this.vertical) {
            this.addCssClass(this.modalDialogInstance, 'verticial-centered-fadein');
        } else {
            this.addCssClass(this.modalDialogInstance, 'fadein');
        }

        const slot = this.shadowRoot.querySelector('slot');
        const slotNodes = slot.assignedNodes().filter(node => node.nodeType === Node.ELEMENT_NODE);
        this._tabbableElements = this.findTabbableElements(slotNodes[0]);

        // focus 第一個 tabbable element
        this._tabbableElements[0]?.focus();

        // 監聽 tab 鍵，只能在 tabbable elements 中循環
        this.modalInstance.addEventListener('keydown', this.enableTabOnlyInTabbableElements);
    }
    hide = () => {
        this.modalInstance.classList.add('hidden');

        this.removeCssClass(this.modalDialogInstance, 'verticial-centered-fadein');
        this.removeCssClass(this.modalDialogInstance, 'fadein');

        // 移除監聽 tab 鍵
        this.modalInstance.removeEventListener('keydown', this.enableTabOnlyInTabbableElements);
    }

    addCssClass = (instance, className) => {
        if (instance.classList.contains(className) === false) {
            instance.classList.add(className);
        }
    }
    removeCssClass = (instance, className) => {
        if (instance.classList.contains(className)) {
            instance.classList.remove(className);
        }
    }

    findTabbableElements = (targetElement) => {


        function findChildrenTabbableElements(element) {

            const children = element.children;
            if (children?.length >= 0 === false) {
                return [];
            }

            const tabbableControls = [];

            for (let child of children) {

                const tabIndex = child.getAttribute('tabindex');
                if (tabIndex !== null || child.tabIndex >= 0) {
                    // console.log('with tabIndex Control', child);
                    tabbableControls.push(child);
                }

                const childTabbableControls = findChildrenTabbableElements(child);
                tabbableControls.push(...childTabbableControls);
            }

            return tabbableControls;
        }

        const result = findChildrenTabbableElements(targetElement);

        return result;
    }

    enableTabOnlyInTabbableElements = (event) => {
        const keyCode = event.keyCode;
        const tabbableElements = this._tabbableElements;
        const firstTabbableElement = tabbableElements[0];

        if (keyCode === 9) {
            if (event.shiftKey) {
                // shift + tab
                if (document.activeElement === firstTabbableElement) {
                    // 第一個 tabbable element
                    event.preventDefault();
                    tabbableElements[tabbableElements.length - 1]?.focus();
                } else {
                    // 不是第一個 tabbable element
                    const index = tabbableElements.indexOf(document.activeElement);
                    tabbableElements[index - 1]?.focus();
                }
            } else {
                // tab
                if (document.activeElement === tabbableElements[tabbableElements.length - 1]) {
                    // 最後一個 tabbable element
                    event.preventDefault();
                    firstTabbableElement?.focus();
                } else {
                    // 不是最後一個 tabbable element
                    const index = tabbableElements.indexOf(document.activeElement);
                    tabbableElements[index + 1]?.focus();
                }
            }

            event.preventDefault();
        }

    }

})
