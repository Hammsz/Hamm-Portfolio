type InteractionAudio = {
  dispose: () => void;
  play: () => void;
  setMuted: (muted: boolean) => void;
};

export function createInteractionAudio(): InteractionAudio {
  let context: AudioContext | undefined;
  let isMuted = false;

  const synthesizeTick = () => {
    if (!context || context.state !== "running") return;

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(760, now);
    oscillator.frequency.exponentialRampToValueAtTime(430, now + 0.026);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.018, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.032);
  };

  return {
    play() {
      if (isMuted || typeof window.AudioContext === "undefined") return;

      if (!context) {
        try {
          context = new window.AudioContext();
        } catch {
          return;
        }
      }

      if (context.state === "suspended") {
        void context.resume().then(synthesizeTick).catch(() => undefined);
      } else {
        synthesizeTick();
      }
    },
    setMuted(muted) {
      isMuted = muted;
    },
    dispose() {
      if (context && context.state !== "closed") {
        void context.close().catch(() => undefined);
      }
      context = undefined;
    },
  };
}
