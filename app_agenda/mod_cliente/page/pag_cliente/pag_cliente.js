let lstPlanes;
let lstReferidos;
let lstComisionesReferidos;



frappe.pages['pag_cliente'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Italfox.com',
		single_column: true		
	});
	// page.clear_menu();
	// page.add_action_item('Retirar Rendimiento', () => newRetirarRendimiento())
	// page.add_action_item('Retirar Capital', () => newRetirarCapital())


	page.main.html(frappe.render_template("pag_cliente", {}));

	page.add_inner_button('Adquirir Plan', 	() => newAquirirPlan())
	// add a dropdown button in a group
	page.add_inner_button('Pago Rendimiento', 	() => newRetirarRendimiento(), 	'Retirar')
	page.add_inner_button('Capital', 		() => newRetirarCapital(), 		'Retirar')
	
	 

	// add a dropdown button in a group
	page.add_inner_button('Más Servicios', 		() => newPageTrading())
	
	// page.add_inner_button('Referidos', 		() => newReferidos())
	page.add_inner_button('Tus Referidos', 	() => newReferidos(), 	'Referidos')
	page.add_inner_button('Tus Referidos - Comisiones ', 		() => fun_ComisionesReferidos(),'Referidos')

	page.add_inner_button('... más', 		() => newMasOpciones())

	page.add_inner_button('imprimir', 		() => newImprimir())

	page.set_indicator('Bienvenido', 'orange')
 
	// page.add_inner_button('Opcion 1', () => update_posts())
	// // page.add_action_item('Delete', () => delete_items())
	// page.change_inner_button_type('Opcion 1', null, 'primary');
 
	// let $btn = page.set_primary_action('Nuevo', () => create_new(), 'octicon octicon-plus')

	//page.clear_actions_menu()
	// page.set_title('Cliente [Nombre Cliente] ')
	page.set_title('Cliente')

	page.set_title_sub('_Italfox.com_')
	// page.set_indicator('Bienvenido', 'red')
	
	getReferidos();
	getComisionesReferidos();
	callgetsaldo();
	// getnoticias();
	verificaDatosLlenos();
	getplanesaprobados();

	
	
}

 
function newPageTrading(){ 
	// print();
	location.href = "/app/pag_trading"; // dynamic link
}


function newAquirirPlan(){
	// print();
	location.href = "/app/pagina_planes"; // dynamic link
}


function newReferidos(){
	location.href = "javascript:lista_referidos()";
}
function fun_ComisionesReferidos(){
	location.href = "javascript:show_comisiones_referidos()";
}

function newMasOpciones(){
	location.href = "/app/menu_cliente";
}


function newImprimir(){
	print();
}

function newRetirarRendimiento(){
	location.href ="javascript:retirar_rendimiento()";
}

function newRetirarCapital(){
	location.href = "javascript:retirar_capital()"
}

function drawhtml(datos){
	$('#span_cliente').html(datos.cliente.cli_nombrecompleto);
	$('#span_correo').html(datos.cliente.cli_correo);
	$('#span_billetera').html(datos.cliente.cli_billetera);
	$('#span_nick').html(datos.cliente.cli_usuario);
	 
	let htmlfull='';
	datos.planes.forEach((row) => {
		let html_detalle = '';
		row.detalles.forEach((rowi) => {
			html_detalle+=rowi.estc_detalle_html;
		});

		let html = `   
		 
			<div class="col-sm-12">
				<div class="card">
					<div class="card-header"">   
						<p style="text-align:center"><span style="color:#2c3e50"><span style="font-size:26px">
							<strong>
								Plan:  ${row.plan_nombre}
							</strong></span></span>
						</p>
			
						<p style="text-align:center"><span style="color:#2c3e50"><span style="font-size:26px"><strong>Capital: $ ${row.estc_capital}</strong></span></span></p>
			
						
					</div>
					
					<div class="card-body" >
						<p class="card-text">
							${html_detalle}
						</p>
					</div>

					
					<div class="card-footer text-muted">
						<p style="text-align:center">
							<span style="color:#2c3e50">
								<span style="font-size:26px">
									<strong>
										Interes Ganado: $ ${row.interes_ganado}
									</strong>

									<ul class="list-group">
									<li class="list-group-item d-flex justify-content-between align-items-center">
									  Valor Retirado: $ ${row.valor_retirado} 
									  <span class="badge badge-primary badge-pill">PROCESADO</span>
									</li>
									<li class="list-group-item d-flex justify-content-between align-items-center">
									  Valor Disponible: $ ${row.valor_disponible} 
									  <span class="badge badge-primary badge-pill">DISPONIBLE</span>
									</li>
								  </ul>
								</span>
							</span>
						</p>
					</div>


				 
	

				</div>
			</div>	 
				
		 
		`;
		htmlfull+= `<div row> `+  html + `</div>`;
	});

	

$('#div_main_ec').html(htmlfull);

}




 
 
