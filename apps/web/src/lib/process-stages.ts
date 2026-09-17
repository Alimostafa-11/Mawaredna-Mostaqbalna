/**
 * "من المخلفات إلى منتج" — the ten-stage chain from the brief.
 *
 * Labels live in the message catalogues under `process.stages.<key>` rather
 * than here, so the chain stays translatable without a database round-trip.
 */
export interface ProcessStage {
  key: string;
  icon: string;
}

export const PROCESS_STAGES: ProcessStage[] = [
  { key: 'residues', icon: 'wheat' },
  { key: 'collection', icon: 'truck' },
  { key: 'transport', icon: 'route' },
  { key: 'aggregation', icon: 'layers' },
  { key: 'processing', icon: 'settings-2' },
  { key: 'fermentation', icon: 'thermometer' },
  { key: 'turning', icon: 'refresh-cw' },
  { key: 'finishing', icon: 'package' },
  { key: 'compost', icon: 'sprout' },
  { key: 'field-use', icon: 'leaf' },
];
