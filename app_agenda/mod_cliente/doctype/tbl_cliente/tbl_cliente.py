# Copyright (c) 2023, ING GUSTAVO YANCHA and contributors
# For license information, please see license.txt
 
import frappe
from frappe.model.document import Document


import frappe
from frappe.model.document import Document
 

class tbl_cliente(Document):


	def validate(self):
		if self.cli_apellidos and self.cli_nombres:
			self.cli_nombrecompleto = self.cli_apellidos +" "+ self.cli_nombres
 
	# def apply_fieldlevel_read_permissions(self):
	# 	cli_activo = False
		# """Remove values the user is not allowed to read (called when loading in desk)"""
		# if frappe.session.user == "Administrator":
		# 		return
		# cli_activo = False

	def get_datos(self):
		return "Hola " + self.cli_nombrecompleto

	def get_datos2(self):
		return "Hola " + self.name

	def get_cliente_planes(self):
		sql = """ select DISTINCT  estc_plan , estc_capital , plan_nombre from 
				tabtbl_estado_cuenta 
		 		where tbl_cliente ='{0}'  """.format(self.name)
		lstPlanes = frappe.db.sql(sql,as_dict=True)	
		return lstPlanes

	# def getPlan(plan, cliente):
	def getPlan(self):
		sql =   """
				select tbl_plan
						, tbl_cliente 
						, plan_nombre 
						, cliplan_capital 
						, cliplan_fecha_ini 
						, cliplan_fecha_retmin
						, cliplan_activo
						from tabtbl_cliente_plan 
					where 	cliplan_estado 	= 'APROBADO' 
					and 	tbl_plan		= '{0}'
					and 	tbl_cliente		= '{1}'
					and 	cliplan_activo                
					""" .format('PLAN-00001','CLI-2023-00008' )
		unPlan = frappe.db.sql(sql,as_dict=True)	
		return unPlan


	# @frappe.whitelist()
	# def getDetallePlan(plan, cliente):
	def getDetallePlan(self):
		sql =   """
				select *    from tabtbl_estado_cuenta ec
				where 	ec.estc_plan  	='{0}'
				and 	ec.tbl_cliente 	='{1}' 	              
				""" .format('PLAN-00001', 'CLI-2023-00008')
		detalle = frappe.db.sql(sql,as_dict=True)	
		return detalle

	@frappe.whitelist()
	def actualizar(self):
		 
		res = "Pasword / Confirmación; no son iguales"
		if (self.cli_password_new == self.cli_password_confi) :

			name_correo = self.cli_correo

			data = frappe.get_doc('User', name_correo)
			# frappe.throw(data.new_password )
			data.new_password = self.cli_password_new
			# res = data.new_password
			# console.log(data.new_password )
			# Guardar un documento en la base de datos
			data.save(ignore_permissions=True)

			res = "Su clave, se ha actualizado correctamente"	
			self.cli_password_new		= ''
			self.cli_password_confi		= ''
		
		self.save()
		
		return res
		



         
 
@frappe.whitelist() 
def getTieneROI():
    user    = frappe.session.user
    profile = frappe.db.get_value("User", user, "username")
    cliente = frappe.db.get_value("tbl_cliente",{"cli_usuario":profile},'name')
    # plan =  frappe.db.get_value("tbl_plan",{"plan_nombre":plan},'name') 
    sql =   """
                select IFNULL(count(ec.tbl_cliente),0 ) as registros  
				from tabtbl_estado_cuenta ec 
				where ec.tbl_cliente = '{0}'
                """ .format(cliente)

    res = frappe.db.sql(sql)[0][0]
    return res
         

@frappe.whitelist()
def getIsAdministrator():
	user = frappe.session.user
	res = 0
	if user == "Administrator":
		res=1
	return res




