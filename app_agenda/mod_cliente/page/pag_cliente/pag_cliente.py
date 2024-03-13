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
        
    sql = """ select DISTINCT estc_plan , estc_capital , plan_nombre from 
        tabtbl_estado_cuenta 
        where tbl_cliente ='{0}'  """.format(cliente)
    lstPlanes = frappe.db.sql(sql,as_dict=True)
   
   
    for rw in lstPlanes:
        sql = """ select  estc_detalle_html , estc_valor  from tabtbl_estado_cuenta 
        where tbl_cliente ='{0}' and estc_plan ='{1}' and estc_eliminar = 0
        order by estc_fecha """ .format(cliente, rw.estc_plan)
        detalles = frappe.db.sql(sql,as_dict=True)
        rw["detalles"] = detalles      
        
        total=0
        for item in detalles:
            total += float(item.estc_valor)
        rw["interes_ganado"] =total

        sql2 =   """
                select  IFNULL(sum(r.reti_valor),0 ) as valor_retiro, r.tbl_cliente , r.tbl_plan, r.reti_estado  from tabtbl_retiro as r
                where  	r.tbl_cliente	='{0}' 
                and  	r.tbl_plan		= '{1}' 
                and 	r.reti_estado	='APROBADO' 
                and 	r.reti_tipo_retiro ='INTERES' 
                """ .format(cliente, rw.estc_plan)
        valor_retirado = frappe.db.sql(sql2)[0][0]

        rw["valor_retirado"]    = valor_retirado
        rw["valor_disponible"]  = total - float(valor_retirado)

     


    sql = """
          select tbl_plan
        , tbl_cliente 
        , plan_nombre 
        , cliplan_capital 
        , cliplan_fecha_ini 
        , cliplan_fecha_retmin
        from tabtbl_cliente_plan 
    where cliplan_estado = 'APROBADO' and tbl_cliente='{0}'  """.format(cliente)
    planaprobados = frappe.db.sql(sql,as_dict=True)

    sql =   """
        select 	c.tbl_cliente, 
                c.comi_fecha , 
                c.tbl_comision_opciones,
                o.opci_codigo,
                o.opci_descripcion,
                c.comi_comision, 
                c.comi_fee,
                c.comi_disponible
            from tabtbl_comision_lider c
            inner join tabtbl_comision_opciones o 
            on	 o.name = c.tbl_comision_opciones
            where   c.comi_trans_pendiente  
            and     c.tbl_cliente='{0}'  """.format(cliente)  
            
              
    comisiones = frappe.db.sql(sql,as_dict=True)


    sql =   """
                select 	IFNULL(sum(c.comi_disponible),0 ) as suma_comision
                        from tabtbl_comision_lider c
                        inner join tabtbl_comision_opciones o 
                        on	 o.name = c.tbl_comision_opciones	
                where c.comi_trans_pendiente   
                and     c.tbl_cliente='{0}'  """.format(cliente)  
    suma_comision = frappe.db.sql(sql)[0][0]


    sql = """ select n.noti_titulo , n.noti_detalle , n.noti_foto  
            from tabtbl_noticias as n
            where n.noti_activo
             """            
    noticias = frappe.db.sql(sql,as_dict=True)

    sql = """
        select *  from tabtbl_cliente as c
        where c.name = '{0}'
        """.format(cliente)
    datos_cliente = frappe.db.sql(sql,as_dict=True) 

    # sql = """
    #     select date_format(r.reti_fecha_sol, "%d-%m-%Y")  as reti_fecha_sol
 	# 				, r.name
    #                 , p.plan_nombre 
    #                 , cp.cliplan_capital
    #                 , r.reti_estado
    #                 , r.reti_tipo_retiro    		
    #                 , r.reti_valor
    #     from tabtbl_retiro r 
    #     inner join tabtbl_cliente_plan cp on (r.tbl_cliente  = cp.tbl_cliente)
    #     inner join tabtbl_plan p on (p.name=r.tbl_plan)
    #     where 	r.reti_estado ="SOLICITADO"
    #     and 	r.tbl_cliente	= '{0}'
    #     and 	cp.cliplan_activo    
    #     and 	cp.cliplan_estado = 'APROBADO'
    #     """.format(cliente)
    sql = """
        select date_format(r.reti_fecha_sol, "%d-%m-%Y")  as reti_fecha_sol
 					, r.name
                    , p.plan_nombre 
                    , cp.cliplan_capital
                    , r.reti_estado
                    , r.reti_tipo_retiro    		
                    , r.reti_valor
                    , r.reti_aprobado_admin
        from tabtbl_retiro r 
        inner join tabtbl_cliente_plan cp	on (cp.name = r.id_cliente_plan)
        inner join tabtbl_plan p 			on (p.name	= r.tbl_plan)
        where 	r.reti_estado ="SOLICITADO"
        and 	r.tbl_cliente	= '{0}'
        and 	cp.cliplan_estado = 'APROBADO'        
    """.format(cliente)
    solicitud_pendiente = frappe.db.sql(sql,as_dict=True)    
    

    sql = """
            select 	  cp.cliplan_fecha_sol 
            , cp.tbl_plan
            , cp.tbl_cliente 
            , cp.plan_nombre 
            , cp.cliplan_capital 
            , cp.cliplan_fecha_ini 
            , cp.cliplan_fecha_retmin
            from tabtbl_cliente_plan as cp
        where cliplan_estado = 'SOLICITADO' 
        and tbl_cliente='{0}'
        """.format(cliente)
    plan_pendiente = frappe.db.sql(sql,as_dict=True)    
      
    return {    "cliente"         : objCliente ,
                "planes"          : lstPlanes, 
                "planes_aprobados": planaprobados,
                "noticias"        : noticias,
                "datos_cliente"   : datos_cliente,
                "solicitud_pendiente":solicitud_pendiente,
                "plan_pendiente"  : plan_pendiente,
                "comisiones"      : comisiones,
                "suma_comision"   : suma_comision
            }

