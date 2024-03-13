# Copyright (c) 2023, ING GUSTAVO YANCHA and contributors
# For license information, please see license.txt

# import frappe

import frappe
from datetime import date, datetime
from frappe.model.document import Document
from frappe.utils import add_days,getdate ,get_datetime

class bono_cliente_plan(Document):
	@frappe.whitelist()
	def add_bono(self): 
		existe = frappe.db.exists("tbl_estado_cuenta",{"id_bono": self.name})
		if (existe) :
			frappe.throw("Ya esta registrado, id_bono: " + self.name)
		
		day_abbr 		= ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"]
		day_payments 	= ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"]
		mes_abbr 		= [ "","Enero", "Febreo", "Marzo", "Abril", "Mayo", "Junio", "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

		sql =  """
				select   p.name , tbl_cliente, cliplan_capital ,
					cliplan_rendimiento , cliplan_fecha_utimogenerado , tbl_plan ,
					cliplan_estado , c.cli_nombrecompleto ,plan_nombre ,cliplan_porcentaje
				from tabtbl_cliente_plan  p inner join tabtbl_cliente c on ( c.name = p.tbl_cliente)
				where 	tbl_cliente ='{0}' 
				and 	tbl_plan 	='{1}'
				and 	p.cliplan_activo 
				""".format(self.cliente, self.plan)
		lst = frappe.db.sql(sql, as_dict =True)
		
		for row in lst:
			fecha_i 		=  getdate(datetime.now()) 
			fecha_actual 	= getdate(datetime.now())
			fecha_actual 	= getdate(datetime.now())
			day_name 		= day_abbr[fecha_i.weekday()]
			mes_name 		= mes_abbr[fecha_i.month] 
			dia 			= fecha_i.day
                
			ec                  = frappe.new_doc("tbl_estado_cuenta")
			ec.estc_fecha       = fecha_i
			ec.tbl_cliente      = self.cliente
			ec.cliente_nombre   = row.cli_nombrecompleto
			ec.estc_plan        = row.tbl_plan
			ec.plan_nombre      = row.plan_nombre
			ec.estc_capital     = row.cliplan_capital
			ec.plan_porcentaje  = row.cliplan_porcentaje
			ec.id_cliente_plan  = row.name
			ec.id_bono			= self.name
			valor 				= self.valor_bono
			ec.estc_valor 		=   round(valor,2)
			ec.estc_detalle = """ {0} {1} de {3} del {4}, BONO ${2} """.format(day_name,dia,valor,mes_name,fecha_i.year)
			ec.estc_detalle_html = """ <p style="text-align:center"><span style="font-size:18px"><span style="font-family:Calibri,sans-serif"><strong><span style="font-family:&quot;Georgia&quot;,serif">{0}  </span></strong><span style="font-family:&quot;Georgia&quot;,serif"> {1} de {3} del {4}, BONO <strong><span style="color:#385623">${2}</span></strong></span></span></span></p> """.format(day_name,dia,valor,mes_name,fecha_i.year)
			ec.insert()
			
			# frappe.throw("cliente: " + self.cliente + " plan: " + self.plan +" valor_bono: $"+str(self.valor_bono))
		resultado = "Procesado correctamente"
		return resultado

	@frappe.whitelist()
	def delete_bono(self):

		existe = frappe.db.exists("tbl_estado_cuenta",{
			"id_bono": self.name
		})
		if (not existe) :
			frappe.throw("No existe este registrado, id_bono: " + self.name)
		
		frappe.db.delete("tbl_estado_cuenta", {
			"id_bono": self.name
		})

		resultado = "Eliminado, correctamente"
		return resultado


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

	return  {
		"consultaPlan"		: consultaPlan, 
		"consultaReferidos"	: consultaReferidos
	}

 