let htm_datos;
let nOpcion;
let nMenu;
let titulo;

frappe.pages['pag_trading'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		single_column: true
	});



	page.main.html(frappe.render_template("pag_trading", {}));
	// page.set_title('Trading')
	// app_include_js = "/assets/app_agenda/lib-nitro-master/js/modernizr-2.6.2.min.js"
	// All of the above support a list of paths too
	// app_include_js = [
	// 	"/assets/app_agenda/lib-nitro-master/js/modernizr-2.6.2.min.js" 
	// ]	

	// app_include_css = "/assets/app_agenda/lib-nitro-master/css/bootstrap.css"

	// console.log("123")

	
	// page_css = {"pag_trading" : "/assets/app_agenda/lib-nitro-master/css/bootstrap.css"}	
	titulo="MENU PRINCIPAL" ;
	call_main();
	console.log("main");
 }

 



 
function paginaInicio(){
	// console.log(this.nOpcion);
	location.href = "/app/pag_cliente"; 
}



function call_main()
{
	// src="/assets/app_agenda/lib-nitro-master/images/logo/logo.png" 
	htm_datos =  `
		
			<div  class="fh5co-narrow-content" >
					<div class="card-deck">
						<div class="card">
							<img class="card-img-top" src="/assets/app_agenda/lib-nitro-master/images/work_1.jpg" alt="Card image cap">
							<div class="card-body">
								<h5 class="card-title">COPY TRADING</h5>
								<p class="card-text">
									...
								</p>
							</div>
							<div class="card-footer">
								<button 
									type="button" 
									class="btn btn-secondary btn-sm btn-block"
									onclick="javascript:call_opcionMenu(1)"
								> 
								Información
								</button>
							</div>
						</div>

						<div class="card">
							<img class="card-img-top" src="/assets/app_agenda/lib-nitro-master/images/work_2.jpg" alt="Card image cap">
							<div class="card-body">
								<h5 class="card-title">PASAR CUENTAS DE FONDEO</h5>
								<p class="card-text">
									...
								</p>
							</div>
							<div class="card-footer">
								<button 
									type="button" 
									class="btn btn-secondary btn-sm btn-block"
									onclick="javascript:call_opcionMenu(2)"
								> 
								Información
								</button>
							</div>
						</div>


						<div class="card">
							<img class="card-img-top" src="/assets/app_agenda/lib-nitro-master/images/work_3.jpg" alt="Card image cap">
							<div class="card-body">
								<h5 class="card-title">TRABAJAMOS CUENTAS DE FONDEO</h5>
								<p class="card-text">
									...	
								</p>
							</div>
							<div class="card-footer">
								<button 
									type="button" 
									class="btn btn-secondary btn-sm btn-block"
									onclick="javascript:call_opcionMenu(3); "
								> 
								Información
								</button>
							</div>
						</div>
					</div>
			</div>
		 

	`;

	$('#main_pagina').html(htm_datos);

	paginaInfoAbajo(titulo)
	
}


function call_opcionMenu(nOpcionGlobal)
{	
	
	if (nOpcionGlobal==1) {  titulo = 'Copy Trading'; }
	if (nOpcionGlobal==2) {  titulo = 'Pasar Cuentas de Fondeo'; }
	if (nOpcionGlobal==3) {  titulo = 'Trabajamos Cuentas de Fondeo'; }
	htm_datos = `
	<ul class="nav nav-tabs" id="myTab" role="tablist">
		<li class="nav-item">
			<a 	class			= "nav-link active" 
				id				= "home-tab" 
				data-toggle		= "tab" 
				onclick			= "call_cargarCopy(1);" 
				role			= "tab" 
				aria-controls	= "home" 
				aria-selected	= "true"
			>
				${titulo}
			</a>
		</li>
		<li class="nav-item">
			<a class="nav-link" id="profile-tab" data-toggle="tab"  onclick="call_cargarCopy(2);"  role="tab" aria-controls="profile" aria-selected="false">Beneficios</a>
		</li>
		<li class="nav-item">
			<a class="nav-link" id="contact-tab" data-toggle="tab" onclick="call_cargarCopy(3);" role="tab" aria-controls="contact" aria-selected="false">Términos y Condiciones</a>
		</li>
		<li class="nav-item">
			<a class="nav-link" id="contact-tab" data-toggle="tab" onclick="call_cargarCopy(4);" role="tab" aria-controls="contact2" aria-selected="false">Pasos a Seguir</a>
		</li>
	</ul>

	<div id="copy_detalle">
	</div> 
	`;
	$('#main_pagina').html(htm_datos);
	this.nMenu		= nOpcionGlobal;
	this.nOpcion 	= 1;
	
	call_cargarCopy(1);
}




