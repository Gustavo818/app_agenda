from . import __version__ as app_version

app_name = "app_agenda"
app_title = "App Agenda"
app_color = "grey"
app_publisher = "ING GUSTAVO YANCHA"
app_description = "SISTEMA DE AGENDA"
app_email = "corre@correo.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
app_include_css = "/assets/app_agenda/css/app_agenda.css"
# app_include_js = "/assets/app_agenda/js/app_agenda.js"

# include js, css files in header of web template
web_include_css = "/assets/app_agenda/css/app_agenda.css"
# web_include_js = "/assets/app_agenda/js/app_agenda.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "app_agenda/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

on_session_creation = [
       "app_agenda.utils.onsession.irapagina"
]

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
#	"methods": "app_agenda.utils.jinja_methods",
#	"filters": "app_agenda.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "app_agenda.install.before_install"
# after_install = "app_agenda.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "app_agenda.uninstall.before_uninstall"
# after_uninstall = "app_agenda.uninstall.after_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "app_agenda.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
#	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
#	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

permission_query_conditions = {
    "tbl_cliente_plan"      : "app_agenda.filtros.tbl_cliente_plan",
    "tbl_cliente"           : "app_agenda.filtros.tbl_cliente",
    "tbl_estado_cuenta"     : "app_agenda.filtros.tbl_estado_cuenta",
    "tbl_retiro"            : "app_agenda.filtros.tbl_retiro",
    "rep_solicitud_retiros" : "app_agenda.filtros.rep_solicitud_retiros", 
    "File"                  : "app_agenda.filtros.archivos"
}

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
#	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
#	"*": {
#		"on_update": "method",
#		"on_cancel": "method",
#		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
#	"all": [
#		"app_agenda.tasks.all"
#	],
#	"daily": [
#		"app_agenda.tasks.daily"
#	],
#	"hourly": [
#		"app_agenda.tasks.hourly"
#	],
#	"weekly": [
#		"app_agenda.tasks.weekly"
#	],
#	"monthly": [
#		"app_agenda.tasks.monthly"
#	],
# }

scheduler_events = {	 
	"daily": [
		"app_agenda.tareas.generarIntereses"
	],
	 
 }


# Testing
# -------

# before_tests = "app_agenda.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
#	"frappe.desk.doctype.event.event.get_events": "app_agenda.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
#	"Task": "app_agenda.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]


# User Data Protection
# --------------------

# user_data_fields = [
#	{
#		"doctype": "{doctype_1}",
#		"filter_by": "{filter_by}",
#		"redact_fields": ["{field_1}", "{field_2}"],
#		"partial": 1,
#	},
#	{
#		"doctype": "{doctype_2}",
#		"filter_by": "{filter_by}",
#		"partial": 1,
#	},
#	{
#		"doctype": "{doctype_3}",
#		"strict": False,
#	},
#	{
#		"doctype": "{doctype_4}"
#	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
#	"app_agenda.auth.validate"
# ]
