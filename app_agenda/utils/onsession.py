import frappe 
from  app_agenda.mod_cliente.page.pagina_planes.pagina_planes  import falta_llenar_datos
def irapagina(): 
    #frappe.throw(str(frappe.session.data.user))
    if frappe.session.data.user!='Administrator':
        roles = frappe.get_roles(frappe.session.user)
        esCliente=False
        if 'CLIENTE' in roles:
            esCliente = True 
    

        if esCliente:
            
            frappe.local.response["home_page"] = "app/pag_cliente"
            """ 
            cliente = frappe.get_doc("tbl_cliente", {"cli_correo":frappe.session.user })
            #verifica si lleno datos
            fld = falta_llenar_datos()
            fld = 1
            if fld >=0:
                frappe.local.response["home_page"] = "app/tbl_cliente/"+cliente.name
            
            else:
                
                sql =" select count(tbl_cliente) from tabtbl_cliente_plan   where tbl_cliente = '{0}'   ".format(cliente.name)
                
                tiene_planes = frappe.db.sql(sql)[0][0]
                if int(tiene_planes) == 0:
                    
                    frappe.local.response["home_page"] = "app/pagina_planes"

                else:
                    frappe.local.response["home_page"] = "app/menu_cliente"
            """


        