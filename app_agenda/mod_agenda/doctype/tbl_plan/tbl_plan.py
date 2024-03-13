# Copyright (c) 2023, ING GUSTAVO YANCHA and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class tbl_plan(Document):
	pass

@frappe.whitelist(allow_guest=True)
def get_planes():
	
	sql = "select name, plan_nombre, plan_detalle1, plan_detalle2, plan_detalle3, plan_imagen  from tabtbl_plan "
	
	lista =  frappe.db.sql (sql, as_dict=True)
	for row in lista :
		sqld = """ select  max(plad_capital) , 
		min(plad_capital)
		  from tabtbls_plan_detalle 
		   where parent= '{0}' order by  1 """.format(row.name)
		lstvalores = frappe.db.sql(sqld)
	
		sqld = """ select   plad_capital  	 
		  from tabtbls_plan_detalle 
		   where parent= '{0}' order by  1 """.format(row.name)
		lstvalores2 = frappe.db.sql(sqld)

		maximo = lstvalores[0][0]
		minimo = lstvalores[0][1]
		row["maximo"] = maximo 
		row["minimo"] = minimo
		row["valores"] = lstvalores2
		row["texto"] =  """  Desde: ${1} Hasta: ${0} """.format(maximo, minimo)
	return lista 