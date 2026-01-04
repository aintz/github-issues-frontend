type LabelsProps = {
  labels: { id: string; name: string; color: string }[];
};

export default function Labels({ labels }: LabelsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {labels.length > 0 ? (
        labels.map((label) => (
          <span
            key={label.id}
            className="border-gh-muted inline-block rounded-full border px-2 py-1 text-xs font-semibold break-words"
            style={{
              color: `#${label.color}`,
              backgroundColor: `#${label.color}22`,
              borderColor: `#${label.color}88`,
            }}
          >
            {label.name}
          </span>
        ))
      ) : (
        <p className="text-gh-text-muted text-sm"></p>
      )}
    </div>
  );
}
