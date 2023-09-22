const modal1 = document.getElementById('modal1');
const modal2 = document.getElementById('modal2');

const openModal1 = () => {
    modal1.show();
}
const closeModal1 = () => {
    modal1.hide();
}
const openModal2 = () => {
    modal2.show();
}
const closeModal2 = () => {
    modal2.hide();
}

const btnOpenModal1 = document.getElementById('btnOpenModal1');
btnOpenModal1.addEventListener('click', openModal1);

const btnCloseModal1 = document.getElementById('btnCloseModal1');
btnCloseModal1.addEventListener('click', closeModal1);

const btnOpenModal2 = document.getElementById('btnOpenModal2');
btnOpenModal2.addEventListener('click', openModal2);

const btnCloseModal2 = document.getElementById('btnCloseModal2');
btnCloseModal2.addEventListener('click', closeModal2);
