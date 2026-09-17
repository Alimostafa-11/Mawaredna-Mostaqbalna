import {
  ClipboardList,
  Handshake,
  Layers,
  Leaf,
  Package,
  RefreshCw,
  Route,
  Recycle,
  Settings2,
  Sprout,
  Thermometer,
  Truck,
  Wheat,
  type LucideIcon,
} from 'lucide-react';

/**
 * The API stores an icon *name* with each service and process stage so
 * non-developers can pick one from the admin panel. Mapping explicitly (rather
 * than importing all of lucide dynamically) keeps the client bundle small and
 * means an unknown name degrades to the leaf mark instead of crashing.
 */
const ICONS: Record<string, LucideIcon> = {
  'clipboard-list': ClipboardList,
  handshake: Handshake,
  layers: Layers,
  leaf: Leaf,
  package: Package,
  recycle: Recycle,
  'refresh-cw': RefreshCw,
  route: Route,
  'settings-2': Settings2,
  sprout: Sprout,
  thermometer: Thermometer,
  truck: Truck,
  wheat: Wheat,
};

interface ServiceIconProps {
  name: string;
  className?: string;
}

export function ServiceIcon({ name, className }: ServiceIconProps) {
  const Icon = ICONS[name] ?? Leaf;
  return <Icon aria-hidden className={className ?? 'size-6'} />;
}