@frappe.whitelist( )
def getPlanes():
    user = frappe.session.user
    profile = frappe.db.get_value("User", user, "username")
    cliente =frappe.db.get_value("tbl_cliente",{"cli_usuario":profile},'name')
    sql = """ select DISTINCT estc_plan , estc_capital , plan_nombre from 
        tabtbl_estado_cuenta 
        where tbl_cliente ='{0}'  """.format(cliente)
    lstPlanes = frappe.db.sql(sql,as_dict=True)


@frappe.whitelist( )
def getReferidos():
    user = frappe.session.user
    profile = frappe.db.get_value("User", user, "username")
    cli_usuario = frappe.db.get_value("tbl_cliente",{"cli_usuario":profile},'cli_usuario')
    # sql = """
    #         select c.cli_nombrecompleto    from tabtbl_cliente c
    #         where c.cli_user_referencia = '{0}'
    #     """.format(cli_usuario)

    sql = """
            select    c.cli_nombrecompleto
                    , cp.cliplan_capital
                    , cp.plan_nombre   from tabtbl_cliente c
            inner join tabtbl_cliente_plan cp on cp.tbl_cliente  = c.name  
            where 	c.cli_user_referencia =  '{0}'
            and     cp.cliplan_con_referido     
        """.format(cli_usuario)

    lstReferidos =  frappe.db.sql(sql,as_dict=True)
    return lstReferidos

@frappe.whitelist( )
def getComisionesReferidos():
    user = frappe.session.user
    profile = frappe.db.get_value("User", user, "username")
    cliente = frappe.db.get_value("tbl_cliente",{"cli_usuario":profile},'name')
    # sql = """
    #         select c.cli_nombrecompleto    from tabtbl_cliente c
    #         where c.cli_user_referencia = '{0}'
    #     """.format(cli_usuario)


    sql =   """
        select 	c.tbl_cliente, 
                c.comi_fecha , 
                c.tbl_comision_opciones,
                o.opci_codigo,
                o.opci_descripcion,
                c.comi_comision, 
                c.comi_fee,
                c.comi_disponible,
                c.comi_trans_pendiente,
                c.fecha,
                c.cli_billetera
            from tabtbl_comision_lider c
            inner join tabtbl_comision_opciones o 
            on	 o.name = c.tbl_comision_opciones
            and     c.tbl_cliente='{0}'  """.format(cliente)  

    lstComisionesReferidos =  frappe.db.sql(sql,as_dict=True)
    return lstComisionesReferidos



