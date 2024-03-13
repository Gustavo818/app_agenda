import frappe

@frappe.whitelist()
def get_total_price():
    total = 125.30
    return total
