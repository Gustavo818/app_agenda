frappe.pages['pagina_bot'].on_page_load = function (wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Página Bot',
		single_column: true
	});
}




frappe.pages['pagina_bot'].on_page_load = function (wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Italfox.com',
		single_column: true
	});
	page.clear_menu();

	page.main.html(frappe.render_template("pagina_bot", {}));

	page.add_inner_button('... más', 		() => newMasOpciones())


	page.set_indicator('Bienvenido', 'orange')

	page.set_title('Bot - Italfox')

	page.set_title_sub('_Italfox.com_')


	callgetsaldo();


}

function newMasOpciones(){
	location.href = "/app/menu_cliente";
}

function callgetsaldo() {
	frappe.call({
		method: "app_agenda.mod_cliente.page.pagina_bot.pagina_bot.get_estado_cuenta",
		freeze: true,
		callback: (r) => {
			console.log(r.message);
			drawhtml(r.message);
		},


	});

}




function drawhtml(datos) {
	$('#span_cliente').html(datos.cliente.cli_nombrecompleto);
	$('#span_correo').html(datos.cliente.cli_correo);
	$('#span_billetera').html(datos.cliente.cli_billetera);
	$('#span_nick').html(datos.cliente.cli_usuario);

	let htmlfull = '';

	let html_detalle = '>>>';


	let html = `   
		 
			<div class="col-sm-12">
				<div class="card">
					<div class="card-header"">   
						<p style="text-align:center">
							<span style="color:#2c3e50"> 
							<strong>
								cuenta: wwwwwww
							</strong>
							</span> 
						</p>
			
			
						
					</div>
					
					<div class="card-body" >
						<p class="card-text">
							BBBB
						</p>
					</div>

					
					<div class="card-footer text-muted">
						<p style="text-align:center">
							<span style="color:#2c3e50">
								  Valor Retirado: $ DDDD 
							</span>
						</p>
					</div>
				</div>
			</div>	 
				
		 
		`;
	htmlfull += `<div row> ` + html + `</div>`;

	$('#div_main_ec').html(htmlfull);

}
