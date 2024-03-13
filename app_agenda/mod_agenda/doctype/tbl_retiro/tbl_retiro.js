// Copyright (c) 2023, ING GUSTAVO YANCHA and contributors
// For license information, please see license.txt

frappe.ui.form.on('tbl_retiro', {
	// refresh: function(frm) {

	// }

	procesar: function(frm) {
		fun_procesar();
	} 
	
 
});


function fun_procesar(){

	frappe.call({
		doc: cur_frm.doc,
		freeze: true,
		freeze_message: "Procesando...",
		method: "procesar",
		callback: (r) => {
			frappe.msgprint({
				title: __('Notification'),
				indicator: 'green',
				message: r.message
			});
			cur_frm.reload_doc();
			console.log(doc)
		},
	});


}
