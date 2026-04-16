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

export const normalizePriority = (priority) => {
  if (priority === null || priority === undefined) return "";
  const raw = String(priority).toLowerCase().trim();

  if (
    raw === "1" || raw === "p1" || raw.includes("crit") || raw.includes("urgent") ||
    raw.includes("high") || raw.includes("severe")
  ) {
    return "critique";
  }

  if (
    raw === "2" || raw === "p2" || raw.includes("maje") || raw.includes("major") ||
    raw.includes("medium")
  ) {
    return "majeur";
  }

  if (
    raw === "3" || raw === "p3" || raw.includes("mine") || raw.includes("minor") ||
    raw.includes("low") || raw.includes("faible")
  ) {
    return "mineur";
  }

  return raw;
};

export const priorityLabel = (priority) => {
  const normalized = normalizePriority(priority);
  if (normalized === "critique") return "Critique";
  if (normalized === "majeur") return "Majeur";
  if (normalized === "mineur") return "Mineur";
  return "—";
};

export const statusBadge = (status) => {
  if (!status) return "bg-gray-100 text-gray-600";
  const s = status.toLowerCase().trim();
  if (s.includes("cloture") || s.includes("ferm")) return "bg-blue-100 text-blue-700 border border-blue-200";
  if (s.includes("resolu")) return "bg-emerald-100 text-emerald-700 border border-emerald-200";
  if (s.includes("cours") || s.includes("affect") || s.includes("attente") || s.includes("escalad")) return "bg-amber-100 text-amber-700 border border-amber-200";
  if (s.includes("ouvert") || s.includes("nouveau")) return "bg-red-100 text-red-700 border border-red-200";
  return "bg-gray-100 text-gray-600";
};

export const priorityBadge = (p) => {
  if (!p) return "bg-gray-50 text-gray-500 border border-gray-200";
  const pr = normalizePriority(p);
  if (pr === "critique") return "bg-red-100 text-red-700 border border-red-200";
  if (pr === "majeur") return "bg-orange-100 text-orange-700 border border-orange-200";
  if (pr === "mineur") return "bg-green-100 text-green-700 border border-green-200";
  return "bg-gray-50 text-gray-500 border border-gray-200";
};