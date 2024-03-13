import frappe
from frappe import _
from datetime import date, datetime
import uuid
def get_context(context):
	context.no_cache = 1
	context.show_sidebar = False
	context.title =  "hola"
	context.show_search = False
	context.archivos = ["a","b"]
	archivos  = ["aq","b"]
	


 
	# verifica si tiene planes pendientes
 
@frappe.whitelist( )
def get_planes_info():
	# sql = """  select name , plan_nombre  from tabtbl_plan """
	user = frappe.session.user
	profile = frappe.db.get_value("User", user, "username")
	cliente =frappe.db.get_value("tbl_cliente",{"cli_usuario":profile},'name')
	sql = """ 
			select 	p.name, 
					p.plan_nombre, 
					p.plan_porcentaje, 
					p.plan_dias_retiro /30 as cantidad_mes ,
					p.plan_detalle1
			from tabtbl_plan p
			where p.plan_activo and p.name not in (
			select 	cp.tbl_plan from tabtbl_cliente_plan cp  
			inner join tabtbl_plan p on p.name = cp.tbl_plan
			where cp.cliplan_activo  and cp.tbl_cliente ='{0}'
			)
			order by p.name		
		""".format(cliente)
	planes = frappe.db.sql(sql, as_dict = True)
	for plan in planes:
		sqld = """ select  name, plad_capital , parent  from tabtbls_plan_detalle  where parent='{0}' order by plad_capital """.format(plan.name)
		plan["valores"] = frappe.db.sql(sqld, as_dict = True)
	return planes
 
@frappe.whitelist( )
def crearsolicitud(pdname, foto_url, id_hash):
	user = frappe.session.user
	profile = frappe.db.get_value("User", user, "username")
	cliente =frappe.db.get_value("tbl_cliente",{"cli_usuario":profile},'name')

	fld = falta_llenar_datos()
	if fld == 0:
		return cliente 

	pd = frappe.get_doc('tbls_plan_detalle',pdname)
	plan =  frappe.get_doc('tbl_plan',pd.parent)
	
	if user == 'Administrator':
		frappe.throw("El usuario administrador no puede crear solicitudes")
	
	 

	# sql =""" select count(tbl_cliente) from tabtbl_cliente_plan  
    # where  tbl_cliente = '{0}'   and tbl_plan ='{1}'  and cliplan_estado!='ARCHIVADO' """.format(cliente,plan.name)

	sql =""" select count(tbl_cliente) from tabtbl_cliente_plan  
    where  tbl_cliente = '{0}'   and tbl_plan ='{1}'  and cliplan_activo """.format(cliente,plan.name)

	tiene_pendientes = frappe.db.sql(sql)[0][0]
	if tiene_pendientes > 0:
		frappe.throw(" <b> >> Usted tiene ya ha realizo una solicitud  del plan </b> " + plan.plan_nombre )
		 


	cliplan 				= frappe.new_doc("tbl_cliente_plan")
	cliplan.tbl_cliente 	= cliente
	cliplan.tbl_plan 		= plan.name
	cliplan.cliplan_capital =   pd.plad_capital
	cliplan.cliplan_rendimiento =  plan.plan_rendimiento
	cliplan.cliplan_fecha_sol 	=  datetime.now()
	cliplan.cliplan_foto 		= foto_url 
	cliplan.id_hash				= id_hash
	# ->
	n_series    = uuid.uuid4()
	cliplan.x_naming_series = n_series
	# <-
		
	cliplan.insert()
	
	return cliplan.name

def verificaPlanesAdquiridos(cliente):
	sql = """select cliplan_capital, p.plan_nombre    from tabtbl_cliente_plan cp
	inner join tabtbl_plan p  on (p.name = cp.tbl_plan)
	where  tbl_cliente ='{0}' and cliplan_estado!='ARCHIVADO' """.format(cliente)
	return frappe.db.sql(sql, as_dict=True)

@frappe.whitelist( )
def getpines():	
	return frappe.db.get_lis("tbl_pines",fields=['name', 'pin_nombre','pin_url'])


""" Retorna 1 si existen datos y 0 si no """
@frappe.whitelist( )
def falta_llenar_datos():
	sql = """  select  count(name) as contar from tabtbl_cliente  
	where cli_correo ='{0}' 
	and (  cli_nombres 	 is not null 
		or cli_apellidos is not null 
		or cli_celular   is not null 
		or cli_direccion is not null
		or cli_billetera is not null
		or cli_foto 	 is not null
		or cli_documento is not null
		) 
	""".format(frappe.session.user )
	return frappe.db.sql(sql)[0][0]
	# devuelve 0 falta falta_llenar_datos;	1 No falta llenar

@frappe.whitelist( )
def get_pines():
	sql = "select  pin_nombre, pin_url , name  from tabtbl_pines "
	return frappe.db.sql(sql, as_dict=True)

@frappe.whitelist( )
def get_pines2():
	sql = "select  pin_nombre, pin_url , name  from tabtbl_pines "
	return frappe.db.sql(sql, as_dict=True)


