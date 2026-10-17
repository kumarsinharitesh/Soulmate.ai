type MarkKind = 'link' | 'profile' | 'dialogue' | 'ranking' | 'source' | 'camera' | 'shield';

export function SignalMark({ kind, label, small = false }: { kind: MarkKind; label?: string; small?: boolean }) {
  return (
    <span className={`signal-mark signal-mark-${kind}${small ? ' signal-mark-small' : ''}`} aria-label={label} role={label ? 'img' : undefined}>
      <i /><i /><i />
    </span>
  );
}
