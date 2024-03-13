
let vpines;
let valor=2001;
let dias=30;

frappe.pages['pagina_planes'].on_page_load = function (wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,

		single_column: true
	});

	page.main.html(frappe.render_template("pagina_planes", {}));

	getPlanes();
	get_pines();

}

function getPlanes() {
	let htmlfull = '';
	frappe.call({
		method: "app_agenda.mod_cliente.page.pagina_planes.pagina_planes.get_planes_info",
		freeze: true,
		callback: (r) => {			
			let htmlcol ='';
			r.message.forEach((row) => {
				row.valores.forEach((rowi) => {
					let texto 		= row.plan_nombre + ' $' + rowi.plad_capital;
					let texto_plan 	= row.plan_nombre;
					let texto_mas1 	= ' $' + (rowi.plad_capital + 1) ;
					let meses 		= row.cantidad_mes;
					let texto_meses ='mes';
					if (meses>1){
						texto_meses ='meses';
					}
					htmlcol += `	<div class="col-md-4 col-xs-12">
					<button style='margin-top:15px; width:90px;' 
					onclick="selectPlan( '${rowi.name}' , '${texto}', '${texto_plan}' ,'${texto_mas1}', '${meses}', '${texto_meses}' )" 
					 type="button" class="btn btn-primary"> $ ${rowi.plad_capital} </button>
					</div> `;
				});

				let html = `    <div class="col-6">
			<div class="card card-raised h-100 p-2">
				<div class="card-header bg-primary text-white px-4">
					<div class="d-flex justify-content-between align-items-center">
						<div class="me-4">
							<h2 class="card-title text-white mb-0"> ${row.plan_nombre}  </h2>                       
						</div>                   
					</div>
				</div>
				<div class="card-body">
					<div class="row">
						 ${htmlcol} 					
					</div>
				</div>
				<div class="card-footer bg-transparent">
					${row.plan_porcentaje}% diario; dias laborables.
					<strong>${row.plan_detalle1}</strong>
				</div>			 
			</div>
	   </div>`;
	
	   htmlcol ='';
				htmlfull += html;

			});
			$('#divplanes').html(htmlfull);


		},


	});
}

