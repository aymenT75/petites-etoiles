// Vérifie au build qu'une vidéo YouTube est réellement visible (miniature publique disponible).
// Les vidéos repassées en « privé » ne doivent ni être liées ni afficher de miniature cassée.
// En cas de panne réseau on garde la vidéo (on ne masque rien par erreur).
const cache = new Map<string, Promise<boolean>>();

export function isPublic(id: string | null | undefined): Promise<boolean> {
  if (!id) return Promise.resolve(false);
  let p = cache.get(id);
  if (!p) {
    p = fetch(`https://img.youtube.com/vi/${id}/hqdefault.jpg`, { method: 'HEAD' })
      .then((r) => r.ok)
      .catch(() => true);
    cache.set(id, p);
  }
  return p;
}

export async function onlyPublic<T extends Record<string, any>>(items: T[], keys: string[]): Promise<T[]> {
  return Promise.all(items.map(async (it) => {
    const out: Record<string, any> = { ...it };
    for (const k of keys) out[k] = (await isPublic(it[k])) ? it[k] : null;
    return out as T;
  }));
}
