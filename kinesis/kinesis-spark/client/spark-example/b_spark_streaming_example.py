from pyspark import SparkContext
from pyspark.streaming import StreamingContext
from pyspark.streaming.kinesis import KinesisUtils, InitialPositionInStream, StorageLevel


def run():
    APP_NAME = 'kinesis-stream-test'
    STREAM_NAME = 'MY-TEST-STREAM'
    ENDPOINT_URL = 'https://kinesis.us-east-1.amazonaws.com'
    REGION = 'us-east-1'

    # The time interval to get a new RDD in seconds
    batchInterval = 5
    kinesisCheckpointInterval = batchInterval

    sc = SparkContext(appName=APP_NAME)
    sc.setLogLevel('ERROR')
    ssc = StreamingContext(sc, batchInterval)

    stream = KinesisUtils.createStream(
        ssc=ssc,
        kinesisAppName=APP_NAME,
        streamName=STREAM_NAME,
        endpointUrl=ENDPOINT_URL,
        regionName=REGION,
        initialPositionInStream=InitialPositionInStream.LATEST,
        checkpointInterval=kinesisCheckpointInterval,
        storageLevel=StorageLevel.MEMORY_AND_DISK_2,
    )

    def get_output(_, rdd):
        if (len(rdd.take(1)) == 0):
            return

        print('New RDD is coming ...')
        data = rdd.collect()
        for e in data:
            print(e)
        
        print(f'Data entry count = {len(data)}')

    stream.foreachRDD(get_output)

    ssc.start()
    ssc.awaitTermination()


if __name__ == "__main__":
    run()
