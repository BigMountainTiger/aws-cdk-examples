import asyncio
import aiofile
from amazon_transcribe.client import TranscribeStreamingClient
from amazon_transcribe.handlers import TranscriptResultStreamHandler
from amazon_transcribe.model import TranscriptEvent

class MyEventHandler(TranscriptResultStreamHandler):
  async def handle_transcript_event(self, transcript_event: TranscriptEvent):
    results = transcript_event.transcript.results
    for result in results:
      for alt in result.alternatives:
        print(alt.transcript)

async def basic_transcribe():
  client = TranscribeStreamingClient(region="us-east-1")

  stream = await client.start_stream_transcription(
      language_code="en-US",
      media_sample_rate_hz=16000,
      media_encoding="pcm",
  )

  async def write_chunks():
    async with aiofile.AIOFile('audio/A.wav', 'rb') as afp:
      reader = aiofile.Reader(afp, chunk_size=1024 * 16)
      async for chunk in reader:
        await stream.input_stream.send_audio_event(audio_chunk=chunk)
    await stream.input_stream.end_stream()

  handler = MyEventHandler(stream.output_stream)
  await asyncio.gather(write_chunks(), handler.handle_events())

def run_test():
  loop = asyncio.get_event_loop()
  loop.run_until_complete(basic_transcribe())
  loop.close()


if __name__ == '__main__':
  run_test()