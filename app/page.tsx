import { Conversation } from './components/conversation';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          ElevenLabs Conversational AI
        </h1>
        <Conversation />
        {/* Embedded ElevenLabs ConvAI widget */}
        <div className="mt-8">
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <elevenlabs-convai agent-id="agent_5601k2frztsqeaht9m2tqzc2d08w"></elevenlabs-convai>
          <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
        </div>
      </div>
    </main>
  );
}