function callgetsaldo(){
	frappe.call({  
		method: "app_agenda.mod_cliente.page.pag_cliente.pag_cliente.get_estado_cuenta",
		freeze: true,
		callback: (r) => {			
		 
			console.log(r.message);
	 
			drawhtml(r.message);
			 
		

			let hmtl_error = `<div class="alert alert-danger" role="alert">
			<p><span style="color:#c0392b"><span style="font-size:20px">No ha adquirido ningun plan todavia</p>
		  	</div>`;

			let billetera='';

			let datos_cliente = r.message.datos_cliente;
			datos_cliente.forEach((row) => { 
				billetera= row.cli_billetera; 
			})

			let planes_aprobados = r.message.planes_aprobados;
			  
			
		
			let planes = r.message.planes;
			  
			
			  	 
			

			if(planes_aprobados.length  == 0){
				$('#div_main_error_noplanes').html(hmtl_error);
			}
			else{
				let htmlcompleto = '';
				
				  

				planes_aprobados.forEach((row) => { 
					let html_det='';
					let fn= formatMoney(row.cliplan_capital);
					
					// let valor_retirado = getValorRetirado(row.tbl_plan);
					// console.log(">>>>>>>");
					// console.log(planes);
					let valor_retirado = 0
					let valor_disponible = 0
					let interes_ganado = 0;
					planes.forEach((row2) => { 
						if (row2.estc_plan == row.tbl_plan) {
							valor_retirado 		= row2.valor_retirado;
							valor_disponible 	= row2.valor_disponible;
							interes_ganado		= row2.interes_ganado;
							// console.log("row2:" + row2.estc_plan + "   " + "row:"+row.tbl_plan)	
						}
					});
					// console.log(valor_retirado)	
					html_det = ` 
							<div class="col-sm-6">	
								<div class="card">	
									<div class="card-header""> 
										<span style="font-size:16px"> 
										<strong> 
									
										<b>Plan:</b>
										${row.plan_nombre}  
										</strong>
										</span>
									</div>
									<div class="card-body">
									
										<div> 
											<b>Capital:</b> 
											$${fn}  
										</div>
										<div>   
											<b>Fecha de Inicio:</b>
											${row.cliplan_fecha_ini} 
										</div> 
										<div> 
											<b>Fecha de inicio de retiro:</b>
											<span style="color:#641E16; font-weight: bold;"> 
												${row.cliplan_fecha_retmin} 
											</span> 
										</div>
										<div> 
											<b>Billetera:</b>
											<span style="color:#0b35f1; font-weight: bold;"> 
												 ${billetera}
											</span> 
										</div>
									</div>

								<div class="card-footer bg-light text-muted" >
									ESTADO
									<ul class="list-group">
										<li class="list-group-item d-flex justify-content-between align-items-center bg-light ">
											Interés Acumulado: $ ${interes_ganado} 
										<span class="badge badge-primary badge-pill">G L O B A L</span>
										</li>

										<li class="list-group-item d-flex justify-content-between align-items-center bg-light">
											Cantidad Retiro: $ ${valor_retirado} 
										<span class="badge badge-primary badge-pill">PROCESADO</span>
										</li>
										<li class="list-group-item d-flex justify-content-between align-items-center bg-secondary" style="color:#FFFFFF";>
										Saldo Interés: $ ${valor_disponible} 
										<span class="badge badge-primary badge-pill">DISPONIBLE</span>
										</li>
								  	</ul>
								</div>	


									
								</div>
							</div>
							`;

					let html_ok= `${html_det}`; 

					htmlcompleto+=  html_ok ;

				});

				htmlcompleto =   htmlcompleto  ;
 				$('#div_main_planes').html(htmlcompleto);
			}
			
			
			let solicitud_pendiente = r.message.solicitud_pendiente;
			let html_solicitud ='';	
			html_solicitud = `
			<div class="panel panel-default">
				<div class="panel-body">
					Solicitud RETIRO Pendiente :
				</div>
			</div>		
					`;

  
			if(solicitud_pendiente.length  == 0){
				html_solicitud ='';	
			}					
			solicitud_pendiente.forEach((row) => { 
				let html_sol='';
				let reti_fecha_sol = row.reti_fecha_sol
				
				// ${row.cliplan_capital}
				//${row.reti_estado}
			
				// html_sol = ` 
				// 		<div class="alert alert-primary" role="alert">
				// 			${reti_fecha_sol} 
				// 			[${row.name}]
				// 			<strong>
				// 			${row.plan_nombre}
				// 			</strong>
				// 			RETIRO DE:
				// 			${row.reti_tipo_retiro}
				// 			<strong>
				// 				$${row.reti_valor}
				// 			</strong>
				// 			[en proceso, 5 dias laborables]
				// 		</div> 
				// 		`;


				html_solicitud+=  html_sol ;
			});

			$('#div_main_solicitud').html(html_solicitud);
			

			
			// Seleccionar Registro de comisiones
			
			let suma_comision = r.message.suma_comision;


			let comisiones = r.message.comisiones;
			// console.log("comisiones");
			// console.log(comisiones);
			let html_comision ='';	
			html_comision = `
			<div class="panel panel-default">
				<div class="panel-body">
					
				</div>
				 
			</div>		
					`;

  
			if(comisiones.length  == 0){
				html_comision ='';	
			}			
			
			
			let det_det='';
			comisiones.forEach((row) => { 
				
				let comi_fecha = row.comi_fecha
				det_det += `
								
						<tr>
			
							<td> ${row.opci_descripcion}: $ ${row.comi_comision} </td>
							<td ALIGN=center > $${row.comi_fee} 								 </td>
							<td ALIGN=center> $${row.comi_disponible}						 </td>
						
						</tr>
					 `
			});

			let detalle_comision =`



			
				<table class="default">

					<tr   >
						<th> Comisión	</th>
						<th ALIGN=center >___ Feet___	</th>
						<th ALIGN=center> Total		</th>
					</tr>
				
					${det_det}
	
				
				</table>			
			
			`;

			
			let html_comi='';
				
				// ${row.cliplan_capital}
				//${row.reti_estado}
			
				 


				// html_comision +=  html_comi ;
				
			// ---------------------------------------  aqui

						html_comi = ` 
								<div class="col-sm-6">	
									<div class="card">	
										<div class="card-header""> 
											<span style="font-size:16px"> 
											 
										
											<b>Lider - Agenda de Comisiones</b>
											 
											 
											</span>
										</div>
										<div class="card-body">

										
											<div> 
											<b>Billetera:</b>
											<span style="color:#0b35f1; font-weight: bold;"> 
												${billetera}
											</span> 
											</div>

											<hr>


											  ${detalle_comision} 
											


										</div>

									<div class="card-footer bg-light text-muted" >
										
										<ul class="list-group">
											


											<li class="list-group-item d-flex justify-content-between align-items-center bg-secondary" style="color:#FFFFFF";>
											Total: $ ${suma_comision} 
											<span class="badge badge-primary badge-pill">DISPONIBLE</span>
											</li>
										</ul>
									</div>	


										
									</div>
								</div>
								`;

						// let html_ok= `${html_det}`; 

						html_comision+=  html_comi ;

						
					
			// ---------------------------------------- << aqui
			

			html_comision+=  `  ` ;


			if(comisiones.length  == 0){
				html_comision ='';	
			}			

			$('#div_main_comision').html(html_comision);
			




			// Fin Seleccionar

			let plan_pendiente = r.message.plan_pendiente;
			let html_plan_solicitud ='';	
			html_plan_solicitud = `
			<div class="panel panel-default">
				<div class="panel-body">
					Solicitud PLAN Pendiente :
				</div>
			</div>		
					`;


			if(plan_pendiente.length  == 0){
				html_plan_solicitud ='';	
			}					
			plan_pendiente.forEach((row) => { 
				let html_sol='';
				let cliplan_fecha_sol = row.cliplan_fecha_sol
				
				// ${row.tbl_plan}
				//${row.plan_nombre}
				//cliplan_capital 
			
				html_sol = ` 
						<div class="alert alert-primary" role="alert">
							${cliplan_fecha_sol} 
							<strong>
								${row.plan_nombre}
							</strong>
							$${row.cliplan_capital} 
							[en proceso, 24 horas laborables]
						</div> 
						`;


				html_plan_solicitud+=  html_sol ;
			});

			$('#div_main_plan_solicitud').html(html_plan_solicitud);
			



			let noticias = r.message.noticias;
			let html_noticias ='';	
			html_noticias = `
						<br>
						<div class="alert alert-primary" role="alert">
							Noticias
						</div> 	
						
					`;	
			if(noticias.length  == 0){
				html_noticias ='';	
			}			
			noticias.forEach((row) => { 
				let html_not='';
				let titulo	= row.noti_titulo;
				let detalle = row.noti_detalle;
				let foto	= row.noti_foto;
					 
				// html_not = ` 
				// 		<div class="alert alert-danger" role="alert">
				// 			<p>	<span style="color:#c0392b"><span style="font-size:20px">
				// 				Noticias  ${titulo}
				// 				<br>
				// 				:> ${detalle}
				// 				<br>
				// 				<img  style="height:90px" class="rotate" src="${foto}" alt="Generic placeholder image">
				// 			</p>
				// 		</div> 
				// 		`;
				html_not =  `
				<div class="col-sm-12">
					<div class="card" style="width: 18rem ;">
						<img class="card-img-top" src="${foto}" alt="Card image cap">
						<div class="card-body">
							<p 	class="card-text">
								<strong>${titulo}</strong>
							</p>
							<p>
								${detalle}
							</p>
						</div>
					</div>
				</div>
					`;
				// html_not = ` 
				// 		<div class="col-sm-6">	
				// 			<div class="card">	
				// 				<div class="card-header""> 
				// 					<span style="font-size:16px"> 
				// 					<strong> 
				// 					${titulo}
				// 					</strong>
				// 					</span>
				// 				</div>
				// 				<div class="card-body">
								
				// 					<div> 
				// 						<b>Capital:</b> 
				// 						${detalle}
				// 					</div>
 
				// 				</div>

				// 			<div class="card-footer bg-light text-muted" >
				// 				<img  style="height:90px" class="rotate" src="${foto}" alt="Generic placeholder image">
				// 			</div>	


								
				// 			</div>
				// 		</div>
				// 		`;



				html_noticias+=  `<div class="card-columns">` 
						+	html_not  
					  	+  `</div>` ;
			});

			$('#div_main_noticias').html(html_noticias);
			
		
			
		},


	});

}
function retirar_rendimiento(){
	 
	let d = new frappe.ui.Dialog({
		title: 'SOLITUD DE PAGO DE RENDIMIENTO ',
		fields: [
			{
				label: 'CANTIDAD DE LA SOLICITUD',
				fieldname: 'cantidad',
				fieldtype: 'Currency',
				"reqd": 1,
			},
			  
			{
				"fieldname": "plan",
				"fieldtype": "Select",
				"label": "Plan" + this.lstPlanes,
				options:this.lstPlanes,
				"reqd": 1,	 
			} ,

		],
		primary_action_label: 'Confirmar',
		primary_action(values) {
			if(values.cantidad <=0){
				frappe.throw('La cantidad debe ser mayor que cero');
			} 
			else{
				crear_sol_retiro_rendimiento(values.plan , values.cantidad);
				d.hide();
			}
		
		}
	});
	
	d.show();

}

