export function SkeletonCard() {
  return (
    <div className="stat-card space-y-3">
      <div className="skeleton h-4 w-24" />
      <div className="skeleton h-8 w-32" />
      <div className="skeleton h-3 w-20" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <tr>
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="px-4 py-3">
          <div className="skeleton h-4" style={{ width: `${60 + i * 8}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonChart() {
  return (
    <div className="stat-card">
      <div className="skeleton h-5 w-40 mb-4" />
      <div className="skeleton h-56 w-full" />
    </div>
  );
}