function call_cargarCopy(op)
{
	this.nOpcion = op;
	let newDetalle = '';
	
	// 
	let detalle1;
	let detalle2;
	let detalle3;
	let detalle4;

	this.detalle1='';
	this.detalle2='';
	this.detalle3='';
	this.detalle4='';
	this.detalle5='';

	// 1. Copy Trading
	if (this.nMenu==1) {
		
		this.detalle1 = `
			El Copy Trading se lo realiza desde una cuenta MAM (Un Multi Account Manager) o Gestor de cuentas múltiples, es un software bastante sencillo que se integra en tu MT4 desde tu celular y que permite a los gestores de capital colocar órdenes (operaciones) en masa en un número Ilimitado de cuentas. 
			<p></p>
			Este proceso es rápido, eficiente y puede ejecutarse desde una sola terminal de trading... 
			<p></p>
			En pocas palabras el Trader trabajara tu dinero directamente desde un Bróker regulado, el cual se encargara de realizar los pagos tanto para el Trader como para el Inversor

		`;
		
		this.detalle2 = `
			<ul>
				<li>
				Puedes invertir desde $200 en adelante (Te recomendamos invertir mínimo desde $1.000, ya que, a mayor inversión, mayores serán tus ingresos).
				</li>
				
				<li>
				Se reparten un 50/50 de las Ganancias.
				</li>
				
				<li>
				Podrás realizar retiros mensuales directamente desde el Bróker. 
				</li>
				
				<li>
				Generamos desde un 5% hasta un 40% de la cuenta por mes.
				</li>
				<li>
				Podrás visualizar todas las operaciones que se realicen desde tu celular.
				</li>
				
				<li>
				Tu dinero estará a tu disposición, y el único que podrá depositar y retirar serás tú mismo.	
				</li>
			</ul>
		`;

		this.detalle3 = `
			<ul>
			<li>Ser mayor de 18 años, porque el bróker tiene que validar tus documentos. </li> 
			<li>No podrás retirar tu capital si antes cumplir el mes. </li> 
			<li>Los retiros mínimos que puedes realizar en el Bróker son desde $10 en adelante </li> 
			<li>El bróker te cobra $5 dólares de comisión por retiro, sea la cantidad que sea, (así sea $10 dólares, 1.000 dólares o más siempre va a ser $5 dólares de comisión).  </li> 
			<li>Para que puedas invertir lo mínimo en nuestro Copy Trading que es $200, tienes que generar un depósito mínimo de $205 ya que el bróker y las Wallets (Billeteras electrónicas) cobran comisiones.   </li> 
			</ul>	
		`;

		this.detalle4 = `
			<ul>
			<li>1. Como crearse una cuenta de inversor, usando el link del trader.
			https://blackbullmarkets.com/en/live-account/?ib=2100072617 </li>
			<li>2. Como verificar la cuenta con los documentos. </li>
			<li>3. Como crear cuenta de inversor. </li>
			<li>4. Como depositar en la cuenta.</li>
			<li>5. Como retirar.</li>
			</ul>
			<p>
			Si deseas unirte al Copy Trading contáctate con soporte al siguiente link de WhatsApp
			</p>	

			<div class="btn-group">
				<button type="button" 
						class="btn btn-default" 
						onclick="javascript: window.open('https://acortar.link/RMSmRi', '_blank');"
						target = "_blank";
						done = 1;
						>
						https://acortar.link/RMSmRi
				</button>
		 	 </div>

		`;
	}


	// 2. Copy Trading
	if (this.nMenu==2) {
		
		this.detalle1 = `
			<p>
			Que es Cuenta de Fondeo ?
			</p>
			<p>
			Las cuentas fondeadas, también denominadas cuentas financiadas, sirven para empezar a hacer trading sin depósito, es decir, la empresa que las ofrece aporta el capital inicial para que el trader seleccionado pueda invertir en los mercados, generalmente en derivados financieros.
			</p>
		`;
		
		this.detalle2 = `
			<ul>
			<li>Podrás financiarte con dinero ajeno, sin exponer tu capital.</li>
			<li>Puedes trabajar cuentas grandes sin necesidad de hacer un importante desembolso más que del costo de la prueba. </li>
			</ul>
		`;

		this.detalle3 = `
			<ul>
			<li>Haber adquirido tu cuenta en FTMO o MFF en MT4 ó MT5, apalacamiento 1:100 y no haberla operado. </li>
			<li>Solo pasamos cuentas de Fondeo de 200k y 300k</li>
			<li>Pasamos las 2 fases de 30 a 45 días habiles.</li>
			<li>Un único pago para las 2 Fases.</li>
			</ul>
			
			<h3>
			Precios de pasar las 2 fases
			</h3>
			<ul>
			<li>Cuenta de 200k = $1.500 USDT </li>
			<li>Cuenta de 300k = $2.000 USDT </li>
			</ul>
			
	



		`;

		this.detalle4 = `
			<h3>
			Si deseas el servicio comunícate con el equipo de soporte al siguiente link de whatsapp :
			</h3>

			<div class="btn-group">
				<button type="button" 
						class="btn btn-default" 
						onclick="javascript: window.open(' https://acortar.link/rgviMB ', '_blank');"
						target = "_blank";
						done = 1;
						>
						https://acortar.link/rgviMB 
				</button>
		 	 </div>


		`;
	}




	// 3. Trabajar cuentas de Fondeo
	if (this.nMenu==3) {
		
		this.detalle1 = `
			<p>
			Que es Cuenta de Fondeo ?
			</p>
			<p>
			Las cuentas fondeadas, también denominadas cuentas financiadas, sirven para empezar a hacer trading sin depósito, es decir, la empresa que las ofrece aporta el capital inicial para que el trader seleccionado pueda invertir en los mercados, generalmente en derivados financieros.
			</p>
		`;
		
		this.detalle2 = `
		<ul>
			<li>Podrás financiarte con dinero ajeno, sin exponer tu capital.</li>
			<li>Tendrás otra fuente de ingresos muy rentable. </li>
		</ul>		`;

		this.detalle3 = `
			<ul>
				<li>Tener lista su cuenta Live (pasada las 2 fases de evaluación). </li>
				<li>Haber adquirido tu cuenta en MFF o FTMO en MT5 con un apalancamiento de 1:100 </li>
				<li>Solo Trabajamos cuentas de 300K. </li>
				<li>Se consigue de un 5% a un 30% mensual.</li>
				<li>Con división de ganancias sobre 70/30, Traders/Usuario.</li>
			</ul>
		`;

		this.detalle4 = `
			<h3>
			<p>Comunícate con el equipo de soporte al siguiente link de whatsapp </p>
		

			<div class="btn-group">
				<button type="button" 
						class="btn btn-default" 
						onclick="javascript: window.open('https://acortar.link/dFtq8v', '_blank');"
						target = "_blank";
						done = 1;
						>
						https://acortar.link/dFtq8v
				</button>
		 	 </div>
			<p></p>
			<p>y pregunta si quedan cupos disponibles.</p>
			</h3>

			
		`;
	}



	if (op==1) {
		newDetalle = `
				<br>
			
				<div class="row">
					<div class="col-md-12">
						<div class="fh5co-feature animate-box fadeInLeft animated" data-animate-effect="fadeInLeft">
							<div class="fh5co-icon">
								<i class="icon-strategy"></i>
							</div>
							<div class="fh5co-text">
								<h3>INFORMACION</h3>
								<p>
									<!-- Aqui informacion de ${titulo} -->
								`+ this.detalle1 + `
								</p>
							</div>
						</div>
					</div>
				</div>
	 

 
			`;
	}

// 	<img src="/assets/app_agenda/lib-nitro-master/images/work_3.jpg" 
// 	width="200px"  
// 	alt="..." class="rounded-circle"
// >

	if (op==2) {
		newDetalle = `
				<br>
				<div class="row">
					<div class="col-md-12">
						<div class="fh5co-feature animate-box fadeInLeft animated" data-animate-effect="fadeInLeft">
							<div class="fh5co-icon">
								<i class="icon-telescope"></i>
							</div>
							<div class="fh5co-text">
								<h3>BENEFICIOS</h3>
								<p>
									<!-- Aqui Beneficios de ${titulo} -->
									` + this.detalle2 +  `
								</p>
							</div>
						</div>
					</div>
				</div>
			 

			`;
	}
	if (op==3) {
		newDetalle = `
			<br>
			<div class="row">
				<div class="col-md-12">
					<div class="fh5co-feature animate-box fadeInLeft animated" data-animate-effect="fadeInLeft">
						<div class="fh5co-icon">
							<i class="icon-circle-compass"></i>
						</div>
						<div class="fh5co-text">
							<h3>TERMINOS Y CONDICIONES</h3>
							<p>
								<!-- Aqui Términos y Condiciones de ${titulo} -->
							` + this.detalle3 +  `
							</p>
						</div>
					</div>
				</div>
			</div>

			`;
	}

	if (op==4) {
		newDetalle = `
		<br>
		<div class="row">
			<div class="col-md-12">
				<div class="fh5co-feature animate-box fadeInLeft animated" data-animate-effect="fadeInLeft">
					<div class="fh5co-icon">
						<i class="icon-tools-2"></i>
					</div>
					<div class="fh5co-text">
						<h3>PASOS A SEGUIR</h3>
						<p>
						<!-- 	Aqui Pasos a Seguir de ${titulo} -->
						`+ this.detalle4 +`
						</p>
					</div>
				</div>
			</div>
		</div>


	
			`;
	}

	newDetalle += `

			<hr>
			<div class="float-right"> <small>italfox.com</small></div><br>
	`;



	$('#copy_detalle').html(newDetalle);
	paginaInfoAbajo(titulo);
}
 


function paginaInfoAbajo(mensaje){

	let newMenssage = `
		
		<div class="alert alert-primary" role="alert">
			<small>
				${mensaje}
			</small>		
		</div>	
		<hr>
	`;

	this.newMenssage = `
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb">
			<li class="breadcrumb-item">
				<a href="javascript:call_main()">HOME</a></li>
			<li	class="breadcrumb-item active" aria-current="page">${mensaje}</li>
			</ol>
		</nav>	
	
	`;


	$('#div_piePagina').html(this.newMenssage);
}

function call_opcion_pasar()
{
	htm_datos = `
	Pasando...	
 	
	`;
	$('#main_pagina').html(htm_datos);
	paginaInfoAbajo("Pasar cuentas de Fondeo");
	 
}

 
 
 

 