const books = Array.from(Array(123).keys()).map(i => {
    return {
        Id: i + 1,
        Title: `Title ${i + 1}`,
        Author: `Author ${i + 1}`,
        Price: (i + 1) * 1000
    };
});

function toPage(detail) {
    const {pageNo, pageData} = detail;

    if ((pageData?.length >= 0) === false) {
        console.log('No data');
        return;
    }

    const tbody = document.getElementById("tbody");
    tbody.innerHTML = "";
    pageData.forEach(book => {
        const tr = document.createElement("tr");

        const idTd = document.createElement("td");
        idTd.innerText = book.Id;
        tr.appendChild(idTd);

        const titleTd = document.createElement("td");
        titleTd.innerText = book.Title;
        tr.appendChild(titleTd);

        const authorTd = document.createElement("td");
        authorTd.innerText = book.Author;
        tr.appendChild(authorTd);

        const priceTd = document.createElement("td");
        priceTd.innerText = book.Price;
        tr.appendChild(priceTd);

        tbody.appendChild(tr);
    });
}

const pager = document.getElementById("pager");
pager.addEventListener('onChangePageNo', e => toPage(e.detail));
pager.Data = books;

const s_pager = document.getElementById("s-pager");
s_pager.addEventListener('onPageNoChange', e => toPage(e.detail));
s_pager.Data = books;