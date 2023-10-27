const [
    modal1,
    modal2,
    btnOpenModal1,
    btnCloseModal1,
    btnOpenModal2,
    btnCloseModal2,
] = getDomsByIds( [
                      'modal1',
                      'modal2',
                      'btnOpenModal1',
                      'btnCloseModal1',
                      'btnOpenModal2',
                      'btnCloseModal2',
                  ] );

btnOpenModal1.addEventListener( 'click', () => modal1.Show() );
btnCloseModal1.addEventListener( 'click', () => modal1.Hide() );
btnOpenModal2.addEventListener( 'click', () => modal2.Show() );
btnCloseModal2.addEventListener( 'click', () => modal2.Hide() );
