export const CINEMATIC_FRAMES = [
  {
    url: 'https://images.pexels.com/photos/12628400/pexels-photo-12628400.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'SILHOUETTE',
    subtitle: 'Architectural precision & restrained balance',
    phase: '01 / FORM'
  },
  {
    url: 'https://images.pexels.com/photos/15557047/pexels-photo-15557047.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'THE VAMP',
    subtitle: 'Full-grain vegetal calfskin, 14 SPI hand-stitched density',
    phase: '02 / ANATOMY'
  },
  {
    url: 'https://images.pexels.com/photos/9853346/pexels-photo-9853346.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'VELOCITY',
    subtitle: 'Engineered mesh upper with dual-density rebound core',
    phase: '03 / PROPULSION'
  },
  {
    url: 'https://images.pexels.com/photos/12740481/pexels-photo-12740481.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'STRUCTURE',
    subtitle: 'Reinforced heel counter over vulcanized gum foundation',
    phase: '04 / TENSION'
  },
  {
    url: 'https://images.pexels.com/photos/31650329/pexels-photo-31650329.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'TRACTION',
    subtitle: 'All-weather geometric lugs crafted for off-grid terrain',
    phase: '05 / SURFACE'
  },
  {
    url: 'https://images.pexels.com/photos/18202585/pexels-photo-18202585.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'EQUILIBRIUM',
    subtitle: 'The finished garment in effortless motion',
    phase: '06 / FINALE'
  }
];

export const FRAME_COUNT = CINEMATIC_FRAMES.length;

export const frameUrl = (i: number): string => {
  const idx = Math.max(0, Math.min(FRAME_COUNT - 1, i - 1));
  return CINEMATIC_FRAMES[idx].url;
};

export async function getCachedFrame(): Promise<Blob | null> {
  return null;
}

export type PreloadPhase = 'cache' | 'download' | 'decode';

export async function preloadAllFrames(
  onProgress: (done: number, total: number, phase: PreloadPhase) => void
): Promise<void> {
  let done = 0;
  onProgress(done, FRAME_COUNT, 'download');

  const promises = CINEMATIC_FRAMES.map((frame) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        done += 1;
        onProgress(done, FRAME_COUNT, 'decode');
        resolve();
      };
      img.onerror = () => {
        done += 1;
        onProgress(done, FRAME_COUNT, 'decode');
        resolve();
      };
      img.src = frame.url;
    });
  });

  await Promise.race([
    Promise.all(promises),
    new Promise((resolve) => setTimeout(resolve, 600)) // Guarantee no blocking
  ]);

  onProgress(FRAME_COUNT, FRAME_COUNT, 'decode');
}
