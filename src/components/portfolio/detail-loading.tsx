interface DetailLoadingProps {
  label: string;
}

export function DetailLoading({ label }: DetailLoadingProps) {
  return (
    <div className="site-container section-space-both min-h-80" role="status">
      <p>{label}</p>
    </div>
  );
}
