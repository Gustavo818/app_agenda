from __future__ import unicode_literals
import frappe
from frappe.utils import sanitize_html
 

sitemap = 1

 
def get_context(context):
    context.show_search = True
    context.allow_guest = True
    context.no_breadcrumbs = True
 
   