import frappe
from datetime import date, datetime
from app_agenda.mod_cliente.page.pagina_planes.pagina_planes  import falta_llenar_datos
import uuid

@frappe.whitelist( )
def get_estado_cuenta():
    user = frappe.session.user
    profile = frappe.db.get_value("User", user, "username")
    cliente =frappe.db.get_value("tbl_cliente",{"cli_usuario":profile},'name')

    objCliente = frappe.get_doc("tbl_cliente",cliente)
        
    
    return { "cliente" : objCliente  }
