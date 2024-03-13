# Copyright (c) 2023, ING GUSTAVO YANCHA and contributors
# For license information, please see license.txt

#
import frappe
from frappe.model.document import Document
from datetime import date, datetime
from frappe.utils import add_days,getdate ,get_datetime
class tbl_retiro(Document):
	def validate(self):
		# frappe.throw("reti_tipo_retiro: {0}  tbl_cliente: {1}".format(self.reti_tipo_retiro, self.tbl_cliente ))
	
		# frappe.throw("{0}".format(self.reti_aprobado_admin))
		# if not self.reti_aprobado_admin==False :
		# 	frappe.throw("retiro_tipo_retiro{0}".format(self.reti_tipo_retiro))

		if verificaSIExiste(self.reti_tipo_retiro , self.tbl_cliente) > 0:
			if self.reti_aprobado_admin == 0 :
				frappe.throw("Usted ya tiene una solicitud de retiro pendiente")

		# frappe.throw("self.reti_tipo_retiro {0}".format(self.reti_tipo_retiro))
		if self.reti_tipo_retiro == 'INTERES':
			existe = frappe.db.exists("tbl_cliente_plan", {"cliplan_estado" :'APROBADO',"tbl_cliente":self.tbl_cliente,"tbl_plan": self.tbl_plan })
			if existe:
				cliplan = frappe.get_doc("tbl_cliente_plan", {"cliplan_estado" :'APROBADO',"tbl_cliente":self.tbl_cliente,"tbl_plan": self.tbl_plan })
				if  getdate(datetime.now()) < getdate(cliplan.cliplan_fecha_retmin):
					frappe.throw("Usted puede solicitar retiro desde:" + str(cliplan.cliplan_fecha_retmin) )

			saldo = getSaldoRendimiento(self.tbl_plan, self.tbl_cliente)
			saldo_final = saldo - float(self.reti_valor)
			if saldo_final < 0:
				frappe.throw("Saldo insuficiente, valor maximo: ${0}".format(saldo))

		# def noupdate(self):
		# frappe.throw("retiro_tipo_retiro{0}".format(self.reti_tipo_retiro))
		if self.reti_tipo_retiro == 'CAPITAL': 
				# frappe.throw("Cerrar Plan definitivamente ?")
				sql = """ UPDATE tabtbl_cliente_plan
							set cliplan_estado =	'CAPITAL RETIRADO', 
								cliplan_activo=0  
							where 	tbl_plan	= '{0}' 
							AND  	tbl_cliente = '{1}' 
							and 	cliplan_estado = 'APROBADO'   
					""".format(self.tbl_plan, self.tbl_cliente)
				
				frappe.db.sql(sql)
				
				sql = """
						UPDATE tabtbl_estado_cuenta
						SET estc_eliminar	= 1
						where 	estc_plan 	= '{0}' 
						AND  	tbl_cliente = '{1}'  
					""".format(self.tbl_plan, self.tbl_cliente)
				# frappe.throw(sql)
				frappe.db.sql(sql)

				sql = """
					DELETE FROM tabtbl_estado_cuenta
						where 	estc_plan 	= '{0}' 
						AND  	tbl_cliente = '{1}'  
						AND estc_eliminar				
					""".format(self.tbl_plan, self.tbl_cliente)
				frappe.db.sql(sql)

	@frappe.whitelist()
	def procesar(self):
		retiro = frappe.get_doc("tbl_retiro",self.name)
		retiro.reti_aprobado_admin	= 1
		retiro.reti_estado	 		="APROBADO"
		retiro.reti_fecha_re 		= datetime.now()
		retiro.save()
		return "Procesado correctamente"


def verificaSIExiste(tipo, cliente):
	sql = """ 
		select count(*) from tabtbl_retiro 
		where 	reti_tipo_retiro 	= '{0}' 
		and 	reti_estado 		= 'SOLICITADO' 
		and 	tbl_cliente 		= '{1}' 
		""".format(tipo,cliente)
	return frappe.db.sql(sql)[0][0]

def getSaldoRendimiento(plan, cliente):
    sql_retiro 	= """ select IFNULL(sum(reti_valor),0)  from tabtbl_retiro 			where tbl_cliente = '{0}' and reti_estado  	= 'APROBADO'  and tbl_plan = '{1}' """.format(cliente, plan)

    sql_rend 	= """ select IFNULL(sum(estc_valor),0)  from tabtbl_estado_cuenta 	where tbl_cliente = '{0}' and estc_plan 	= '{1}'  """.format(cliente, plan)

    retiros =  frappe.db.sql(sql_retiro)[0][0]
    rendi 	=  frappe.db.sql(sql_rend)[0][0]
    return rendi - retiros 

