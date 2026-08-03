import * as React from "react";
import { Upload, X, GripVertical, Loader as Loader2, Image as ImageIcon } from "lucide-react";

import { supabase, CAR_IMAGES_BUCKET } from "@/lib/supabase";
import { cn } from "@/lib/utils";

/**
 * ImageUploader — multi-image upload to Supabase Storage with preview,
 * reorder (move up/down), and remove before/after save.
 *
 * Props:
 *  - value: current list of public URLs (already saved or just uploaded)
 *  - onChange: called with the new ordered list of URLs
 *
 * Uploaded files are stored under `car-images/<uuid>.<ext>` and immediately
 * reflected in the preview. Removal deletes the object from Storage only if
 * it belongs to this bucket (best-effort — orphaned files are harmless).
 */
export interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  carId?: string;
}

export function ImageUploader({ value, onChange, carId }: ImageUploaderProps) {
  const [uploading, setUploading] = React.useState(false);
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const uploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const path = `${carId ?? crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage
          .from(CAR_IMAGES_BUCKET)
          .upload(path, file, { upsert: false });
        if (error) {
          // If a name collision happens, append a short suffix.
          if (error.message.includes("already")) {
            const alt = `${carId ?? crypto.randomUUID()}-${Date.now()}.${ext}`;
            const { error: err2 } = await supabase.storage
              .from(CAR_IMAGES_BUCKET)
              .upload(alt, file, { upsert: false });
            if (err2) throw err2;
            const { data: pub2 } = supabase.storage.from(CAR_IMAGES_BUCKET).getPublicUrl(alt);
            newUrls.push(pub2.publicUrl);
          } else {
            throw error;
          }
        } else {
          const { data: pub } = supabase.storage.from(CAR_IMAGES_BUCKET).getPublicUrl(path);
          newUrls.push(pub.publicUrl);
        }
      }
      onChange([...value, ...newUrls]);
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'envoi de l'image : " + (e as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeAt = async (index: number) => {
    const url = value[index];
    // Best-effort delete from storage
    try {
      const path = url.split("/car-images/")[1];
      if (path) await supabase.storage.from(CAR_IMAGES_BUCKET).remove([path]);
    } catch {
      /* ignore */
    }
    const next = value.filter((_, i) => i !== index);
    onChange(next);
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Dropzone */}
      <label
        htmlFor="car-image-upload"
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-hairline bg-surface/40 p-8 text-center transition-colors hover:border-gold/40 hover:bg-surface/60"
      >
        {uploading ? (
          <>
            <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden />
            <span className="text-body-sm text-muted-foreground">Envoi en cours…</span>
          </>
        ) : (
          <>
            <Upload className="size-6 text-muted-foreground" aria-hidden />
            <span className="text-body-sm text-foreground/80">
              Cliquez ou glissez des images ici
            </span>
            <span className="text-caption text-muted-foreground">JPG, PNG, WebP</span>
          </>
        )}
        <input
          id="car-image-upload"
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => uploadFiles(e.target.files)}
          disabled={uploading}
        />
      </label>

      {/* Previews */}
      {value.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {value.map((url, i) => (
            <div
              key={url + i}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-hairline"
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null && dragIndex !== i) move(dragIndex, i);
                setDragIndex(null);
              }}
            >
              <img src={url} alt={`Image ${i + 1}`} className="h-full w-full object-cover" />
              {/* Order badge */}
              <span className="absolute start-2 top-2 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-foreground backdrop-blur">
                {i + 1}
              </span>
              {/* Controls */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  disabled={i === 0}
                  aria-label="Déplacer à gauche"
                  className="grid size-8 cursor-pointer place-items-center rounded-full border border-hairline bg-background/80 text-foreground transition-colors hover:border-gold/40 hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <GripVertical className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  aria-label="Supprimer cette image"
                  className="grid size-8 cursor-pointer place-items-center rounded-full border border-destructive/40 bg-background/80 text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
          <ImageIcon className="size-4" aria-hidden />
          Aucune image pour le moment.
        </div>
      )}
      {value.length > 0 ? (
        <p className="text-caption text-muted-foreground">
          Glissez pour réordonner. La première image est utilisée sur la carte.
        </p>
      ) : null}
    </div>
  );
}
