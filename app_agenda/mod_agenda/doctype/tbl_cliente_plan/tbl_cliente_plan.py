# Copyright (c) 2023, ING GUSTAVO YANCHA and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import add_days, getdate
class tbl_cliente_plan(Document):
	def validate(self):
		if self.cliplan_estado == 'SOLICITADO':
			if self.cliplan_fecha_con and self.cliplan_fecha_ini:
				if self.cliplan_fecha_ini < self.cliplan_fecha_con:
					frappe.throw("La fecha de inicio no pude ser menor a la fecha de confirmación")
				
				self.cliplan_estado = 'APROBADO'
				self.cliplan_fecha_utimogenerado =  self.cliplan_fecha_ini
				plan = frappe.get_doc("tbl_plan",self.tbl_plan)
				dias = plan.plan_dias_retiro
				self.cliplan_fecha_retmin =  add_days(self.cliplan_fecha_ini, dias)
