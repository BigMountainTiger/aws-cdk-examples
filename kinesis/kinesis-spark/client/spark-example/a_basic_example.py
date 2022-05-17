import sys
from random import random
from operator import add

from pyspark.sql import SparkSession

# This is a simple example to test the spark environment
if __name__ == "__main__":

    spark = SparkSession.builder.appName("PythonPi").getOrCreate()

    PARTITONS = int(sys.argv[1]) if len(sys.argv) > 1 else 2
    n = 100000 * PARTITONS

    def f(_):
        x = random() * 2 - 1
        y = random() * 2 - 1
        return 1 if x ** 2 + y ** 2 <= 1 else 0

    count = spark.sparkContext.parallelize(range(1, n + 1), PARTITONS).map(f).reduce(add)
    print("Pi is roughly %f" % (4.0 * count / n))

    spark.stop()