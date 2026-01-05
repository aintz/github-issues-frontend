type Label = {
  name: string;
  color: string;
  id?: string;
};

type LabelsProps = {
  labels: (Label | null)[];
};

export default function Labels({ labels }: LabelsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {labels.length > 0 ? (
        <>
          {labels
            .filter((label): label is Label => label !== null)
            .map((label) => (
              <span
                key={label.id ?? `${label.name}-${label.color}`}
                className="border-gh-muted inline-block rounded-full border px-2 py-1 text-xs font-semibold break-words"
                style={{
                  color: `#${label.color}`,
                  backgroundColor: `#${label.color}22`,
                  borderColor: `#${label.color}88`,
                }}
              >
                {label.name}
              </span>
            ))}
        </>
      ) : null}
    </div>
  );
}
