const SlotPicker = ({ startTime, endTime, onChange }) => {
  return (
    <div className="slot-picker">
      <div>
        <label>Start Time</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => onChange('startTime', e.target.value)}
        />
      </div>
      <div>
        <label>End Time</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => onChange('endTime', e.target.value)}
        />
      </div>
    </div>
  )
}

export default SlotPicker