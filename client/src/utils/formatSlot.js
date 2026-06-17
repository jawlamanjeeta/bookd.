export const formatSlot = (startTime, endTime) => {
  const options = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  const start = new Date(startTime).toLocaleString(undefined, options)
  const end = new Date(endTime).toLocaleString(undefined, options)
  return `${start} → ${end}`
}