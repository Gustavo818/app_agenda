from __future__ import unicode_literals
from datetime import datetime
import frappe
import random
import string
import requests
import uuid
sitemap = 1

def get_context(context):
    context.show_search = True
    context.allow_guest = True
    context.no_breadcrumbs = True
    

@frappe.whitelist(allow_guest=True)
def register_member(incorreo,innombre,incuenta, inuserref):
    existeUsuario=frappe.db.exists('User',incorreo)
    existeUsuarionom=frappe.db.exists('User',{'username':innombre})
    existeUsuarioReferido = frappe.db.exists('User',{'username':inuserref})
    if existeUsuarionom :
        frappe.throw("El nombre usuario "+innombre+" ya existe")
    
    if inuserref :
        if not existeUsuarioReferido :
            frappe.throw("Nick usuario Referido "+inuserref+" no existe")
            
     
    if not existeUsuario:
        habilitar_pruebas = frappe.db.get_single_value("parametros_app","habilitar_pruebas") or False
        usuario = frappe.new_doc('User')
        usuario.username=innombre
        usuario.email = incorreo
        usuario.first_name =innombre
        usuario.last_name = ''
        usuario.full_name = innombre
        usuario.flags.no_welcome_mail = True
        claveg =  get_random_string()
        if habilitar_pruebas == False :
            usuario.new_password = claveg
        else:
            usuario.new_password = "xBxRfu5y3o"
        #usuario.module_profile="cliente"
        
        usuario.role_profile_name= "CLIENTE"
        usuario.module_profile="CLIENTE"

        usuario.insert(ignore_permissions=True)
        usuario.add_roles("CLIENTE")   
    
        cliente = frappe.new_doc("tbl_cliente")
        cliente.cli_usuario = innombre
        cliente.cli_pais = 'Ecuador'

        cliente.cli_correo = incorreo  
        cliente.cli_user_referencia = inuserref
        

        # ->
        n_series    = uuid.uuid4()
        cliente.x_naming_series = n_series
        # <-

        cliente.insert(ignore_permissions=True)
        
			
        if habilitar_pruebas == False :
            frappe.sendmail(recipients=incorreo,
                cc=[],
                subject="Bienvenido a la plataforma de inversiones",
                message='Estimado/a '+innombre + '\n\n' + 'su cuenta ha sido creada con exito.\n\n' + 'Su usuario es: ' + incorreo + '\n\n' + 'Su contraseña es:' +claveg + '\n\n' + ' Por favor cambiela al ingresar al sistema.',
                                
                ) 

        return cliente       
    else:
        frappe.throw("El correo ya existe")

 

def get_random_string():
    # choose from all lowercase letter
    letters = string.ascii_uppercase
    result_str = ''.join(random.choice(letters) for i in range(3))
    result_str += ''.join(random.choice(string.ascii_lowercase) for i in range(3))
    #frappe.throw(result_str)
    return result_str