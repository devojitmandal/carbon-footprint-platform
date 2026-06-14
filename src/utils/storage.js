const STORAGE_KEY = 'footprint_tracker_v1';

export function saveCommitments(commitments) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(commitments));
    return true;
  } catch (e) {
    console.error('Failed to save commitments:', e);
    return false;
  }
}

export function loadCommitments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    
    return parsed;
  } catch (e) {
    console.error('Failed to load commitments:', e);
    return [];
  }
}

export function addCommitment(commitmentObject) {
  const existing = loadCommitments();
  const alreadyExists = existing.some(c => c.id === commitmentObject.id);
  
  if (alreadyExists) return existing;
  
  const updated = [...existing, commitmentObject];
  saveCommitments(updated);
  return updated;
}

export function removeCommitment(id) {
  const existing = loadCommitments();
  const updated = existing.filter(c => c.id !== id);
  saveCommitments(updated);
  return updated;
}

export function clearAllCommitments() {
  localStorage.removeItem(STORAGE_KEY);
}

export function calculateProjectedFootprint(originalTotal, commitments) {
  const totalSavings = commitments.reduce((sum, c) => sum + c.savingsKg, 0);
  const projected = originalTotal - totalSavings;
  return Math.max(projected, 0);
}