export function downloadCalendarInvite(actionTitle, actionDesc) {
    // Set the reminder for tomorrow at 10:00 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    
    const end = new Date(tomorrow);
    end.setHours(10, 30, 0, 0); // 30-minute block
  
    // Format dates to strictly match the iCalendar specification (YYYYMMDDTHHMMSSZ)
    const formatDate = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
    // Build the .ics text file content
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//FootprintAware//Hack2Skill//EN',
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(tomorrow)}`,
      `DTEND:${formatDate(end)}`,
      `SUMMARY:🌱 Eco Action: ${actionTitle}`,
      `DESCRIPTION:${actionDesc}\\n\\nCommitment tracked via your FootprintAware Dashboard. Keep it up!`,
      'RRULE:FREQ=WEEKLY', // Makes it a recurring weekly habit
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M', // Reminder 15 mins before
      'DESCRIPTION:Reminder',
      'ACTION:DISPLAY',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  
    // Create a Blob and trigger the download
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `FootprintAware_${actionTitle.replace(/\s+/g, '_')}.ics`);
    
    try {
      document.body.appendChild(link);
      link.click();
    } finally {
      document.body.removeChild(link);
    }
  }