"use client";

import { useRouter } from "next/navigation";
import { ActionButton } from "@/components/safecircle/buttons/ActionButton";
import { LocationStatusItem } from "@/components/safecircle/cards/LocationStatusItem";
import { AlertBackground } from "@/components/safecircle/effects/AlertBackground";
import { PulseRing } from "@/components/safecircle/effects/PulseRing";
import {
  StaggerList,
  staggerItemVariants,
} from "@/components/safecircle/effects/StaggerList";
import { MapCanvas } from "@/components/safecircle/map/MapCanvas";
import { NeighborDot } from "@/components/safecircle/map/NeighborDot";
import { MobileShell } from "@/components/safecircle/shell/MobileShell";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { copy } from "@/lib/copy";

/**
 * Panic / SOS Active screen. The user has triggered the SOS button and is now
 * in active-distress mode: location is being broadcast to trusted contacts,
 * the screen pulses red, and we surface a list of who's been notified.
 *
 * The single exit path is the "Cancel SOS" button at the bottom, which opens
 * a confirm dialog (defensive — we don't want an accidental tap to silently
 * end an emergency) before routing back to the home screen.
 */
export default function PanicPage() {
  const router = useRouter();

  return (
    <MobileShell showNav={false} showStatusBar={true}>
      <div className="relative min-h-full">
        <AlertBackground tone="red" />

        <div className="relative z-10 flex flex-col min-h-full px-5 py-6 space-y-5 overflow-y-auto">
          {/* SOS header */}
          <div className="text-center space-y-2">
            <div className="relative inline-flex items-center justify-center">
              <PulseRing count={3} color="var(--color-red-alert)" size={80} />
              <span className="text-5xl relative z-10">🆘</span>
            </div>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">
              {copy.panic.title}
            </h1>
            <p className="text-base text-white/80">{copy.panic.description}</p>
          </div>

          {/* Mini map — your position (green) plus a few nearby neighbours (gold) */}
          <div className="rounded-2xl overflow-hidden">
            <MapCanvas viewBox="0 0 390 200">
              <NeighborDot
                x={195}
                y={100}
                color="var(--color-green-safe)"
                size={14}
              />
              <NeighborDot x={120} y={60} delay={0.2} />
              <NeighborDot x={260} y={80} delay={0.4} />
              <NeighborDot x={150} y={150} delay={0.6} />
              <NeighborDot x={280} y={140} delay={0.8} />
            </MapCanvas>
          </div>

          {/* Contacts section */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Kontakter varslet
            </p>
            <StaggerList className="space-y-2">
              {copy.panic.contacts.map((contact) => (
                <LocationStatusItem
                  key={contact.name}
                  name={contact.name}
                  distance={contact.distance}
                  variants={staggerItemVariants}
                />
              ))}
            </StaggerList>
          </div>

          {/* Footer caption */}
          <p className="text-xs text-center text-white/40">
            {copy.panic.footer}
          </p>

          {/* Cancel SOS — confirm dialog guards against accidental dismissal */}
          <div className="mt-auto pt-4">
            <Dialog>
              <DialogTrigger asChild>
                <ActionButton variant="secondary">
                  {copy.panic.cancel}
                </ActionButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{copy.panic.cancelDialog.title}</DialogTitle>
                  <DialogDescription>
                    {copy.panic.cancelDialog.description}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2">
                  <DialogClose asChild>
                    <ActionButton variant="secondary">
                      {copy.panic.cancelDialog.cancel}
                    </ActionButton>
                  </DialogClose>
                  <ActionButton
                    variant="danger"
                    onClick={() => router.push("/")}
                  >
                    {copy.panic.cancelDialog.confirm}
                  </ActionButton>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