function retirar_capital(){

	let d = new frappe.ui.Dialog({
		title: 'SOLITUD DE RETIRO DE CAPITAL',
		fields: [	 
		 
			{
				"fieldname": "plan",
				"fieldtype": "Select",
				"label": "Plan"		,
				"options":this.lstPlanes,		 
			} ,

		],
		primary_action_label: 'Confirmar',
		primary_action(values) {
			d.hide();
			crear_sol_retiro_capital(values.plan  );
			
		}
	});
	
	d.show();

}

function lista_referidos(){

	let d = new frappe.ui.Dialog({
		title: 'LISTA REFERIDOS',
		fields: [	 
		 
			// {
			// 	"fieldname": "cli_nombrecompleto",
			// 	"fieldtype": "Select",
			// 	"label": "Referidos"		,
			// 	"options":this.lstReferidos,		 
			// } ,
			{
				label: 'Referidos',
				fieldname: 'referidos',
				fieldtype: 'HTML',
				options:this.lstReferidos,
				reqd:0,
			} ,

		],
		primary_action_label: 'Aceptar',
		primary_action(values) {
			d.hide();
			// crear_sol_retiro_capital(values.plan  );
		}
	});
	
	d.show();

}



function show_comisiones_referidos(){

	let d = new frappe.ui.Dialog({
		title: 'COMISIONES REFERIDOS',
		fields: [	 
		 
			// {
			// 	"fieldname": "cli_nombrecompleto",
			// 	"fieldtype": "Select",
			// 	"label": "Referidos"		,
			// 	"options":this.lstReferidos,		 
			// } ,
			{
				label: 'Comisiones Referidos',
				fieldname: 'comiciones_referidos',
				fieldtype: 'HTML',
				options:this.lstComisionesReferidos,
				reqd: 0,
			} ,

		],
		primary_action_label: 'Aceptar',
		primary_action(values) {
			d.hide();
			// crear_sol_retiro_capital(values.plan  );
		}
	});
	
	d.show();

}


