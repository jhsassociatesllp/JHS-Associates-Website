import { useState } from 'react';
import { Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { downloadFile } from '../utils/download';
import './ExportExcelButton.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface Props {
  /** API path of the export, for example "/export/contacts". */
  path: string;
  /** Used only if the server sends no file name. */
  fallbackName: string;
  label?: string;
}

/** "Export Excel": downloads the whole list as a spreadsheet and says so (or says what went wrong). */
export default function ExportExcelButton({ path, fallbackName, label = 'Export Excel' }: Props) {
  const { token } = useAuth();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  const run = async () => {
    setBusy(true);
    setNote(null);
    try {
      const { count } = await downloadFile(`${API_BASE_URL}${path}`, token, fallbackName);
      setNote({ kind: 'ok', text: count === null ? 'Downloaded.' : `Downloaded ${count} row${count === 1 ? '' : 's'}.` });
      setTimeout(() => setNote(null), 4000);
    } catch (error) {
      setNote({ kind: 'error', text: error instanceof Error ? error.message : 'Could not download.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <span className="xl-export">
      <button type="button" className="xl-export__btn" onClick={run} disabled={busy}>
        <Download size={15} /> {busy ? 'Preparing…' : label}
      </button>
      {note && <span className={`xl-export__note xl-export__note--${note.kind}`} role={note.kind === 'error' ? 'alert' : 'status'}>{note.text}</span>}
    </span>
  );
}
