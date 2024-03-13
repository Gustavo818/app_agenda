// Copyright (c) 2023, ING GUSTAVO YANCHA and contributors
// For license information, please see license.txt

frappe.ui.form.on('tbl_auditoria', {
	// refresh: function(frm) {

	// }
});

frappe.ui.form.on("tbl_auditoria_detalle", {
	ingreso(frm, cdt, cdn) {
		total_auditoria_detalle();
	},
	egreso(frm, cdt, cdn) {
		total_auditoria_detalle();
	} 
});

function total_auditoria_detalle() {
	var t_ingreso 	= 0;
	var t_egreso	= 0;
	$.each(cur_frm.doc.tbl_auditoria_detalle, function (i, row) {	
		t_ingreso += row.ingreso;		 
		t_egreso +=  row.egreso;
	});

 
	cur_frm.doc.total_ingresos 	= t_ingreso;
	cur_frm.doc.total_egresos 	= t_egreso;

	cur_frm.doc.saldo = t_ingreso -  t_egreso;
	
	cur_frm.refresh_field('total_ingresos');
	cur_frm.refresh_field('total_egresos');
	cur_frm.refresh_field('saldo');
	
}