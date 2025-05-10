// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Auto-select today's tab
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = new Date().getDay();
  
  if (today >= 1 && today <= 6) { // Monday to Saturday
    const todayTab = document.querySelector(`.tab:nth-child(${today})`);
    if (todayTab) {
      todayTab.click();
    }
  }
  
  // Set up periodic updates
  setInterval(() => {
    highlightCurrentClass();
    updateCurrentTime();
  }, 60000); // Update every minute
});

// Switch between days
function showDay(day) {
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Remove active class from all tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected day's content
  document.getElementById(day).classList.add('active');
  
  // Add active class to clicked tab
  event.currentTarget.classList.add('active');
  
  // Update current class highlighting
  highlightCurrentClass();
  updateCurrentTime();
}

// Highlight current class based on time
function highlightCurrentClass() {
  // Remove existing highlights
  document.querySelectorAll('tr').forEach(row => {
    row.classList.remove('current-class');
  });
  
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentDay = now.getDay(); // 0=Sunday, 1=Monday, etc.
  
  // Get active day
  const activeTab = document.querySelector('.tab.active');
  if (!activeTab) return;
  
  const activeDay = activeTab.textContent.toLowerCase().trim();
  const dayMap = {
    monday: 1, 
    tuesday: 2, 
    wednesday: 3, 
    thursday: 4, 
    friday: 5, 
    saturday: 6
  };
  
  // Only highlight if viewing today's timetable
  if (dayMap[activeDay] === currentDay) {
    const rows = document.querySelectorAll('.tab-content.active tbody tr');
    
    rows.forEach(row => {
      const timeCell = row.cells[0];
      if (timeCell.textContent.includes('-')) {
        const [startTime, endTime] = timeCell.textContent.split('-').map(t => t.trim());
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        
        const currentTotalMinutes = currentHour * 60 + currentMinute;
        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;
        
        if (currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes) {
          row.classList.add('current-class');
          
          // Scroll to current class if not fully visible
          const rect = row.getBoundingClientRect();
          if (rect.bottom > window.innerHeight) {
            row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      }
    });
  }
}

// Update current time display
function updateCurrentTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  document.querySelectorAll('.current-time').forEach(el => {
    el.textContent = `Current Time: ${timeString}`;
  });
}