@frappe.whitelist()
def crear_sol_retiro_rendimiento(plan,   valor):
    user = frappe.session.user
    profile = frappe.db.get_value("User", user, "username")
    cliente = frappe.db.get_value("tbl_cliente",{"cli_usuario":profile},'name')   
    cli_billetera = frappe.db.get_value("tbl_cliente",{"cli_usuario":profile},'cli_billetera')   
    id_cliente_plan   = frappe.db.get_value("tbl_cliente_plan" ,{"plan_nombre":plan, "tbl_cliente":cliente }, 'name')

    
    # sql = """ 
    #             select cp.name , cp.tbl_plan, cp.tbl_cliente  from tabtbl_cliente_plan cp 
    #                 where cp.plan_nombre = '{0}'
    #                 and   cp.tbl_cliente = '{1}'
    #                 and   cp.cliplan_activo     
    #             """.format(plan,cliente)
    # # frappe.throw(sql)
    # id_cliente_plan = frappe.db.sql(sql)[0][0]
    
    
    plan                = frappe.db.get_value("tbl_plan",{"plan_nombre":plan},'name')   
    sol                 = frappe.new_doc("tbl_retiro")
    sol.tbl_cliente     = cliente
    sol.tbl_plan        = plan
    sol.reti_fecha_sol  = datetime.now()
    sol.reti_tipo_retiro = 'INTERES' 
    sol.reti_valor      = valor 
    sol.id_cliente_plan = id_cliente_plan
    sol.cli_billetera   =  cli_billetera
    n_series = uuid.uuid4()
    sol.x_naming_series = n_series
    sol.insert()
    return "Se creo la solicitud correctamente " + sol.name


@frappe.whitelist()
def crear_sol_retiro_capital(plan):
    user = frappe.session.user
    profile = frappe.db.get_value("User", user, "username")
    cliente =frappe.db.get_value("tbl_cliente",{"cli_usuario":profile},'name')  
    cli_billetera = frappe.db.get_value("tbl_cliente",{"cli_usuario":profile},'cli_billetera')   
    id_cliente_plan   = frappe.db.get_value("tbl_cliente_plan" ,{"plan_nombre":plan, "tbl_cliente":cliente }, 'name')
    plan =  frappe.db.get_value("tbl_plan",{"plan_nombre":plan},'name')   

    sqlsaldo = """ SELECT cliplan_capital  FROM tabtbl_cliente_plan
                    where tbl_plan='{0}' AND  tbl_cliente = '{1}' and cliplan_estado ='APROBADO'   """.format(plan,cliente)
    objcapital  = frappe.db.sql(sqlsaldo)[0][0]
    capital         = float(objcapital)
    sol             = frappe.new_doc("tbl_retiro")
    sol.tbl_cliente = cliente
    sol.tbl_plan    = plan
    sol.reti_fecha_sol =  datetime.now()
    sol.reti_tipo_retiro    = 'CAPITAL' 
    sol.reti_valor          = capital
    sol.id_cliente_plan     = id_cliente_plan
    sol.cli_billetera       =  cli_billetera
    n_series = uuid.uuid4()
    sol.x_naming_series = n_series
    sol.insert()
    return "Se creo la solicitud correctamente " +sol.name


@frappe.whitelist() 
def verificaDatosLlenos():
    user = frappe.session.user
    profile = frappe.db.get_value("User", user, "username")
    cliente =frappe.db.get_value("tbl_cliente",{"cli_usuario":profile},'name')
    fld = falta_llenar_datos()            
    return {"contar":fld , "cliente_name":cliente} 
 

@frappe.whitelist( )
def getplanesaprobados():
    user = frappe.session.user
    profile = frappe.db.get_value("User", user, "username")
    cliente =frappe.db.get_value("tbl_cliente",{"cli_usuario":profile},'name')
    sql = """ select plan_nombre  
    from tabtbl_cliente_plan tcp 
    where tbl_cliente= '{0}'
    and cliplan_estado ='APROBADO'   """.format(cliente)
    # frappe.throw(sql)
    lstPlanes = frappe.db.sql(sql,as_dict=False)
    
    return lstPlanes

@frappe.whitelist( )
def getnoticias():
    sql = """ 
        select n.noti_titulo , n.noti_detalle , n.noti_foto  
        from tabtbl_noticias as n
     """
    # where n.noti_activo 
    noticias = frappe.db.sql(sql,as_dict=False)
    return noticias

 

@frappe.whitelist( )
def getValorRetirado(plan):
    user    = frappe.session.user
    profile = frappe.db.get_value("User", user, "username")
    cliente = frappe.db.get_value("tbl_cliente",{"cli_usuario":profile},'name')
    # plan =  frappe.db.get_value("tbl_plan",{"plan_nombre":plan},'name') 
    sql =   """
                select  IFNULL(sum(r.reti_valor),0 ) as valor_retiro, r.tbl_cliente , r.tbl_plan, r.reti_estado  from agendadb.tabtbl_retiro as r
                where  	r.tbl_cliente	='{0}' 
                and  	r.tbl_plan		= '{1}' 
                and 	r.reti_estado	='APROBADO' 
                and 	r.reti_tipo_retiro ='INTERES' 
                """ .format(cliente, plan)
    
    return frappe.db.sql(sql)[0][0]
 
 