export const isCloture = (status) => {
  if (!status) return false;
  const s = status.toLowerCase().trim();
  return s.includes('clôturé') || s.includes('cloturé') || s.includes('clotur') || s.includes('ferm');
};
export const isResolu = (status) => {
  if (!status) return false;
  const s = status.toLowerCase().trim();
  return s.includes('résolu') || s.includes('resolu');
};
export const isEnCours = (status) => {
  if (!status) return false;
  const s = status.toLowerCase().trim();
  return s.includes('cours') || s.includes('affect') || s.includes('attente') || s.includes('escalad');
};
export const isOuvert = (status) => {
  if (!status) return false;
  const s = status.toLowerCase().trim();
  return s.includes('ouvert') || s.includes('nouveau');
};

//  Couleurs status h
export const statusBadge = (status) => {
  if (!status) return 'bg-gray-100 text-gray-600';
  if (isCloture(status))
    return 'bg-blue-100 text-blue-700 border border-blue-200';
  if (isResolu(status))
    return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
  if (isEnCours(status))
    return 'bg-amber-100 text-amber-700 border border-amber-200';
  if (isOuvert(status))
    return 'bg-red-100 text-red-700 border border-red-200';
  return 'bg-gray-100 text-gray-600';
};

//  Normalisation priorité
export const normalizePriority = (p) => {
  if (!p) return '';
  const pr = p.toLowerCase().trim();
  if (pr.includes('critique')) return 'critique';
  if (pr.includes('majeur')) return 'majeur';
  if (pr.includes('mineur')) return 'mineur';
  return pr;
};

export const priorityLabel = (p) => {
  if (!p) return '—';
  return String(p).trim();
};

//  Couleurs priorité
export const priorityBadge = (p) => {
  if (!p) return 'bg-gray-50 text-gray-500 border border-gray-200';
  const pr = normalizePriority(p);
  if (pr === 'critique') return 'bg-red-100 text-red-700 border border-red-200';
  if (pr === 'majeur') return 'bg-orange-100 text-orange-700 border border-orange-200';
  if (pr === 'mineur') return 'bg-green-100 text-green-700 border border-green-200';
  return 'bg-gray-50 text-gray-500 border border-gray-200';
};