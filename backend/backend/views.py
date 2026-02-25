from django.http import JsonResponse
from orders.models import Product, Order
from django.db.models import Sum

def admin_stats(request):
    # ഡാറ്റാബേസിൽ നിന്നുള്ള കൗണ്ടുകൾ
    products_count = Product.objects.count()
    orders_count = Order.objects.count()
    
    # ടോട്ടൽ റെവന്യൂ കണക്കാക്കുന്നു (Order മോഡലിൽ total_price ഉണ്ടെന്ന് കരുതുന്നു)
    # ഇല്ലെങ്കിൽ ഇത് 0 എന്ന് തന്നെ ഇടാം
    revenue_data = Order.objects.aggregate(Sum('total_price')) # 'total_price' നിങ്ങളുടെ ഫീൽഡ് പേര് നൽകുക
    total_revenue = revenue_data['total_price__sum'] if revenue_data['total_price__sum'] else 0

    return JsonResponse({
        'products_count': products_count,
        'orders_count': orders_count,
        'total_revenue': total_revenue
    })