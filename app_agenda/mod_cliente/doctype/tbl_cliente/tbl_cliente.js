// Copyright (c) 2023, ING GUSTAVO YANCHA and contributors
// For license information, please see license.txt
 
  

frappe.ui.form.on('tbl_cliente', { 
	// refresh: function(frm) {

	// }
 
	btm_actualizar: function(frm) {
		fun_actualizar();
	},
	
 
	refresh: function(frm) { 
		getIsAdministrator(frm)
		getTieneROI(frm)
	}
	
	// ,
	// onload: function(frm) {
	// 	var cli_key = frm.doc.cli_key;
	// 	frm.set_df_property('cli_key', 'read_only', 1)
	// 	if (cli_key==''){
			
	// 		// Generate a random six-digit number
	// 		var randomSixDigitNumber = Math.floor(Math.random() * 900000) + 100000;

	// 		// Log the random number to the console
	// 		console.log(randomSixDigitNumber);
			
	// 		var cod = randomSixDigitNumber.toString();
	// 		cur_frm.set_value('cli_key', cod);
	// 	}
    // }

});	



function fun_actualizar(){

	frappe.call({
		doc: cur_frm.doc,
		freeze: true,
		freeze_message: "Actualizando...",
		method: "actualizar",
		callback: (r) => {
			frappe.msgprint({
				title: __('Notification'),
				indicator: 'green',
				message: r.message
			});
			cur_frm.reload_doc();
			// console.log(doc)
		},
	});


}



function getTieneROI(frm){
	frappe.call({
		method: "app_agenda.mod_cliente.doctype.tbl_cliente.tbl_cliente.getTieneROI",
		freeze: true,	 
		callback: (r) => {	
			let registros = r.message;	
			if (registros>0) {
				console.log("ROI: ",registros)
				// frm.set_df_property('cli_activo', 'read_only', 1)
				frm.set_df_property('cli_dni', 'read_only', 1)
				frm.set_df_property('cli_apellidos', 'read_only', 1)
				frm.set_df_property('cli_ciudad', 'read_only', 1)
				frm.set_df_property('cli_nombres', 'read_only', 1)
				frm.set_df_property('cli_pais', 'read_only', 1)
				// frm.set_df_property('cli_foto', 'read_only', 1)
				// frm.set_df_property('cli_documento', 'read_only', 1)
			}
			// return(registros);
			}, 

	});
}

function getIsAdministrator(frm){ 
	frappe.call({
		method: "app_agenda.mod_cliente.doctype.tbl_cliente.tbl_cliente.getIsAdministrator",
		freeze: true,	 
		callback: (r) => {	
			let estado = r.message;	
			console.log("user: ", estado)
			if (estado == 0) {
				frm.toggle_display(['cli_activo'], 0);
				// frm.toggle_display(['cli_activo', 'cli_apellidos'], estado);
			}
			
			// return(registros);
			}, 

	});
}