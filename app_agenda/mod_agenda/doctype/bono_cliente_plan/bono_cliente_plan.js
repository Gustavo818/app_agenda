// Copyright (c) 2023, ING GUSTAVO YANCHA and contributors
// For license information, please see license.txt


frappe.ui.form.on('bono_cliente_plan', {
	refresh: function(frm) {
		frm.set_df_property('cliplan_capital', 'read_only', 1)
		frm.set_df_property('cliplan_fecha_ini', 'read_only', 1)
		frm.set_df_property('cliplan_fecha_retmin', 'read_only', 1)
		frm.set_df_property('cli_billetera', 'read_only', 1)
		frm.set_df_property('datos_roi', 'read_only', 1)
		frm.set_df_property('interes_ganado', 'read_only', 1)
		frm.set_df_property('lista_referidos', 'read_only', 1)
		if 	(!frm.doc.bono_archivar){
			frm.set_intro('Seleccione Cliente, Seleccione un Plan; Verificar valor Capital cliente Referido; usar botones: Agregar / Eliminar ', 'blue');
		}
		
		if 	(frm.doc.bono_archivar)	
		{
			frm.set_intro('Procesado', 'blue');
			frm.set_df_property('valor_porcentaje', 'read_only', 1)
			frm.set_df_property('valor_capital', 'read_only', 1)
			frm.set_df_property('valor_bono', 'read_only', 1)
			frm.set_df_property('fecha_registro', 'read_only', 1)

			frm.set_df_property('cliente', 'read_only', 1)
			frm.set_df_property('plan', 'read_only', 1)

			frm.set_df_property('add_bono', 'read_only', 1)
			frm.set_df_property('delete_bono', 'read_only', 1)
		}		
	},
	before_save: function(frm){
		getConsulta(frm);
	},
	cliente: function(frm) { 
		getConsulta(frm)
	},
	plan: function(frm) { 
		getConsulta(frm)
	},
	add_bono: function(frm) { 
		fun_add_bono(frm);
	},
	delete_bono: function(frm) {
		fun_delete_bono(frm)
	},
	update_plan: function(frm) {
		getConsulta(frm);
	},
	valor_capital(frm)
	{
		frm.doc.valor_bono	= frm.doc.valor_capital * frm.doc.valor_porcentaje / 100 ;
		refresh_field("valor_bono")
	},
	valor_porcentaje(frm)
	{
		frm.doc.valor_bono	= frm.doc.valor_capital * frm.doc.valor_porcentaje / 100 ;
		refresh_field("valor_bono")
	}	

})


function fun_delete_bono(frm){
	let valor_bono = frm.doc.valor_bono;
	frappe.call({
		doc: cur_frm.doc,
		freeze: true,
		freeze_message: "Procesando...",
		method: "delete_bono",
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
 


function fun_add_bono(frm){
	let valor_bono = frm.doc.valor_bono;
	frappe.call({
		doc: cur_frm.doc,
		freeze: true,
		freeze_message: "Procesando...",
		method: "add_bono",
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
 



function getConsulta(frm){
	let cliente = frm.doc.cliente;
	let plan	= frm.doc.plan;
	// if (!plan)
	// 	frappe.throw("Seleccione plan");
	
	// if (!cliente)
	// 	frappe.throw("Seleccione Cliente ");

	if (cliente && plan)  {
		// Detalle Plan
		// frappe.call({
		// 	method: "app_agenda.mod_agenda.doctype.bono_cliente_plan.bono_cliente_plan.getconsulta", 
		// 	freeze: true,	
		// 	args: {cliente: cliente, plan: plan}
		// }).done((r) => {
		// 	// console.log(r.message)
		// 	let entry =''
		// 	let interes_ganado = 0
		// 	$.each(r.message, function(_i, e){
		// 		entry 			+= e.estc_detalle + "\n" ;
		// 		interes_ganado 	+= e.estc_valor
 		// 	})
		// 	frm.doc.datos_roi 		= entry
		// 	frm.doc.interes_ganado 	= interes_ganado
		// 	frm.refresh();
		// })			
		// Detalle Plan
		frappe.call({
			method: "app_agenda.mod_agenda.doctype.bono_cliente_plan.bono_cliente_plan.getconsulta", 
			freeze: true,	
			args: {cliente: cliente, plan: plan}
		}).done((r) => {
			// Cargar Datos Roi			
			let entry =''
			let interes_ganado = 0
			let consultaPlan = r.message.consultaPlan
			console.log("consultaPlan")
			console.log(consultaPlan)
			$.each(consultaPlan, function(_i, e){
				entry 			+= e.estc_detalle + "\n" ;
				interes_ganado 	+= e.estc_valor
 			})
			frm.doc.datos_roi 		= entry
			frm.doc.interes_ganado 	= interes_ganado

			// Cargar Lista de Referidos
			let lista_referidos =''
			let consultaReferidos = r.message.consultaReferidos
			console.log("lista_referidos")
			console.log(consultaReferidos)
			$.each(consultaReferidos, function(_i, e){
				lista_referidos += "[ " + e.cliplan_fecha_ini + " ] " 
								+ e.cli_nombrecompleto 
								+ " [ " 		+ e.plan_nombre + " ] "
								+ " Capital : " + e.cliplan_capital
								+ "\n";
 			})
			frm.doc.lista_referidos	= lista_referidos
			frm.refresh();
		})		
	}
	get_cargar_datos_plan(frm);
}


 


function get_cargar_datos_plan(frm){
	let cliente = frm.doc.cliente;
	let plan	= frm.doc.plan;
 
	frm.doc.cliplan_capital		= null
	frm.doc.cliplan_fecha_ini	= null
	frm.doc.cliplan_fecha_retmin= null
	frm.doc.cli_billetera		= ""

	if (cliente && plan)  {
		// Detalle Plan
		frappe.call({
			method: "app_agenda.mod_agenda.doctype.bono_cliente_plan.bono_cliente_plan.getCargarDatosPlan", 
			freeze: true,	
			args: {cliente: cliente, plan: plan}
		}).done((r) => {
			console.log("get_cargar_datos_plan : ")
			// console.log(r.message)
			r.message.forEach(value=> {
				frm.doc.cliplan_capital			= value.cliplan_capital;
				frm.doc.cliplan_fecha_ini		= value.cliplan_fecha_ini;
				frm.doc.cliplan_fecha_retmin	= value.cliplan_fecha_retmin;
				frm.doc.cli_billetera			= value.cli_billetera;
			});
			frm.refresh();
		})
	}
	
} 