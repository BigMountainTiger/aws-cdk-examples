import asyncio
from amazon_transcribe.client import TranscribeStreamingClient
from amazon_transcribe.handlers import TranscriptResultStreamHandler
from amazon_transcribe.model import TranscriptEvent

client = TranscribeStreamingClient(region="us-east-1")

class TranscriptResult:
  def __init__(self):
    self.result = None

  def set(self, result):
    self.result = result

  def get(self):
    return self.result

class MyEventHandler(TranscriptResultStreamHandler):
  def __init__(self, transcript_result_stream, transcript_result):
    self.transcript_result = transcript_result
    TranscriptResultStreamHandler.__init__(self, transcript_result_stream)

  async def handle_transcript_event(self, transcript_event: TranscriptEvent):
    results = transcript_event.transcript.results
    for result in results:
      for alt in result.alternatives:
        self.transcript_result.set(alt.transcript)

async def basic_transcribe(transcript_result):
  stream = await client.start_stream_transcription(
      language_code="en-US",
      media_sample_rate_hz=16000,
      media_encoding="pcm",
  )
  
  def chunks(lst, n):
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

  # This function does not use aiofile
  async def write_chunks():
    with open('audio/A.wav','rb') as file:
      content = file.read()

    reader = chunks(content, 1024 * 16)
    for chunk in reader:
      await stream.input_stream.send_audio_event(audio_chunk=chunk)
    
    await stream.input_stream.end_stream()

  handler = MyEventHandler(stream.output_stream, transcript_result)
  await asyncio.gather(write_chunks(), handler.handle_events())

def run_test():
  r = TranscriptResult()
  loop = asyncio.get_event_loop()
  loop.run_until_complete(basic_transcribe(r))
  loop.close()

  print(r.get())

import time
if __name__ == '__main__':
  start_time = time.time()
  run_test()

  print("--- %s seconds ---" % (time.time() - start_time))