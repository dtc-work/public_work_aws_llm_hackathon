import asyncio

from amazon_transcribe.client import TranscribeStreamingClient
from amazon_transcribe.handlers import TranscriptResultStreamHandler
from amazon_transcribe.model import TranscriptEvent
from core.config import settings

"""
Here's an example of a custom event handler you can extend to
process the returned transcription results as needed. This
handler will simply print the text out to your interpreter.
"""
class MyEventHandler(TranscriptResultStreamHandler):
    def __init__(self, stream, websocket):
        super().__init__(stream)
        self.transcriptions = []
        self.websocket = websocket

    async def handle_transcript_event(self, transcript_event: TranscriptEvent):
        results = transcript_event.transcript.results
        for result in results:
            if result.is_partial:
                continue # 部分的結果は無視する
            for alt in result.alternatives:
                self.transcriptions.append(alt.transcript) # 結果保持用のリストに追加
                await self.websocket.send_json({"transcribe_result": alt.transcript}) # 文章が出力されるたびにwebsocketで送信

async def basic_transcribe(audio_queue, websocket):
    # Set up our client with your chosen Region
    client = TranscribeStreamingClient(region=settings.AWS_REGION)

    # Start transcription to generate async stream
    stream = await client.start_stream_transcription(
        language_code="ja-JP",
        media_sample_rate_hz = 44100,
        media_encoding = "pcm",
    )

    async def mic_stream():
        while True:
            indata = await audio_queue.get()
            # audio_queueの全ての処理が終わったらbreakする
            if indata is None:
                break

            yield indata, None

    async def write_chunks():
        async for chunk, _ in mic_stream():
            try:
                await stream.input_stream.send_audio_event(audio_chunk=chunk)
            except OSError as e:
                print(f"OSError: {e}")
                break
        await stream.input_stream.end_stream()

    # Instantiate our handler and start processing events
    handler = MyEventHandler(stream.output_stream, websocket)
    await asyncio.gather(write_chunks(), handler.handle_events())

    return handler.transcriptions
