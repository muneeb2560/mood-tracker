import { useEffect, useState } from "react"
import "./globals.css"

export default function MoodTracker() {
  // Track current displayed month/year
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [moodLogs, setMoodLogs] = useState([])

  useEffect(() => {
    // Load mood logs from localStorage when component mounts
    const storedMoodLogs = JSON.parse(localStorage.getItem("moodLogs") || "[]")
    setMoodLogs(storedMoodLogs)

    // Generate initial calendar
    generateCalendar(currentYear, currentMonth)
  }, [])

  // Re-generate calendar when month/year changes
  useEffect(() => {
    generateCalendar(currentYear, currentMonth)
  }, [currentYear, currentMonth, moodLogs])

  // Get today's date in ISO format (YYYY-MM-DD)
  function getTodayDateIST() {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  // Modified generateCalendar to accept parameters
  function generateCalendar(year, month) {
    const calendarContainer = document.getElementById("calendarContainer")
    if (!calendarContainer) return

    calendarContainer.innerHTML = ""

    // Update calendar header
    const calendarHeader = document.querySelector(".calendar-header")
    if (calendarHeader) {
      calendarHeader.textContent = new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" })
    }

    // Calculate days in month and first day of month
    const firstDayIndex = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // Create header row
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    dayNames.forEach((dayName) => {
      const headerCell = document.createElement("div")
      headerCell.className = "day-cell header"
      headerCell.innerText = dayName
      calendarContainer.appendChild(headerCell)
    })

    // Add empty cells before first day of month
    for (let i = 0; i < firstDayIndex; i++) {
      const emptyCell = document.createElement("div")
      emptyCell.className = "day-cell empty"
      calendarContainer.appendChild(emptyCell)
    }

    // Create day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("div")
      cell.className = "day-cell"

      const dateStr = new Date(year, month, day).toISOString().split("T")[0]

      // Add day number and mood display
      const dayNumber = document.createElement("div")
      dayNumber.className = "day-number"
      dayNumber.innerText = day
      cell.appendChild(dayNumber)

      const moodDiv = document.createElement("div")
      moodDiv.className = "mood-display"
      const log = moodLogs.find((entry) => entry.date === dateStr)
      moodDiv.innerText = log ? log.mood : ""
      cell.appendChild(moodDiv)

      calendarContainer.appendChild(cell)
    }
  }

  function saveMood(mood) {
    // Get today's date in ISO format
    const today = getTodayDateIST()

    // Create a copy of the current mood logs
    const updatedMoodLogs = [...moodLogs]

    // Check if today's mood is already logged; if so, update the mood
    const existingIndex = updatedMoodLogs.findIndex((log) => log.date === today)
    if (existingIndex !== -1) {
      updatedMoodLogs[existingIndex].mood = mood
    } else {
      // Otherwise, add a new entry with the current date and the selected mood
      updatedMoodLogs.push({ date: today, mood: mood })
    }

    // Save the updated mood logs to state and localStorage
    setMoodLogs(updatedMoodLogs)
    localStorage.setItem("moodLogs", JSON.stringify(updatedMoodLogs))

    // Update the calendar view
    generateCalendar(currentYear, currentMonth)
  }

  function handlePrevMonth() {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 0) {
        setCurrentYear((prevYear) => prevYear - 1)
        return 11
      }
      return prevMonth - 1
    })
  }

  function handleNextMonth() {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 11) {
        setCurrentYear((prevYear) => prevYear + 1)
        return 0
      }
      return prevMonth + 1
    })
  }

  return (
    <div className="container">
      <header>
        <h1>Daily Mood Tracker Calendar</h1>
        <p>Log your mood for each day and visualize your emotional trends on a calendar view.</p>
      </header>

      {/* Mood Picker Section */}
      <section className="mood-picker">
        <h2>Select Your Mood for Today</h2>
        <button className="mood-btn" onClick={() => saveMood("😊")} data-mood="😊">
          😊
        </button>
        <button className="mood-btn" onClick={() => saveMood("😢")} data-mood="😢">
          😢
        </button>
        <button className="mood-btn" onClick={() => saveMood("😐")} data-mood="😐">
          😐
        </button>
        <button className="mood-btn" onClick={() => saveMood("😄")} data-mood="😄">
          😄
        </button>
      </section>

      {/* Calendar Container */}
      <section className="calendar-section">
        <h2>Your Mood Calendar</h2>
        <div className="calendar-controls">
          <button className="carousel-btn prev-month" onClick={handlePrevMonth}>
            &lt;
          </button>
          <div className="calendar-header"></div>
          <button className="carousel-btn next-month" onClick={handleNextMonth}>
            &gt;
          </button>
        </div>
        <div id="calendarContainer"></div>
      </section>
    </div>
  )
}

