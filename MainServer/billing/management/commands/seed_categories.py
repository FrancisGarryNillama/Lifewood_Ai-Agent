from django.core.management.base import BaseCommand
from billing.models import ExpenseCategory


CATEGORIES = [
    ("Office Supplies", "paper,ink,toner,stapler,folder,pen,notebook,stationery"),
    ("Utilities", "meralco,electric,water,maynilad,manila water,power"),
    ("Communication", "globe,smart,pldt,converge,internet,telecom,postpaid"),
    ("Transportation & Travel", "grab,taxi,fuel,gas,petrol,shell,petron,caltex,toll,parking,travel"),
    ("Meals & Entertainment", "restaurant,food,meal,jollibee,mcdonalds,starbucks,coffee,dining"),
    ("Repairs & Maintenance", "repair,maintenance,service,mechanic,plumbing,aircon"),
    ("Professional Fees", "legal,accounting,audit,consultant,attorney,cpa"),
    ("Rent", "rent,lease,rental"),
    ("Advertising & Promotion", "advertising,ads,promo,marketing,signage"),
    ("Taxes & Licenses", "bir,business permit,license,registration,clearance,barangay"),
    ("Insurance", "insurance,hmo,health,premium"),
    ("Salaries & Wages", "salary,wage,payroll,sss,philhealth,pagibig"),
    ("Admin Expense", "admin,administrative,miscellaneous"),
]


class Command(BaseCommand):
    help = "Seed default Philippine expense categories"

    def handle(self, *args, **options):
        created = 0
        for name, kws in CATEGORIES:
            _, is_new = ExpenseCategory.objects.get_or_create(
                name=name,
                defaults={"keywords": kws},
            )
            if is_new:
                created += 1
        self.stdout.write(self.style.SUCCESS(f"Seeded {created} categories"))