function verificaDatosLlenos(){
	frappe.call({
		method: "app_agenda.mod_cliente.page.pag_cliente.pag_cliente.verificaDatosLlenos",
		freeze: true,
	 
		freeze_message: "Verificando",
		callback: (r) => {			
			 
			 
			let mensage = `<p><span style="color:#c0392b"><span style="font-size:20px">Para completar su registro, debe completar la informaci&oacute;n con sus datos personales en el siguiente enlace:</span></span></p>

			<p><span style="color:#c0392b"><span style="font-size:20px"> <a  href="/app/tbl_cliente/${r.message.cliente_name}" target="_blank" >Aqui</a>  </span></span></p>
			
			<p><span style="color:#16a085"><span style="font-size:20px">Luego debe regresar y actualizar esta pantalla </span></span></p>
			 
			`;
			// $('#div_main_noticias').html(html_noticias);
			if( r.message.contar == 0){
				/*frappe.msgprint({
					title: __('Notification'),
					indicator: 'red',
					message:  mensage
				});*/

				let hmtl_error = `
						<div class="alert alert-danger" role="alert">
							${mensage}
			  			</div>`;
	
				$('#div_main_error_datos').html(hmtl_error);
			 

			}

		


		},


	});

}

function getplanesaprobados(){

	frappe.call({
		method: "app_agenda.mod_cliente.page.pag_cliente.pag_cliente.getplanesaprobados",
		freeze: true,
		callback: (r) => {			
			this.lstPlanes = r.message;
			
		  console.log(this.lstPlanes);

		},
	});
}

