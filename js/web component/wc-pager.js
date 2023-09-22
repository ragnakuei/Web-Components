customElements.define("wc-pager", class extends HTMLElement {

    // lifecycle hooks

    constructor() {
        super();

        this.PageSize = this.getAttribute("page-size") || 10;
        this.PageOffSet = this.getAttribute("page-offset") || 3;
        this.PageNo = 1;
    }

    connectedCallback() { }

    static get observedAttributes() {
        return ["page-size"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'page-size') {
            this.PageSize = parseInt(newValue) || 0;
        }
    }

    // fields
    PageSize = null;
    PageOffSet = null;
    PageNo = null;
    _data = null;
    
    // properties
    get ['PageCount']() {
        return Math.ceil(this.ItemCount / this.PageSize);
    };

    get ['ItemCount']() {
        return this.Data?.length ?? 0;
    }

    get ['Data']() {
        return this._data;
    }
    set ['Data'](value) {
        this._data = value;
        this.ToPage(1);
    }

    // functions

    Render = () => {
        if (this.PageCount === 0) return;

        this.innerHTML = `
<nav aria-label="Page navigation example">
    <ul class="pagination">
    </ul>
</nav>
                `;

        const ul = this.querySelector("ul");

        if (this.PageNo > 1) {
            const firstPageSpan = this.CreatePageItem('<<', 1, false);
            ul.appendChild(firstPageSpan);

            const prevPageSpan = this.CreatePageItem('<', Math.max(1, this.PageNo - 1), false);
            ul.appendChild(prevPageSpan);
        }

        const firstPageNo = Math.max(1, this.PageNo - this.PageOffSet);
        const lastPageNo = Math.min(this.PageNo + this.PageOffSet, this.PageCount);
        for (let i = firstPageNo; i <= lastPageNo; i++) {
            const pageSpan = this.CreatePageItem(i, i);
            ul.appendChild(pageSpan);
        }

        if (this.PageNo < this.PageCount) {
            const nextPageSpan = this.CreatePageItem('>', Math.min(this.PageCount, this.PageNo + 1), false);
            ul.appendChild(nextPageSpan);

            const lastPageSpan = this.CreatePageItem('>>', this.PageCount, false);
            ul.appendChild(lastPageSpan);
        }
    }

    CreatePageItem = (text, pageNo, isShowActive = true) => {
        const pageItem = document.createElement("li");
        pageItem.className = "page-item";

        if (this.PageNo === pageNo && isShowActive) {
            pageItem.className += " active";
        }

        const pageLink = document.createElement("a");
        pageLink.className = "page-link";
        pageLink.href = "#";
        pageLink.innerText = text;
        pageLink.onclick = () => {
            this.ToPage(pageNo);
        }

        pageItem.appendChild(pageLink);
        return pageItem;
    }

    ToPage = (pageNo) => {
        this.PageNo = pageNo;
        this.Render();

        const pageData = this.GetPageDtos();
        this.dispatchEvent(new CustomEvent('onPageNoChange', {
            detail: {
                pageNo: pageNo,
                pageData: pageData,
            }
        }));
    }

    GetPageDtos = () => {
        const startIndex = (this.PageNo - 1) * this.PageSize;
        const endIndex = startIndex + this.PageSize;
        return this.Data?.slice(startIndex, endIndex);
    }
});