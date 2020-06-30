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
	$("#result").html("");
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
			if (confirm("Si recarga la página perderá todos los datos ingresados.")) {
				location.reload();
			} else {
				event.keyCode = 0;
				event.returnValue = false;
			}
		}
	}
});

/* ----- Generar archivo PDF ----- */
$("#btnGenerarPDF").click(function() {
	const pdf = new jsPDF({
		unit: 'cm',
		format: 'letter'
	});
	
	let img = get64(document.getElementById("logo"));
	pdf.addImage(img, 'PNG', 1.27, 1.27, 2.7, 2.6);

	// Añadiendo fecha
	pdf.setFont('helvetica', 'normal');
	pdf.setFontSize(10);
	pdf.setTextColor('#404040');
	// pdf.text(alignRight(pdf, "Ecatepec de Morelos, México a " + date)-1.27, 2.62, 'Ecatepec de Morelos, México a ' + date);
	pdf.text(alignRight(pdf, "México, " + date)-1.27, 2.62, 'México, ' + date);

	//Añadiendo título
	pdf.setFont('helvetica', 'normal');
	pdf.setFontSize(15);
	pdf.setTextColor('#000000');
	pdf.text(alignCenter(pdf, 'Cotización'), 3.87, 'Cotización');

	//Añadiendo subtítulo
	pdf.setFont('helvetica', 'normal');
	pdf.setFontSize(13);
	pdf.setTextColor('#542700');
	pdf.text(alignCenter(pdf, cliente_empresa), 4.92, cliente_empresa);

	//Añadiendo entrada
	pdf.setFont('helvetica', 'bold');
	pdf.setFontSize(12);
	pdf.setTextColor('#000000');
	pdf.text(1.27, 7.06, 'ATENCIÓN ' + cliente_name + ',');

	pdf.setFont('helvetica', 'light');
	pdf.setFontSize(12);
	pdf.setTextColor('#3B3838');
	pdf.text(1.27, 7.9, '            Por medio de la presente me permito mandarle un cordial saludo y a la vez poner a su consideración la');
	pdf.text(1.27, 8.55, 'siguiente propuesta de cotización:');

	//Añadiendo la tabla generada
	let columns = ["CANTIDAD", "CONCEPTO", "PRECIO UNITARIO", "IMPORTE"];
	let data = [];

	for (let i = 0; i < productos.length; i++) {
		data.push(productos[i]);
	}

	pdf.autoTable(columns, data, {
		startY: 9.2,
		styles: { 
			font: 'helvetica',
			fontStyle: 'bold',	
			fillColor: [255, 255, 255],
			halign: 'center',
    		valign: 'middle',
    		fontSize: 12,
			lineColor: [255, 134, 0],
			lineWidth: 0.01,
			cellPadding: 0.17
		},
		headStyles: {
			fillColor: [255, 134, 0],
			textColor: [255, 255, 255]
		},
		columnStyles: {
			0: {cellWidth: 3},
			1: {cellWidth: 9.7},
			2: {cellWidth: 3},
			3: {cellWidth: 3}
		},
		alternateRowStyles: {
			fillColor: [255, 227, 148],
			textColor: [59, 56, 56]
		},
		footStyles: {
			fillColor: [255, 255, 255],
			textColor: [59, 56, 56]
		},
		foot: [
			[
				{ content: "", colSpan: 2, rowSpan: 3 },
				{ content: "Subtotal", styles: { halign: "right" } },
				{ content: "$" + subtotal(), styles: { halign: "left" } }
			],
			[
				{ content: "I.V.A 16%", styles: { halign: "right" } },
				{ content: "$" + iva(), styles: { halign: "left" } }
			],
			[
				{ content: "TOTAL", styles: { halign: "right" } },
				{ content: "$" + totalAPagar(), styles: { halign: "left" } }
			]
		]
	});

	//Añadiendo acotaciones de la cotización
	pdf.setFont('helvetica', 'bold');
	pdf.setFontSize(12);
	pdf.setTextColor('#814200');
	pdf.text("ACOTACIONES", 1.27, pdf.autoTable.previous.finalY + 1);

	pdf.setFont('helvetica', 'normal');
	pdf.setFontSize(12);
	pdf.setTextColor('#2b2b2b');
	pdf.text("VIGENCIA DE LA COTIZACION: Treinta (30) días habiles.", 1.7, pdf.autoTable.previous.finalY + 1.7);

	pdf.setFont('helvetica', 'bold');
	pdf.setFontSize(12);
	pdf.setTextColor('#2b2b2b');
	pdf.text("-- Para todo tipo de trabajo solicitamos el 50% de anticipo. --", 1.7, pdf.autoTable.previous.finalY + 2.3);

	//Añadiendo despedida
	pdf.setFont('helvetica', 'normal');
	pdf.setFontSize(12);
	pdf.setTextColor('#2b2b2b');
	pdf.text("Agradeciendo de antemano su atención, quedo a sus órdenes para cualquier duda o comentario.", 1.27, pdf.autoTable.previous.finalY + 3);
	pdf.text("Atentamente", alignCenter(pdf, "Atentamente"), pdf.autoTable.previous.finalY + 4.5);
	pdf.text("Alejandra Lascari Mora", alignCenter(pdf, "Alejandra Lascari Mora"), pdf.autoTable.previous.finalY + 5.1);
	// pdf.text("Calle: Gustavo Baz Mz. 54 Lt.25 Col. Villas de Guadalupe Xalostoc Ecatepec de Morelos, Cp. 55339", alignCenter(pdf, "Calle: Gustavo Baz Mz. 54 Lt.25 Col. Villas de Guadalupe Xalostoc Ecatepec de Morelos, Cp. 55339"), pdf.autoTable.previous.finalY + 6.5);

	//Añadiendo firma electrónica
	let img1 = get64(document.getElementById("firma"));
	pdf.addImage(img1, 'PNG', (pdf.internal.pageSize.width - 13.94), pdf.autoTable.previous.finalY + 7.5, 12.67, 3.5);

	let f = new Date();
	let fecha = f.getDate() + "" + (f.getMonth() + 1) + "" + f.getFullYear();

	if (cliente_empresa != "" && cliente_empresa != null) {
		pdf.save('Cotización_' + cliente_empresa + "_" + fecha + '.pdf');
	} else {
		pdf.save('Cotización_' + fecha + '.pdf');
	}
});

function alignCenter(pdf, text) {
	let textWidth = pdf.getStringUnitWidth(text) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
	let positionX = (pdf.internal.pageSize.width - textWidth) / 2;
	return positionX;
}

function alignRight(pdf, text) {
	let textWidth = pdf.getStringUnitWidth(text) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
	let positionX = (pdf.internal.pageSize.width - textWidth);
	return positionX;
}

function get64(img) {
	let canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	let ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);
	let dataURL = canvas.toDataURL();
	return dataURL;
}