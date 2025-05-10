
  
    // Highlight current class based on time
    function highlightCurrentClass() {
      // Remove any existing highlights
      document.querySelectorAll('tr').forEach(row => {
        row.classList.remove('current-class');
      });
      
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentDay = now.getDay(); // 0=Sunday, 1=Monday, etc.
      
      // Only highlight if viewing today's timetable
      const activeTab = document.querySelector('.tab.active');
      if (!activeTab) return;
      
      const activeDay = activeTab.textContent.toLowerCase().trim();
      const dayMap = {monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6};
      
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
            }
          }
        });
      }
    }
    
 // Update current time display
    function updateCurrentTime() {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const activeTab = document.querySelector('.tab.active');
      
      if (activeTab) {
        const activeDay = activeTab.textContent.toLowerCase().trim();
        const timeElement = document.getElementById(`${activeDay}-time`);
        if (timeElement) {
          timeElement.textContent = `Current Time: ${timeString}`;
        }
      }
    }
    
    // Show selected day's content
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
      
      // Initial updates
      updateCurrentTime();
      highlightCurrentClass();
      
      // Set up periodic updates
      setInterval(() => {
        updateCurrentTime();
        highlightCurrentClass();
      }, 60000); // Update every minute
    });
  