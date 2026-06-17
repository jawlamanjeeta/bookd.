/**
 * Check if two time ranges overlap
 * Returns true if there is a conflict
 */
const hasOverlap = (startA, endA, startB, endB) => {
  return startA < endB && endA > startB;
};

/**
 * Generate alternative time slots around a conflicted slot
 * Returns up to 3 suggestions
 */
const generateAlternativeSlots = (requestedStart, requestedEnd, count = 3) => {
  const duration = requestedEnd - requestedStart; // in ms
  const suggestions = [];

  for (let i = 1; i <= count; i++) {
    const newStart = new Date(requestedStart.getTime() + i * duration);
    const newEnd = new Date(newStart.getTime() + duration);
    suggestions.push({ startTime: newStart, endTime: newEnd });
  }

  return suggestions;
};

module.exports = { hasOverlap, generateAlternativeSlots };