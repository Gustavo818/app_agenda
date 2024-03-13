import frappe 

def tbl_cliente_plan(user):
    cliente=get_cliente(user)
    if cliente:
        return """(tbl_cliente = '{0}')""".format(cliente)

def tbl_cliente(user):
    cliente=get_cliente(user)
    if cliente:
        return """(name = '{0}')""".format(cliente)

def tbl_estado_cuenta(user):
    cliente=get_cliente(user)
    if cliente:
        return """(tbl_cliente = '{0}')""".format(cliente)

def tbl_retiro(user):
    cliente=get_cliente(user)
    if cliente:
        return """(tbl_cliente = '{0}')""".format(cliente)

def rep_solicitud_retiros(user):
    cliente=get_cliente(user)
    if cliente:
        return """(tbl_cliente = '{0}')""".format(cliente)

def archivos(user):
    cliente=get_cliente(user)
    if cliente:
        return """(attached_to_name = '{0}')""".format(cliente) 

def get_cliente(user):
    if not user: user = frappe.session.user
    profile = frappe.db.get_value("User", user, "username")
    cliente =frappe.db.get_value("tbl_cliente",{"cli_usuario":profile},'name')
    return cliente 


 
