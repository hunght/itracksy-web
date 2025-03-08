'use client';

import { useRouter } from 'next/navigation';

interface PageSizeSelectorProps {
  pageSize: number;
}

export default function PageSizeSelector({ pageSize }: PageSizeSelectorProps) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = e.target.value;
    router.push(`/admin?page=1&pageSize=${newPageSize}`);
  };

  return (
    <div className="mb-4 flex justify-end">
      <label htmlFor="pageSize" className="mr-2 self-center">
        Users per page:
      </label>
      <select
        id="pageSize"
        className="rounded border px-2 py-1"
        defaultValue={pageSize}
        onChange={handleChange}
      >
        {[10, 25, 50, 100].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
}