// function getReferidos2(){
// 	frappe.call({
// 		method: "app_agenda.mod_cliente.page.pag_cliente.pag_cliente.getReferidos",
// 		freeze: true,
// 		callback: (r) => {			
// 			this.lstReferidos = r.message;
// 		  console.log(this.lstReferidos);

// 		},
// 	});	
// }

function getReferidos(){
		frappe.call({
			method: "app_agenda.mod_cliente.page.pag_cliente.pag_cliente.getReferidos",
			freeze: true,	 
			callback: (r) => {	
				// this.lstReferidos = r.message;		
				this.lstReferidos= '';  
				r.message.forEach(value=> {
					this.lstReferidos += '<li>' 
										+ value.cli_nombrecompleto 
										+ ' Plan: ' 
										+ '[ ' + value.plan_nombre + ' ]'
										+ ' $' + value.cliplan_capital
										+ ' </li>';
				});
				this.lstReferidos = this.lstReferidos.trim();
				}, 
	
		});
	}
	

	function getComisionesReferidos(){
		frappe.call({
			method: "app_agenda.mod_cliente.page.pag_cliente.pag_cliente.getComisionesReferidos",
			freeze: true,	 
			callback: (r) => {	
				// this.lstReferidos = r.message;		
				console.log("Comisiones")
				console.log(r.message)
				this.lstComisionesReferidos= '';  
				let detalle;
				r.message.forEach(value=> {
					this.detalle=' [ Procesado, ' + value.fecha  + ' ]'
					if (value.comi_trans_pendiente) {
						this.detalle=' ...disponible'						
					}
					this.lstComisionesReferidos += '<li>' 
										+ '' 		+	value.opci_descripcion 
										+ ':  $'  		+ 	value.comi_comision 
										+ ' [ Feet:' 	+   value.comi_fee + ' ]'
										+ ' Comisión: $' + value.comi_disponible
										+ ' ' + this.detalle
										+ ' </li>';
			
				});
				this.lstComisionesReferidos = this.lstComisionesReferidos.trim();
				}, 
	
		});
	}
	




