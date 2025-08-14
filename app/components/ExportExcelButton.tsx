'use client';
import { TelemetryRecorder } from '../lib/telemetry';

export default function ExportExcelButton({ recorder }: { recorder: TelemetryRecorder }) {
  const handleExport = async () => {
    const XLSX = await import('xlsx');
    const summary = recorder.getSummary();
    const messages = recorder.getMessages();
    const errors = recorder.getErrors();

    const wb = XLSX.utils.book_new();

    const summarySheet = XLSX.utils.json_to_sheet([summary]);
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

    const messagesSheet = XLSX.utils.json_to_sheet(
      messages.map((m) => ({
        timestamp: new Date(m.timestamp).toISOString(),
        role: m.role,
        text: m.text,
      }))
    );
    XLSX.utils.book_append_sheet(wb, messagesSheet, 'Messages');

    const errorsSheet = XLSX.utils.json_to_sheet(
      errors.map((e) => ({ timestamp: new Date(e.timestamp).toISOString(), message: e.message }))
    );
    XLSX.utils.book_append_sheet(wb, errorsSheet, 'Errors');

    // KPI sheet aligned to requested evaluation areas
    const kpiRows = [
      { area: 'Latency & turn-taking', metric: 'Barge-in latency (ms)', value: summary.bargeInLatencyMs ?? '' },
      { area: 'Latency & turn-taking', metric: 'Overlap segments', value: summary.overlapSegments },
      { area: 'ASR quality & robustness', metric: 'Detected language', value: summary.asrDetectedLanguage ?? '' },
      { area: 'ASR quality & robustness', metric: 'Code-switching detected', value: summary.asrCodeSwitchingDetected ?? '' },
      { area: 'ASR quality & robustness', metric: 'Numeric extraction issues', value: summary.asrNumericExtractionIssues ?? '' },
      { area: 'TTS quality', metric: 'Interruptions (overlaps during TTS)', value: summary.ttsInterruptions },
      { area: 'Tool/Webhook', metric: 'Errors', value: summary.webhookErrors },
      { area: 'Tool/Webhook', metric: 'Timeouts', value: summary.webhookTimeouts ?? '' },
      { area: 'Tool/Webhook', metric: 'Schema errors', value: summary.webhookSchemaErrors ?? '' },
      { area: 'RAG', metric: 'Grounding coverage', value: summary.ragGroundingCoverage ?? '' },
      { area: 'RAG', metric: 'Ambiguity handled', value: summary.ragAmbiguityHandled ?? '' },
      { area: 'RAG', metric: 'Stale avoidance incidents', value: summary.ragStaleAvoidanceIncidents ?? '' },
      { area: 'Multilingual & accessibility', metric: 'Observed language pairs', value: summary.multilingualPairsObserved.join(', ') },
      { area: 'Multilingual & accessibility', metric: 'Disfluency count', value: summary.disfluencyCount ?? '' },
      { area: 'Network impairments', metric: 'Loss %', value: summary.networkLossPct ?? '' },
      { area: 'Network impairments', metric: 'Jitter (ms)', value: summary.networkJitterMs ?? '' },
      { area: 'Network impairments', metric: 'Bandwidth (kbps)', value: summary.networkBandwidthKbps ?? '' },
      { area: 'Scale & reliability', metric: 'Reconnects', value: summary.reconnects },
      { area: 'Scale & reliability', metric: 'Errors total', value: summary.errorsTotal },
      { area: 'Security & compliance', metric: 'PII hits', value: summary.piiHits },
      { area: 'Observability & ops', metric: 'Agent ID', value: summary.agentId ?? '' },
      { area: 'Observability & ops', metric: 'User agent', value: summary.userAgent },
      { area: 'UX & handoff', metric: 'Handoff occurred', value: summary.handoffOccurred ?? '' },
    ];
    const kpiSheet = XLSX.utils.json_to_sheet(kpiRows);
    XLSX.utils.book_append_sheet(wb, kpiSheet, 'KPIs');

    XLSX.writeFile(wb, `telemetry-${summary.sessionId}.xlsx`);
  };

  return (
    <button onClick={handleExport} className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-50">
      Export Excel
    </button>
  );
}


