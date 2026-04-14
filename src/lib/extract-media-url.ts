const MAX_URL = 2048;

function ipfsUriToGateway(uri: string): string | null {
  const trimmed = uri.trim();
  const m = /^ipfs:\/\/(.+)$/i.exec(trimmed);
  if (!m) return null;
  let path = m[1].replace(/^\/+/, "");
  path = path.replace(/^ipfs\//i, "");
  if (!path || path.length > MAX_URL) return null;
  return `https://ipfs.io/ipfs/${path}`;
}

/**
 * Best-effort: pull the first http(s) or ipfs:// URL from deploy metadata / free text.
 * Only returns http(s) gateway URLs (ipfs:// is rewritten to ipfs.io).
 */
export function extractHttpOrIpfsUrl(...sources: (string | null | undefined)[]): string | null {
  for (const raw of sources) {
    if (raw == null) continue;
    const text = raw.trim();
    if (!text) continue;

    const ipfsWord = /\bipfs:\/\/[^\s"'<>]+/i.exec(text);
    if (ipfsWord) {
      const g = ipfsUriToGateway(ipfsWord[0]);
      if (g && g.length <= MAX_URL) return g;
    }

    const httpsWord = /\bhttps:\/\/[^\s"'<>]{4,2048}/i.exec(text);
    if (httpsWord && httpsWord[0].length <= MAX_URL) return httpsWord[0];

    const httpWord = /\bhttp:\/\/[^\s"'<>]{4,2048}/i.exec(text);
    if (httpWord && httpWord[0].length <= MAX_URL) return httpWord[0];
  }
  return null;
}
