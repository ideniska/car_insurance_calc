from django.db import models


class Make(models.Model):
    make = models.CharField(max_length=250)

    def __str__(self):
        return self.make


class Model(models.Model):
    make = models.ForeignKey(
        Make, on_delete=models.CASCADE, related_name="models", db_index=True
    )
    model = models.CharField(max_length=350, db_index=True)
    popularity = models.PositiveIntegerField(default=0)
    years = models.ManyToManyField("ModelYear")

    def __str__(self):
        return self.model


class Trim(models.Model):
    # make = models.ForeignKey(
    #     Make, on_delete=models.CASCADE, related_name="trims", db_index=True
    # )
    # model = models.ManyToManyField(Model)
    model = models.ForeignKey(
        Model, on_delete=models.CASCADE, related_name="trims", db_index=True
    )
    trim = models.CharField(max_length=250)

    def __str__(self):
        return f"{self.model} {self.trim}"


class ModelYear(models.Model):
    year = models.PositiveIntegerField()

    def __str__(self):
        return str(self.year)


class Car(models.Model):
    make = models.ForeignKey(Make, on_delete=models.CASCADE, related_name="cars")
    model = models.ForeignKey(Model, on_delete=models.CASCADE, related_name="cars")
    trim = models.ForeignKey(Trim, on_delete=models.CASCADE, related_name="cars")
    year = models.ForeignKey(ModelYear, on_delete=models.PROTECT, related_name="cars")
    price = models.DecimalField(decimal_places=2, max_digits=12)

    def __str__(self):
        return f"{self.make} {self.model} {self.trim} {self.year} {self.price}"


# Make -> Model <-> Year <-> Trim -> Price

# TODO How to make models exclusive to make and trims exclusive to models? Example: you can't choose Toyota's models when adding BMW car

# TODO unique constraint model + trim + year
# TODO delet 34 line
