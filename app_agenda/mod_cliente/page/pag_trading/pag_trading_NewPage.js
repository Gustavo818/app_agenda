// frappe.pages['pag_trading'].on_page_load = function(wrapper) {
// 	var page = frappe.ui.make_app_page({
// 		parent: wrapper,
// 		title: 'pag_trading4',
// 		single_column: true
// 	});
// }

// frappe.pages['pag_trading'].on_page_load = function(wrapper) {
// 	var page = frappe.ui.make_app_page({
// 		parent: wrapper,
// 		single_column: true
// 	});
 
// 	page.main.html(frappe.render_template("pag_trading", {}));

 
//  }

//  function paginaInicio(){
// 	location.href = "/app/pag_cliente"; 
// }


frappe.pages['pag_trading'].on_page_load = function(wrapper){
	new MyPage(wrapper);
}

	//PAGE CONTENT
	MyPage = Class.extend({
		init: function(wrapper){
		this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: 'Página Trading',
			single_column: true
		});
		// make page
		this.make();
	},
	//make page
	make: function(){
		//grab the class
		let me = $(this);
		// body content 
		// let body =`<h1>Hola Mundo </h1>`;

		//formato numero
		let currency = function currency(n){
			let money = new Intl.NumberFormat("de-DE", 
			{ style: "currency", currency: "USD" }).format(n);
			return money
			}



		//get total
		let total=function(){
			frappe.call({
				method: "app_agenda.mod_cliente.page.pag_trading.pag_trading.get_total_price",
				callback: function(r){
					//code snippet
					// console.log(r)
					//set precio
					// $("#total-precio")[0].innerText = currency(r.message);
					$('#total-precio').html(currency(r.message));
				}
			})
		}
		//push dom to the page
		$(frappe.render_template(frappe.state_app_page.body, this)).appendTo(this.page.main)

		//execute function
		total();


		//refresh total
		document.querySelector("#refresh-total").addEventListener('Click',
		()=>{
			console.log("refresh clicked ")
			total();
		})


	}
	//end of class

})


let body =`

		<button id ="refresh-total" type="button" class="btn btn-primary">Primary</button>
		

		<div class="alert alert-primary" role="alert">
		This is a primary alert—check it out!
		</div>


		<div class="card-deck">
		<div class="card">
			<img class="card-img-top" src="/assets/app_agenda/lib_app_agenda/img/intro/italfox.png" style="width:400px; height:300px " alt="Card image cap">
			<div class="card-body">
			<h5 class="card-title">Card title</h5>
			<p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
			</div>
			<div class="card-footer">
			<small class="text-muted">Last updated 3 mins ago</small>
			</div>
			<div class="number" style:"color:blue" id="total-precio">
			0
			</div>
		</div>
		<div class="card">
			<img class="card-img-top" src="/assets/app_agenda/lib_app_agenda/img/intro/italfox.png" style="width:400px; height:300px " alt="Card image cap">
			<div class="card-body">
			<h5 class="card-title">Card title</h5>
			<p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
			</div>
			<div class="card-footer">
			<small class="text-muted">Last updated 3 mins ago</small>
			</div>
		</div>
		<div class="card">
			<img class="card-img-top" src="/assets/app_agenda/lib_app_agenda/img/intro/italfox.png" style="width:400px; height:300px " alt="Card image cap">
			<div class="card-body">
			<h5 class="card-title">Card title</h5>
			<p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
			</div>
			<div class="card-footer">
			<small class="text-muted">Last updated 3 mins ago</small>
			</div>
		</div>
		</div>


	<hr>

	 

	 		
`;
// html content
frappe.state_app_page = {
	body:body
}
