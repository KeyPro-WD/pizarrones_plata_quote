<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Pizarrones Plata - Cotización</title>
    <link rel="shortcut icon" type="image/x-icon" href="img/Icono.ico">
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/FontAwesome 5.8/css/all.min.css">
</head>
<body>
    <div class="modal-direccion" id="modal-direccion">
        <div class="modal-backdrop">
            <div class="modal-head">
                <h2 class="modal-title">Añadiendo una dirección</h2>
            </div>

            <div class="modal-body">
                <textarea id="direccion-campo" placeholder="Escribe la dirección aquí..."></textarea>
            </div>

            <div class="modal-footer">
                <button class="button-cancelar" id="btnCancelDireccion">Cancelar</button>
                <button class="button-save" id="btnSaveDirection">Añadir</button>
            </div>
        </div>
    </div>

    <header>
        <img src="img/Logo.png" alt="Logo Pizarrones Plata">
    </header>

    <main>
        <aside>
            <nav>
                <ul>
                    <li>
                        <a href="index.php" id="btnHome"><i class="fas fa-home"></i></a>
                    </li>
                </ul>
            </nav>
        </aside>

        <article>
            <section>
                <h1 id="titulo">Cotización</h1>

                <button id="btnGenerarPDF">GenerarPDF</button>
                <button id="btnAddDireccion">Agregar dirección</button>

                <div class="container_fecha">
                    <!-- <p>Ecatepec de Morelos, México a <strong id="fecha" contenteditable></strong></p> -->
                    <p>México, <strong id="fecha" contenteditable></strong></p>
                </div>

                <div class="container_para">
                    <p>Atte: <span id="cliente_Nombre" contenteditable>-----</span></p>

                    <p>Empresa: <span id="empresa" contenteditable>-----</span></p>

                    <p>Por medio de la presente envío la cotización solicitada.</p>
                </div>

                <div class="container_tabla">
                    <table id="tableList">
                        <caption>Lista de servicios o productos</caption>

                        <thead>
                            <tr>
                                <th>CANTIDAD</th>
                                <th>DESCRIPCIÓN</th>
                                <th>PRECIO UNITARIO</th>
                                <th>IMPORTE</th>
                                <th>TOOLS</th>
                            </tr>
                        </thead>

                        <tbody></tbody>

                        <tfoot>
                            <tr>
                                <td contenteditable="true" id="cantidad"></td>
                                <td contenteditable="true" id="producto"></td>
                                <td contenteditable="true" id="precio"></td>
                                <td colspan="2">
                                    <button id='btnCancel' class='btnTools btnCancel'>
                                        <img src='img/Cancelar.png'> Cancelar
                                    </button>
                            
                                    <button id="btnAdd" class="btnTools">
                                        Añadir <img src='img/Listo.png'>
                                    </button>
                                </td>
                            </tr>

                            <tr>
                                <td colspan="5" id="result"></td>
                            </tr>

                            <tr>
                                <th colspan="2"></th>
                                <th>Subtotal</th>
                                <td id="subtotal" class="finales">$0.00</td>
                            </tr>
                        
                            <tr>
                                <th colspan="2"></th>
                                <th>I.V.A 16%</th>
                                <td id="iva" class="finales">$0.00</td>
                            </tr>
                        
                            <tr>
                                <th colspan="2"></th>
                                <th>TOTAL</th>
                                <td id="total" class="finales">$0.00</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div class="container_final">
                    <p><strong>VIGENCIA DE LA COTIZACION</strong>: Treinta (30) días habiles.</p>

                    <p><strong>-- Para todo tipo de trabajo solicitamos el 50% de anticipo. --</strong></p>

                    <p>Agradeciendo de antemano su atención, quedo a sus órdenes para cualquier duda o comentario.</p>

                    <p class="firma">Atentamente</p>

                    <p class="firma" id="usuario_Nombre">Alejandra Lascari Mora</p>

                    <!-- <p class="direccion">Calle: Gustavo Baz Mz. 54 Lt.25 Col. Villas de Guadalupe Xalostoc Ecatepec de Morelos, Cp. 55339</p> -->

                    <img src="img/Firma.png" alt="Firma electrónica">
                </div>
            </section>
        </article>
        <img src="img/LogoCuadro.png" id="logo">
        <img src="img/Firma.png" id="firma">
    </main>
    
    <script src="js/jquery-3.4.1.min.js"></script>
    <script src="js/jspdf.min.js"></script>
    <script src="js/jspdf.plugin.autotable.min.js"></script>
    <script src="js/tableLogic.js"></script>
    <script>
        var catalogo = [];

        $.ajax({
            url: 'database/catalogo.csv',
            dataType: 'text',
        }).done(successFunction);
        
        function successFunction(data) {
            let allRows = data.split(/\r?\n|\r/);
            
            for (let singleRow = 1; singleRow < allRows.length; singleRow++) {
                let rowCells = allRows[singleRow].split(',');
                let producto = [];

                for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
                    producto.push(rowCells[rowCell]);
                }

                catalogo.push(producto);
            }
        }

        $("#producto").keyup(function () {
            let search = $("#producto").text();

            if (search != "" && search != null) {
                $("#result").html("");
                let salida = "<ul>";

                for (let i = 0; i < catalogo.length; i++){
                    if (catalogo[i][1].includes(search)) {
                        salida += "<li class='productoOP' data-precio='" + catalogo[i][3] + "' id='" + catalogo[i][0] + "'>" + catalogo[i][1] + " " + catalogo[i][2] + "</li>";
                    }
                }
                
                $("#result").html(salida + "</ul>");
            } else {
                $("#result").html("");
            }
        });

        $(document).on("click", ".productoOP", function() {
            $("#producto").text($(this).text());
            $("#precio").text($(this).attr('data-precio'));
        });
    </script>
</body>
</html>