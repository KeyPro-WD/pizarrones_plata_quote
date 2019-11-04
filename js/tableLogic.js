var date = getDate(),
	cliente_name = "",
	cliente_empresa = "",
	productos = [],
	productoTemp = [],
	cantidad = 0,
	producto = "",
	precio = 0,
	importe = 0,
	focus_cantidad = 0,
	focus_producto = "",
	focus_precio = "",
	focus_cliente = "",
	focus_empresa = "",
	plantilla = "<tr><td>-</td><td></td><td></td><td></td><td></td></tr>";

/* ----- Ejecución al momento de cargar la página ----- */
$(document).ready(function() {
	$("#tableList tbody").append(plantilla);
	$("#fecha").text(getDate());
});

/* ----- Control de eventos en los botones ----- */
$("#btnCancel").click(function() {
	if (confirm("¿Está seguro que desea cancelar la inserción de este producto?")) {
		clearDOM();
	}
});

$("#btnAdd").click(function() {
	addProduct();
});

$(document).on("click", "#btnEliminar", function() {
	removeProduct(this);
});

$(document).on("blur", "#producto_cantidad", function() {
	updateCantidad(this);
});

$(document).on("focus", "#producto_cantidad", function() {
	focus_cantidad = parseInt($(this).text());
});

$(document).on("blur", "#producto_descripcion", function() {
	updateProducto(this);
});

$(document).on("focus", "#producto_descripcion", function() {
	focus_producto = $(this).text();
});

$(document).on("blur", "#producto_precio", function() {
	updatePrecio(this);
});

$(document).on("focus", "#producto_precio", function() {
	focus_precio = $(this).text();
});

$(document).on("blur", "#cliente_Nombre", function () {
	updateNameClient(this);
});

$(document).on("focus", "#cliente_Nombre", function () {
	focus_cliente = $(this).text();
});

$(document).on("blur", "#empresa", function () {
	updateNameEmpresa(this);
});

$(document).on("focus", "#empresa", function () {
	focus_empresa = $(this).text();
});

$(document).on("blur", "#fecha", function () {
	updateFecha(this);
});

/* ----- Funciones del sistema ----- */
function addProduct() {
	cantidad = parseInt($("#cantidad").text());
	producto = $("#producto").text();
	precio = parseInt($("#precio").text());

	if (cantidad != null && cantidad != "" && producto != null && producto != "" && precio != null && precio != "") {
		//Si la tabla no tiene productos.
		if ($("#tableList tbody tr:first-child td:first-child").text() == "-") {
			$("#tableList tbody").html("");
		}

		//Añadimos el producto al arreglo de productos.
		importe = cantidad * precio;
		productoTemp.push(cantidad, producto, precio, importe);
		productos.push(productoTemp);

		//Añadimos a la tabla el producto temporal, llenamos los totales y limpiamos el producto temporal tanto de la lógica como de la vista.
		$("#tableList tbody").append(fillTemplate());
		fillTotalValues();
		clearProductoTemp();
		clearDOM();
	} else {
		alert("Por favor llene todos los campos correctamente e intente de nuevo.");
	}
}

function removeProduct(object) {
	if (confirm("¿Está seguro de querer eliminar este producto?")) {
		let idProductos = $(object).parent().parent().index();
		let idProducto = $(object).data("id_eliminar");

		if (productos.length > 1) {
			productos.splice(idProductos, 1);
		} else {
			productos.length = 0;
		}

		$("#__" + idProducto).remove();

		if ($("#tableList tbody tr").length == 0) {
			$("#tableList tbody").append(plantilla);
		}

		fillTotalValues();
	}

	$("#cantidad").focus();
}

function updateCantidad(object) {	
	if (confirm("¿Está seguro de actualizar la cantidad?")) {
		let producto_cantidad = $(object).text();
		let idProductos = $(object).parent().index();
		let producto_precio = $('#tableList tbody tr:eq(' + idProductos + ') td:eq(2)').text();
		producto_precio = parseInt(producto_precio.substring(1));

		if (producto_cantidad != "" && producto_cantidad != null) {
			cantidad = parseInt(producto_cantidad);
			precio = producto_precio;
			importe = cantidad * precio;

			productos[idProductos][0] = cantidad;
			productos[idProductos][3] = importe;
			$('#tableList tbody tr:eq(' + idProductos + ') td:eq(3)').text("$" + importe);

			fillTotalValues();
			clearProductoTemp();
		} else {
			alert("La cantidad no puede estar vacía");
			$(object).text(focus_cantidad);
		}
	} else {
		$(object).text(focus_cantidad);
	}
}

