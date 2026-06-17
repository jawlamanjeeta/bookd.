import { formatSlot } from '../utils/formatSlot'

const ConflictAlert = ({ suggestions, onSelectSlot }) => {
  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className="conflict-alert">
      <h4>⚠️ That slot is taken. Try one of these:</h4>
      <ul>
        {suggestions.map((slot, i) => (
          <li key={i}>
            <span>{formatSlot(slot.startTime, slot.endTime)}</span>
            <button onClick={() => onSelectSlot(slot)}>Select</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ConflictAlert