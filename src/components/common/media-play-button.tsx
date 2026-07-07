"use client";

import { Headphones, Play } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface MediaSource {
  /** Embeddable YouTube URL (from getYouTubeEmbedUrl), when this is a video. */
  embedUrl?: string | null;
  /** Direct audio file URL, when this is audio-only. */
  audioUrl?: string | null;
  /** Shown as the dialog heading. */
  title: string;
}

/**
 * Plays a lecture / dvar-torah inside the site (never sends the visitor off to
 * YouTube). Opens a modal with an embedded player, so the surrounding filtered
 * list stays exactly as it was underneath.
 */
export function MediaPlayButton({
  media,
  label,
  variant = "gold",
}: {
  media: MediaSource;
  label: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const [open, setOpen] = useState(false);
  // Pick the icon from the (serializable) media shape — a component can't be
  // passed across the server→client boundary.
  const Icon = !media.embedUrl && media.audioUrl ? Headphones : Play;
  // Autoplay once the modal is open; `&` is safe because embedUrl has no query.
  const src = media.embedUrl
    ? `${media.embedUrl}?autoplay=1&rel=0`
    : null;

  return (
    <>
      <Button variant={variant} size="sm" onClick={() => setOpen(true)}>
        <Icon className="size-4" />
        {label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl gap-4 p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="pe-8 text-start font-serif text-lg text-navy-900">
              {media.title}
            </DialogTitle>
          </DialogHeader>

          {open && src ? (
            <div className="aspect-video overflow-hidden rounded-xl bg-black ring-1 ring-gold-500/20">
              <iframe
                src={src}
                title={media.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          ) : open && media.audioUrl ? (
            <audio controls autoPlay src={media.audioUrl} className="w-full">
              <track kind="captions" />
            </audio>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