function updateProducto(object) {
	if (confirm("¿Está seguro de actualizar el producto?")) {
		let producto_descripcion = $(object).text();
		let idProductos = $(object).parent().index();

		if (producto_descripcion != "" && producto_descripcion != null) {
			productos[idProductos][1] = producto_descripcion;
		} else {
			alert("Debe seleccionar una descripción de producto.");
			$(object).text(focus_producto);
		}
	} else {
		$(object).text(focus_producto);
	}
}

function updatePrecio(object) {
	if (confirm("¿Está seguro de actualizar el precio unitario?")) {
		let producto_precio = $(object).text();
		let idProductos = $(object).parent().index();
		let producto_cantidad = $('#tableList tbody tr:eq(' + idProductos + ') td:eq(0)').text();

		if (producto_precio != "" && producto_precio != null) {
			cantidad = parseInt(producto_cantidad);

			if (producto_precio.substring(0,1) == '$') {
				precio = parseInt(producto_precio.substring(1));
			} else {
				precio = parseInt(producto_precio);
			}
			
			importe = cantidad * precio;

			productos[idProductos][0] = cantidad;
			productos[idProductos][3] = importe;
			$('#tableList tbody tr:eq(' + idProductos + ') td:eq(3)').text("$" + importe);
			
			$(object).text("$" + precio);

			fillTotalValues();
			clearProductoTemp();
		} else {
			alert("El precio unitario no puede estar vacío");
			$(object).text(focus_precio);
		}
	} else {
		$(object).text(focus_precio);
	}
}

function updateNameClient(object) {
	if (confirm("¿Está seguro de actualizar el nombre del cliente?")) {
		cliente_name = $(object).text();
	} else {
		$(object).text(focus_cliente);
	}
}

function updateNameEmpresa(object) {
	if (confirm("¿Está seguro de actualizar el nombre de la empresa?")) {
		cliente_empresa = $(object).text();
	} else {
		$(object).text(focus_empresa);
	}
}

function updateFecha(object) {
	if (confirm("¿Quieres actualizar la fecha?")) {
		if ($(object).text() != "" && $(object).text() != null) {
			date = $(object).text();
		} else {
			$(object).text(getDate());
		}
	} else {
		$(object).text(getDate());
	}
}

function fillTemplate() {
	let id = productos.length - 1;

	let plantillaProducto =
		`<tr id="__` + id + `" data-producto_id="__` + id + `">
            <td id="producto_cantidad" contenteditable>` + cantidad + `</td>
            <td id="producto_descripcion" contenteditable>` + producto + `</td>
            <td id="producto_precio" contenteditable>$` + precio + `</td>
            <td id="producto_importe">$` + importe + `</td>
            <td id="producto_tools">
                <button id='btnEliminar' data-id_eliminar="` + id + `" title='Eliminar' class="btnTools">
                    <img src='img/Eliminar.png'>
                    </button>
            </td>
        </tr>
    `;

	return plantillaProducto;
}

function clearProductoTemp() {
	productoTemp = [];
	cantidad = 0;
	producto = "";
	precio = 0;
	importe = 0;
}

function clearDOM() {
	$("#cantidad").text("");
	$("#producto").text("");
	$("#precio").text("");
	$("#cantidad").focus();
}

function subtotal() {
	let suma = 0;

	for (var i = 0; i < productos.length; i++) {
		suma += productos[i][3];
	}

	return suma;
}

function iva() {
	return (subtotal() * 16) / 100;
}

function totalAPagar() {
	return subtotal() + iva();
}

function fillTotalValues() {
	$("#subtotal").text("$" + subtotal());
	$("#iva").text("$" + iva());
	$("#total").text("$" + totalAPagar());
}

function getDate() {
	let d = new Date();
	let month = d.getMonth() + 1;
	let day = d.getDate();
	return (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + d.getFullYear();
}

/* ----- Controlar la salida del usuario ----- */
$("body").keydown(function() {
	if (productos.length > 0) {
		var tecla = window.event.keyCode;

		if (tecla == 116) {
			confirm("Si recarga la página perderá todos los datos ingresados.", function(result) {
				if (result) {
					location.reload();
				} else {
					event.keyCode = 0;
					event.returnValue = false;
				}
			});
		}
	}
});

/* ----- Generar archivo PDF ----- */
$("#btnGenerarPDF").click(function() {
	genPDF();
});

function genPDF() {
	var doc = new jsPDF();
	doc.text(20, 20, 'Test message!!!');
	doc.addPage();
	doc.text(20, 20, 'Test message 2!!!');
	doc.save('Test.pdf');
}