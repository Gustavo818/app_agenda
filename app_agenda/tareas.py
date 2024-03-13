import frappe
from datetime import date, datetime
from frappe.utils import add_days,getdate ,get_datetime
# bench --site agendaweb execute app_agenda.tareas.generarIntereses
# bench --site italfox.com execute app_agenda.tareas.generarIntereses
 
def generarIntereses():
    day_abbr = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"]
    day_payments = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"]
    mes_abbr = [ "","Enero", "Febreo", "Marzo", "Abril", "Mayo", "Junio", "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

    sql =  """select   p.name , tbl_cliente, cliplan_capital ,
    cliplan_rendimiento , cliplan_fecha_utimogenerado , tbl_plan ,
    cliplan_estado , c.cli_nombrecompleto ,plan_nombre ,cliplan_porcentaje
    from tabtbl_cliente_plan  p inner join tabtbl_cliente c on ( c.name = p.tbl_cliente)
    where cliplan_fecha_utimogenerado < CURRENT_DATE()  and cliplan_estado='APROBADO'  """
    lst = frappe.db.sql(sql, as_dict =True)
    
    
    for row in lst:
        fecha_i =  row.cliplan_fecha_utimogenerado  

        while  get_datetime(fecha_i)  <=  get_datetime(datetime.now()):
            fer_fecha = frappe.db.exists("tbl_fecha_feriado_detalles",
                {   "fer_fecha"    :fecha_i } ) 
        
            print(">Buscando: ",fecha_i," >>", fer_fecha)
            if (not fer_fecha) :
                fecha_actual = getdate(datetime.now())
                day_name = day_abbr[fecha_i.weekday()]
                mes_name = mes_abbr[fecha_i.month] 
                dia = fecha_i.day

            

                id_estado_cuenta = frappe.db.get_value(
                                            "tbl_estado_cuenta",
                                            {   "estc_fecha"    :fecha_i, 
                                                "tbl_cliente"   :row.tbl_cliente,
                                                "estc_plan"     :row.tbl_plan
                                            }
                                            ,'name')
                
                print(">> id_estado_cuenta : {0}".format(id_estado_cuenta))
                # if fer_fecha :
                #     print(id_estado_cuenta)

                if (day_name in day_payments) and (not id_estado_cuenta) and (not fer_fecha ) :
                    ec                  = frappe.new_doc("tbl_estado_cuenta")
                    ec.estc_fecha       =  fecha_i
                    ec.tbl_cliente      = row.tbl_cliente
                    ec.cliente_nombre   =  row.cli_nombrecompleto
                    ec.estc_plan        = row.tbl_plan
                    ec.plan_nombre      = row.plan_nombre
                    ec.estc_capital     = row.cliplan_capital
                    ec.plan_porcentaje  = row.cliplan_porcentaje
                    ec.id_cliente_plan  = row.name
                    valor = ( row.cliplan_porcentaje * row.cliplan_capital ) / 100
                    ec.estc_valor =   round(valor,2)
                    ec.estc_detalle = """ {0} {1} de {3} del {4}, ROI DIARIO ${2} """.format(day_name,dia,valor,mes_name,fecha_i.year)
                    ec.estc_detalle_html = """ <p style="text-align:center"><span style="font-size:18px"><span style="font-family:Calibri,sans-serif"><strong><span style="font-family:&quot;Georgia&quot;,serif">{0}  </span></strong><span style="font-family:&quot;Georgia&quot;,serif"> {1} de {3} del {4}, ROI DIARIO <strong><span style="color:#385623">${2}</span></strong></span></span></span></p> """.format(day_name,dia,valor,mes_name,fecha_i.year)
                    ec.insert()
                    print("Generado {0} plan:{1}".format(fecha_i, row.name) )
            sqlupdate = """ update tabtbl_cliente_plan set cliplan_fecha_utimogenerado='{0}' where name='{1}' """.format(fecha_i,row.name)                 
            print(sqlupdate)
            frappe.db.sql(sqlupdate)
            frappe.db.commit()
            fecha_i = add_days(fecha_i,1)

    print("Finalizado correctamente")
       