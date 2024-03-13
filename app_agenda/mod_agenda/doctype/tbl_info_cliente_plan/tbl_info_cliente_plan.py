# Copyright (c) 2023, ING GUSTAVO YANCHA and contributors
# For license information, please see license.txt

# # import frappe
# from frappe.model.document import Document

# class tbl_info_cliente_plan(Document):
# 	pass



import frappe
from datetime import date, datetime
from frappe.model.document import Document
from frappe.utils import add_days,getdate ,get_datetime

# class tbl_info_cliente_plan(Document):

	# @frappe.whitelist()
	# def delete_bono(self):

	# 	existe = frappe.db.exists("tbl_estado_cuenta",{
	# 		"id_bono": self.name
	# 	})
	# 	if (not existe) :
	# 		frappe.throw("No existe este registrado, id_bono: " + self.name)
		
	# 	frappe.db.delete("tbl_estado_cuenta", {
	# 		"id_bono": self.name
	# 	})

	# 	resultado = "Eliminado, correctamente"
	# 	return resultado


@frappe.whitelist()
def getCargarDatosPlan(cliente, plan) :
	sql = """ 
		select   p.name , tbl_cliente, cliplan_capital ,
				cliplan_rendimiento , cliplan_fecha_utimogenerado , tbl_plan ,
				cliplan_estado , c.cli_nombrecompleto ,plan_nombre ,cliplan_porcentaje
				, c.cli_billetera, p.cliplan_fecha_ini , p.cliplan_fecha_retmin  
		from 	tabtbl_cliente_plan  p inner join tabtbl_cliente c on ( c.name = p.tbl_cliente)
		where 	tbl_cliente ='{0}' 
		and 	tbl_plan 	='{1}' 
		and 	p.cliplan_activo 	
		""".format(cliente, plan)
	datosplan = frappe.db.sql(sql, as_dict=True)			
	return datosplan


@frappe.whitelist()
def getconsulta(cliente, plan) :

	sql = """ 
			select    ec.name
					, ec.tbl_cliente
					, ec.estc_fecha    
					, ec.cliente_nombre 
					, ec.estc_plan
					, ec.plan_nombre 
					, ec.estc_capital
					, ec.plan_porcentaje
					, ec.estc_valor
					, ec.estc_detalle
					, ec.estc_retirado
					, ec.estc_detalle_html
					, ec.name
					, ec.estc_eliminar
					, ec.id_cliente_plan
			from tabtbl_estado_cuenta ec
			where 	ec.tbl_cliente 	='{0}'
			and 	ec.estc_plan  	='{1}' 	
		""".format(cliente, plan)
	consultaPlan = frappe.db.sql(sql, as_dict=True)		

	cli_usuario = frappe.db.get_value("tbl_cliente",{"name":cliente},'cli_usuario')
	sql = """ 
			select 	IFNULL(cp.cliplan_fecha_ini,'No Procesado') as  cliplan_fecha_ini
					, c.cli_nombrecompleto
					, cp.cliplan_capital
					, cp.plan_nombre   
			from tabtbl_cliente c 
			inner join tabtbl_cliente_plan cp on cp.tbl_cliente  = c.name 
			where 	c.cli_user_referencia =  '{0}' 
			and     cp.cliplan_con_referido 
		""".format(cli_usuario)
	consultaReferidos = frappe.db.sql(sql, as_dict=True)	


	sql = """ 
			select    count(id_bono)
					, IFNULL(id_bono,'BONO-000') as id_bono
			from tabtbl_estado_cuenta ec
			where 	ec.tbl_cliente 	='{0}'
			and 	ec.estc_plan  	='{1}' 	
			and 	ec.id_bono		<>''
		""".format(cliente, plan)
	cantidad = frappe.db.sql(sql)[0][0]
	id_bono = frappe.db.sql(sql)[0][1]
	# if cantidad = 0:
	# 	id_bono ='BONO-000'
	
	sql = """
		SELECT    fecha_registro
				, valor_capital
				, valor_porcentaje
				, valor_bono 
		FROM tabbono_cliente_plan x
		WHERE name = '{0}'		
		""".format(id_bono)
	consultaBono = frappe.db.sql(sql, as_dict=True)	
	# frappe.throw(sql)	
	
	return  {
		"consultaPlan"		: consultaPlan, 
		"consultaReferidos"	: consultaReferidos,
		"consultaBono"		: consultaBono
	}

 