function selectPlan(valor,texto,texto_plan,texto_mas1, meses, texto_meses ) {
	
	// Depositar: <strong> ${texto_mas1} </strong>

	let htmlv__ = 
	`
	Selección: <strong> ${texto} </strong> 
	
   
		<div class="accordion" id="accordionExample">
		  	<div class="accordion-item">
				<h2 class="accordion-header" id="headingOne">
				<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
					Términos y Condiciones
				</button>
				</h2>
				<div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample" style="">
					<div class="accordion-body">

						<p style="text-align:center">
								<span style="font-size:20px">
									<span style="color:#c0392b">
										<strong>
											<span style="font-family:Calibri,sans-serif">
												ADVERTENCIA
											</span>
										</strong>
									</span>
								</span>
							</p>
		
						<p style="text-align:center">
							<span style="font-size:14px">
								<span style="font-family:Calibri,sans-serif">
									Antes de hacer el dep&oacute;sito de tu plan lee y acepta los siguientes
								</span>
							</span>
						</p>
										
						<p style="text-align:center">
							<span style="font-size:20px">
								<span style="color:#c0392b">
									<strong>
										<span style="font-family:Calibri,sans-serif">
											TÉRMINOS Y CONDICIONES
										</span>
									</strong>
								</span>
							</span>
						</p>
						
						<ul>
							<li><span style="font-size:11pt"><span style="font-family:Calibri,sans-serif"><strong>ITALFOX</strong> 
								te asegura el 100% de tu capital
								</span></span>
							</li>
				
							<li><span style="font-size:11.0pt"><span style="font-family:&quot;Calibri&quot;,sans-serif"><strong>
								ITALFOX </strong>no se har&aacute; responsable si realizas incorrectamente el deposito, y me refiero a que si env&iacute;as los USDT a otra direccion de billetera y red que no sea la nuestra.</span></span>
							</li>
					
							<li><span style="font-size:11pt"><span style="font-family:Calibri,sans-serif">
								El Trading es riesgoso, y en los peores de los casos, si el mercado se vuelve muy inestable, no operaremos para resguardar el capital de todos, y por ende no podremos generar rendimiento (Y si esto llega a suceder te lo haremos saber).</span></span>
							</li>
							<li><span style="font-size:11pt"><span style="font-family:Calibri,sans-serif">
								Puedes retirar tu capital cuando lo desees, pero tendr&aacute;s que esperar de 15 a 20 dias h&aacute;biles, desde el momento que realizas la solicitud de devoluci&oacute;n.</span></span>
							</li>
							<li><span style="font-size:11pt"><span style="font-family:Calibri,sans-serif">
								Si solicitas el retiro de tu capital y aun no completas <strong>${meses} ${texto_meses} </strong> , no se te pagara el rendimiento acumulado por incumplimiento de contrato </span></span>
							</li>
							
						</ul>				
					</div>
				</div>
		  	</div>

			<div class="accordion-item">
				<h2 class="accordion-header" id="headingTwo">
				<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
					Dirección de Billetera
				</button>
				</h2>
				<div id="collapseTwo" class="accordion-collapse collapse " aria-labelledby="headingTwo" data-bs-parent="#accordionExample" style="">
				<div class="accordion-body">
					<strong>Instrucciones para la transferencia </strong> 
					<li>Al momento de enviar los USDT desde su Billetera de Binance, Copie e introduzca correctamente la dirección de billetera, y asegúrese de poner la RED TRON TRC20 </li>
					<li>Envié la cantidad de USDT del plan que eligió, más 1 USDT; que es la comisión que cobra Binance.</li>
					<li>Realice la transacción de <strong> ${texto_mas1} USDT</strong> y respáldelo mediante una imagen y súbala a la plataforma utilizando el botón de adjuntar, para hacer la respectiva activación de su plan. </li>
					
					Esperando su deposito
					<li>TQiQWRiaQtYmvLnF43CgtFGS1xXfEwP2rt  [copiar] </li>  
					<div align="center"><img src="https://italfox.com/img/intro/codigoqr.PNG"></div>
				</div>
			</div>
		  </div>
		  <div class="accordion-item">
			<h2 class="accordion-header" id="headingThree">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
			  	Binance Pay
			  </button>
			</h2>
			<div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample" style="">
			  <div class="accordion-body">
				<strong>Instrucciones para la transferencia</strong>
				<li>Al momento de enviar los USDT desde su Billetera de Binance Pay, Copie e introduzca correctamente la dirección de correo electrónico</li>
       			administracion@italfox.com
				<li>Escriba la cantidad de <strong> ${texto_plan} </strong> que eligió y luego le da clic en enviar.</li>
				<li>Realice la transacción y respáldelo mediante una imagen y súbala a la plataforma utilizando el botón de adjuntar, para hacer la respectiva activación de su plan. </li>
				<div align="center"><img src="https://italfox.com/img/intro/correo.PNG"></div>
		
			  </div>
			</div>
		  </div>
		</div>
		
		<!-- End Example Code -->

		

	`;


	let htmlv = 
	`
	Selección: <strong> ${texto} </strong> 
	
			<div id="accordion">
			<div class="card">
				<div class="card-header" id="headingOne">
					<h5 class="mb-0">
					<button class="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
						Términos y Condiciones
					</button>
					</h5>
				</div>
		
				<div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
					<div class="card-body">
						<p style="text-align:center">
								<span style="font-size:20px">
									<span style="color:#c0392b">
										<strong>
											<span style="font-family:Calibri,sans-serif">
												ADVERTENCIA
											</span>
										</strong>
									</span>
								</span>
							</p>

							<p style="text-align:center">
								<span style="font-size:14px">
									<span style="font-family:Calibri,sans-serif">
										Antes de hacer el dep&oacute;sito de tu plan lee y acepta los siguientes
									</span>
								</span>
							</p>
											
							<p style="text-align:center">
								<span style="font-size:20px">
									<span style="color:#c0392b">
										<strong>
											<span style="font-family:Calibri,sans-serif">
												TÉRMINOS Y CONDICIONES
											</span>
										</strong>
									</span>
								</span>
							</p>
							
							<ul>
								<li><span style="font-size:11pt"><span style="font-family:Calibri,sans-serif"><strong>ITALFOX</strong> 
									te asegura el 100% de tu capital
									</span></span>
								</li>
					
								<li><span style="font-size:11.0pt"><span style="font-family:&quot;Calibri&quot;,sans-serif"><strong>
									ITALFOX </strong>no se har&aacute; responsable si realizas incorrectamente el deposito, y me refiero a que si env&iacute;as los USDT a otra direccion de billetera y red que no sea la nuestra.</span></span>
								</li>
						
								<li><span style="font-size:11pt"><span style="font-family:Calibri,sans-serif">
									El Trading es riesgoso, y en los peores de los casos, si el mercado se vuelve muy inestable, no operaremos para resguardar el capital de todos, y por ende no podremos generar rendimiento (Y si esto llega a suceder te lo haremos saber).</span></span>
								</li>
								<li><span style="font-size:11pt"><span style="font-family:Calibri,sans-serif">
									Puedes retirar tu capital cuando lo desees, pero tendr&aacute;s que esperar de 15 a 20 dias h&aacute;biles, desde el momento que realizas la solicitud de devoluci&oacute;n.</span></span>
								</li>
								<li><span style="font-size:11pt"><span style="font-family:Calibri,sans-serif">
									Si solicitas el retiro de tu capital y aun no completas <strong>${meses} ${texto_meses} </strong> , no se te pagara el rendimiento acumulado por incumplimiento de contrato </span></span>
								</li>
						</div>
				</div>
			</div>

			<div class="card">
				<div class="card-header" id="headingTwo">
					<h5 class="mb-0">
					<button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
						Dirección de Billetera
					</button>
					</h5>
				</div>
				<div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
					<div class="card-body">
						<strong>Instrucciones para la transferencia </strong> 
						<li>Al momento de enviar los USDT desde su Billetera de Binance, Copie e introduzca correctamente la dirección de billetera, y asegúrese de poner la RED TRON TRC20 </li>
						<li>Envié la cantidad de USDT del plan que eligió, más 1 USDT; que es la comisión que cobra Binance.</li>
						<li>Realice la transacción de <strong> ${texto_mas1} USDT</strong> y respáldelo mediante una imagen y súbala a la plataforma utilizando el botón de adjuntar, para hacer la respectiva activación de su plan. </li>
						
						Esperando su deposito
						<li>TQiQWRiaQtYmvLnF43CgtFGS1xXfEwP2rt  [copiar] </li>  
						<div align="center"><img src="https://italfox.com/img/intro/codigoqr.PNG"></div>
					
					</div>
				</div>
			</div>

			<div class="card">
				<div class="card-header" id="headingThree">
					<h5 class="mb-0">
					<button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
						Binance Pay
					</button>
					</h5>
				</div>
				<div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordion">
					<div class="card-body">
						<strong>Instrucciones para la transferencia</strong>
						<li>Al momento de enviar los USDT desde su Billetera de Binance Pay, Copie e introduzca correctamente la dirección de correo electrónico</li>
						   administracion@italfox.com
						<li>Escriba la cantidad de <strong> ${texto_plan} </strong> que eligió y luego le da clic en enviar.</li>
						<li>Realice la transacción y respáldelo mediante una imagen y súbala a la plataforma utilizando el botón de adjuntar, para hacer la respectiva activación de su plan. </li>
						<div align="center"><img src="https://italfox.com/img/intro/correo.PNG"></div>
					</div>
				</div>
			</div>
		</div>
		 

		<ul>

	`;

	 let htmlv2 = `
	 
		<!-- 
		<ul>
			<li>  
				<a href="https://pay.binance.com/es" target="_blank">
					BINACY PAY
				</a>
			</li>
			<li>  
				<a href="https://tron.network/usdt" target="_blank">
					TRON TRC20
				</a>
			</li>
		</ul>
		-->
	  `;	 
	let d = new frappe.ui.Dialog({
		title: '<b>ITALFOX</b>',
		fields: [
			{
				label: ' ',
				fieldname: 'html_ter',
				fieldtype: 'HTML',
				options:htmlv
			},
			{
				label: 'Aceptar todo',
				fieldname: 'aceptar',
				fieldtype: 'Check'
			} ,
		 
			// {
			// 	label: 'Método de deposito',
			// 	fieldname: 'metodo',
			// 	fieldtype: 'HTML',
			// 	options:this.vpines,
			// 	reqd: 1,
			// } ,
			{
				label: ' ',
				fieldname: 'html_ter2',
				fieldtype: 'HTML',
				options:htmlv2
			},			
			{
				label: 'Esperando su Depósito',
				fieldname: 'cliplan_foto',
				fieldtype: 'Attach Image'				
			},			
			{
				label		: 'id Hash',
				fieldname	: 'id_hash',
				fieldtype	: 'Data',
				label		: 'Id Hash',
				reqd		: 1,
				unique		: 1				
			}
		],
		primary_action_label: 'Enviar',
		primary_action(values) {
			if( values.aceptar==false){
				frappe.msgprint({
					title: __('Notification'),
					indicator: 'red',
					message: __('Debe Aceptar los términos y condiciones ')
				});
			}
			else 
			if( values.cliplan_foto == null ){
				frappe.msgprint({
					title: __('Notification'),
					indicator: 'red',
					message: __('Debe Ingresar Foto (Depósito)')
				});
			}
			else
			{
				frappe.call({
					method: "app_agenda.mod_cliente.page.pagina_planes.pagina_planes.crearsolicitud", 
					freeze: true,
					args:{	pdname:		valor,
							foto_url: 	values.cliplan_foto,
							id_hash:	values.id_hash
					},

					callback: (r) => {		
						
						if (r.message.includes("CLI-")){
		
							frappe.msgprint({
								title: __('Notification'),
								indicator: 'red',
								message: __('Debe primero llenar la información de su cuenta ')
							});
							frappe.set_route('Form','tbl_cliente',r.message)
		
						}
						else{
							d.hide();

						
						frappe.msgprint({
							title: __('Notification'),
							indicator: 'green',
							message: __('Se ha realizado la solicitud correctamente, el administrador del sistema procederá a verificar la información')
						});
					}
					}, 
			
				});

			}
		//console.log(values.cliplan_foto);		
		}
	});
	
	d.show();
 
	 
}

function get_pines(){
	frappe.call({
		method: "app_agenda.mod_cliente.page.pagina_planes.pagina_planes.get_pines",
		freeze: true,	 
		callback: (r) => {			
			this.vpines= '';  
			r.message.forEach(value=> {
				this.vpines += value.pin_nombre + '\n';
			});
			this.vpines = this.vpines.trim();
			}, 

	});
}