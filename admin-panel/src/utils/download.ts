// Downloads a protected file (an Excel report) from the API with the admin's login, and saves it under the server's file name.

export interface DownloadResult {
  filename: string;
  count: number | null;
}

export async function downloadFile(url: string, token: string | null, fallbackName: string): Promise<DownloadResult> {
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    const detail = Array.isArray(err?.detail) ? err.detail[0]?.msg : err?.detail;
    throw new Error(
      response.status === 403 ? 'Only a Super Admin or HR Admin can download this.'
        : typeof detail === 'string' ? detail : 'Could not prepare the Excel file. Please try again.',
    );
  }
  const blob = await response.blob();
  const named = /filename="([^"]+)"/.exec(response.headers.get('Content-Disposition') || '');
  const filename = named?.[1] || fallbackName;
  const count = response.headers.get('X-Application-Count');
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
  return { filename, count: count === null ? null : Number(count) };
}
