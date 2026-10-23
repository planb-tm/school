/** Compact mark for the planB team brand (not an Oriflame logo). */
export function BrandMark({
  className = '',
  size = 'md',
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <span
      className={`brand-mark brand-mark--${size} ${className}`.trim()}
      aria-hidden="true"
    >
      <span className="brand-mark__letter">B.</span>
    </span>
  );
}
