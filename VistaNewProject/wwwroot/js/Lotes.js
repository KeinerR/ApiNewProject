

// Evento para capturar cuando se comienza a escribir en el campo
function searchLote() {
    var input = $('#buscarLote').val().trim().toLowerCase();    //Obtiene el valor del buscadpor
    var rows = document.querySelectorAll('.lotesPaginado');    //Obtiene el tr de Usuario Paginado.
    var rowsTodos = document.querySelectorAll('.Lotes');      //Obtiene el tr de Usuario que esta en none
    var icon = document.querySelector('#btnNavbarSearch i');    //Obtiene el icino de buscar
    var contador = document.querySelector('.contador');        //Obtiene la columna que tiene el # 
    var contadores = document.querySelectorAll('.contadorB'); //Obtiene el contadorB que esta en none y lo hace visible para mostrar el consecutivo y el ID
    var paginationContainer = document.getElementById('paginationContainer');
    if (input === "") {
        rows.forEach(function (row) { //Esconde los usuarios paginado
            row.style.display = '';
        });
        contadores.forEach(function (contador) {
            contador.classList.add('noIs'); // Removemos la clase 'noIs' para mostrar la columna
        });
        icon.className = 'fas fa-search';
        icon.style.color = 'white';
        contador.innerText = '#';
        paginationContainer.classList.remove('noBe'); // Oculta el contenedor de paginación

    } else {
        rows.forEach(function (row) {
            row.style.display = 'none';
        });
        contadores.forEach(function (contador) {
            contador.classList.remove('noIs'); // Removemos la clase 'noIs'
        });
        icon.className = 'fas fa-times';
        icon.style.color = 'white';
        contador.innerText = 'ID';
        paginationContainer.classList.add('noBe'); // Oculta el contenedor de paginación


    }

    rowsTodos.forEach(function (row) {
        if (input === "") {
            row.style.display = 'none';
        } else {
            var loteId = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            var detalleC = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
            var productoId = row.querySelector('td:nth-child(4)').textContent.trim().toLowerCase();
            var numeroL = row.querySelector('td:nth-child(5').textContent.trim().toLowerCase();
            var precioC = row.querySelector('td:nth-child(6').textContent.trim().toLowerCase();
            var precioPP = row.querySelector('td:nth-child(7').textContent.trim().toLowerCase();
            var fechaV = row.querySelector('td:nth-child(8').textContent.trim().toLowerCase();
            var cantidad = row.querySelector('td:nth-child(9').textContent.trim().toLowerCase();

            row.style.display = (input === "" || loteId.includes(input) || detalleC.includes(input) || productoId.includes(input) || numeroL.includes(input) || precioC.includes(input) || precioPP.includes(input) || fechaV.includes(input) || cantidad.includes(input)) ? 'table-row' : 'none';
        }
    });
}

function vaciarInputLote() {
    var paginationContainer = document.getElementById('paginationContainer');
    document.getElementById('buscarLote').value = "";
    var icon = document.querySelector('#btnNavbarSearch i');
    icon.className = 'fas fa-search';
    icon.style.color = 'white';

    var contador = document.querySelector('.contador');
    contador.innerText = '#';
    var contadores = document.querySelectorAll('.contadorB');
    contadores.forEach(function (contador) {
        contador.classList.add('noIs'); // Removemos la clase 'noIs'
    });

    var rows = document.querySelectorAll('.lotesPaginado');
    rows.forEach(function (row) {
        row.style.display = 'table-row';
    });

    var rowsTodos = document.querySelectorAll('.Lotes');

    rowsTodos.forEach(function (row) {
        row.style.display = 'none';
    });
    paginationContainer.classList.remove('noBe'); // Oculta el contenedor de paginación

}




