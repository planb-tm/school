export function RouteLoadingFallback() {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      <span className="route-loading__spinner" aria-hidden="true" />
      <span>Открываем раздел...</span>
    </div>
  );
}