// function getnoticias(){

// 	frappe.call({
// 		method: "app_agenda.mod_cliente.page.pag_cliente.pag_cliente.getnoticias",
// 		freeze: true,
// 		callback: (r) => {			
// 			this.noticias = r.message;
// 		  	console.log(this.noticias);

// 		},
// 	});
// }


function crear_sol_retiro_rendimiento(inplan, invalor){

	frappe.call({
		method: "app_agenda.mod_cliente.page.pag_cliente.pag_cliente.crear_sol_retiro_rendimiento",
		freeze: true,
		args:{plan:inplan, valor:invalor}, 
		callback: (r) => {			
		 
			frappe.msgprint({
				title: __('Notification'),
				indicator: 'red',
				message:  r.message
			})
		},
	});
}

function crear_sol_retiro_capital(inplan){

	frappe.call({
		method: "app_agenda.mod_cliente.page.pag_cliente.pag_cliente.crear_sol_retiro_capital",
		freeze: true,
		args:{plan:inplan },
		callback: (r) => {			
		 
			frappe.msgprint({
				title: __('Notification'),
				indicator: 'red',
				message:  r.message
			})
		},
	});
}

function getValorRetirado(inplan){

	frappe.call({
		method: "app_agenda.mod_cliente.page.pag_cliente.pag_cliente.getValorRetirado",
		freeze: true,
		args:{plan:inplan },
		callback: (r) => {			
			this.valor_valor = r.mensage;
			frappe.msgprint({
				title: __('Notification'),
				indicator: 'red',
				message:  r.message
			})
		},
	});
}

function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
	try {
	  decimalCount = Math.abs(decimalCount);
	  decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
	  const negativeSign = amount < 0 ? "-" : "";
  
	  let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
	  let j = (i.length > 3) ? i.length % 3 : 0;
  
	  return negativeSign +
		(j ? i.substr(0, j) + thousands : '') +
		i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
		(decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
	} catch (e) {
	  console.log(e)
	}
  };
  