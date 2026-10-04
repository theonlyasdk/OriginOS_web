import { eventBus } from '../core/event_bus.js';

/**
 * iOS Inspired Calendar Logic
 * Supports Month view, Day hourly schedule, light & dark mode, and adding events.
 */
class CalendarApp {
  constructor() {
    this.currentDate = new Date();
    this.selectedDate = new Date();
    this.currentView = 'month'; // 'month' or 'day'
    this.isDarkMode = false;
    this.events = this.loadEvents();
  }

  loadEvents() {
    try {
      const stored = localStorage.getItem('origin_calendar_events');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not load saved events:', e);
    }

    // Default sample events inspired by the screenshots
    return [
      { id: '1', date: '2026-04-01', title: 'April Fools', color: 'blue', time: '10:00' },
      { id: '2', date: '2026-04-01', title: 'Lunch with Mom', color: 'red', time: '12:00' },
      { id: '3', date: '2026-04-03', title: 'Good Friday', color: 'blue', time: '09:00' },
      { id: '4', date: '2026-04-04', title: 'Hike with Alex', color: 'green', time: '08:30' },
      { id: '5', date: '2026-04-05', title: 'Easter', color: 'blue', time: '11:00' },
      { id: '6', date: '2026-04-06', title: 'Portfolio Review', color: 'red', time: '14:00' },
      { id: '7', date: '2026-04-07', title: 'Art Workshop', color: 'purple', time: '16:00' },
      { id: '8', date: '2026-04-15', title: 'Tax Day', color: 'blue', time: '15:00' }
    ];
  }

  saveEvents() {
    try {
      localStorage.setItem('origin_calendar_events', JSON.stringify(this.events));
    } catch (e) {
      console.warn('Could not save events:', e);
    }
  }

  init() {
    const appEl = document.getElementById('calendar_app');
    if (!appEl) return;

    // Check system or saved dark mode state
    const savedDark = localStorage.getItem('origin_calendar_theme');
    if (savedDark === 'dark' || (savedDark === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.setTheme(true);
    }

    this.bindEvents();
    this.renderMonthView();
    this.renderDayTimeline();
  }

  setTheme(isDark) {
    this.isDarkMode = isDark;
    const appEl = document.getElementById('calendar_app');
    if (appEl) {
      if (isDark) {
        appEl.classList.add('dark');
      } else {
        appEl.classList.remove('dark');
      }
    }
    localStorage.setItem('origin_calendar_theme', isDark ? 'dark' : 'light');
    eventBus.emit('calendar:theme', { isDark });
  }

  toggleTheme() {
    this.setTheme(!this.isDarkMode);
  }

  formatDateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  renderMonthView() {
    const monthTitleEl = document.getElementById('cal_month_title');
    const yearBtnEl = document.getElementById('cal_year_btn');
    const gridEl = document.getElementById('cal_month_grid');
    if (!gridEl) return;

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth();

    if (monthTitleEl) monthTitleEl.textContent = monthNames[month];
    if (yearBtnEl) yearBtnEl.textContent = String(year);

    gridEl.innerHTML = '';

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const todayStr = this.formatDateKey(new Date());
    const selectedStr = this.formatDateKey(this.selectedDate);

    // Days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const cell = document.createElement('div');
      cell.className = 'cal-day-cell other-month';
      cell.innerHTML = `<div class="cal-day-number">${dayNum}</div>`;
      gridEl.appendChild(cell);
    }

    // Days for current month
    for (let day = 1; day <= totalDays; day++) {
      const thisDate = new Date(year, month, day);
      const dateKey = this.formatDateKey(thisDate);
      const isToday = dateKey === todayStr;
      const isSelected = dateKey === selectedStr;

      const cell = document.createElement('div');
      cell.className = `cal-day-cell ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`;
      cell.setAttribute('data-date', dateKey);

      // Event badges for this day
      const dayEvents = this.events.filter(e => e.date === dateKey);
      let badgesHtml = '';
      if (dayEvents.length > 0) {
        badgesHtml += '<div class="cal-event-pills">';
        dayEvents.slice(0, 2).forEach(ev => {
          badgesHtml += `<div class="cal-pill ${ev.color || 'blue'}">${ev.title}</div>`;
        });
        if (dayEvents.length > 2) {
          badgesHtml += `<div class="cal-pill-more">+${dayEvents.length - 2}</div>`;
        }
        badgesHtml += '</div>';
      }

      cell.innerHTML = `
        <div class="cal-day-number">${day}</div>
        ${badgesHtml}
      `;

      cell.addEventListener('click', () => {
        this.selectedDate = thisDate;
        this.renderMonthView();
        this.updateDayHeader();
      });

      gridEl.appendChild(cell);
    }
  }

  renderDayTimeline() {
    const timelineEl = document.getElementById('cal_hours_timeline');
    if (!timelineEl) return;

    this.updateDayHeader();
    timelineEl.innerHTML = '';

    const selectedStr = this.formatDateKey(this.selectedDate);
    const dayEvents = this.events.filter(e => e.date === selectedStr);

    for (let hour = 0; hour < 24; hour++) {
      const hourStr = `${String(hour).padStart(2, '0')}:00`;
      const row = document.createElement('div');
      row.className = 'cal-hour-row';

      const label = document.createElement('div');
      label.className = 'cal-hour-label';
      label.textContent = hourStr;

      const slot = document.createElement('div');
      slot.className = 'cal-hour-slot';

      // Check if any event falls in this hour
      dayEvents.forEach(ev => {
        if (ev.time && ev.time.startsWith(String(hour).padStart(2, '0'))) {
          const evEl = document.createElement('div');
          evEl.className = 'cal-schedule-event';
          evEl.textContent = `${ev.title} (${ev.time})`;
          slot.appendChild(evEl);
        }
      });

      row.appendChild(label);
      row.appendChild(slot);
      timelineEl.appendChild(row);
    }
  }

  updateDayHeader() {
    const bannerEl = document.getElementById('cal_day_header_banner');
    if (!bannerEl) return;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dName = days[this.selectedDate.getDay()];
    const mName = months[this.selectedDate.getMonth()];
    const dNum = this.selectedDate.getDate();
    const yNum = this.selectedDate.getFullYear();
    bannerEl.textContent = `${dName} — ${mName} ${dNum}, ${yNum}`;
  }

  switchView(viewName) {
    this.currentView = viewName;
    const monthGrid = document.getElementById('cal_month_grid');
    const dayView = document.getElementById('cal_day_view');
    const segMonth = document.getElementById('cal_seg_month');
    const segDay = document.getElementById('cal_seg_day');

    if (viewName === 'month') {
      if (monthGrid) monthGrid.style.display = 'grid';
      if (dayView) dayView.style.display = 'none';
      if (segMonth) segMonth.classList.add('active');
      if (segDay) segDay.classList.remove('active');
    } else {
      if (monthGrid) monthGrid.style.display = 'none';
      if (dayView) dayView.style.display = 'flex';
      if (segDay) segDay.classList.add('active');
      if (segMonth) segMonth.classList.remove('active');
      this.renderDayTimeline();
    }
  }

  openEventModal() {
    const modal = document.getElementById('cal_event_modal');
    const badge = document.getElementById('cal_modal_date_badge');
    if (!modal) return;
    if (badge) {
      badge.textContent = this.formatDateKey(this.selectedDate);
    }
    modal.classList.add('open');
  }

  closeEventModal() {
    const modal = document.getElementById('cal_event_modal');
    if (modal) modal.classList.remove('open');
  }

  saveNewEvent() {
    const titleInput = document.getElementById('cal_new_title');
    const timeInput = document.getElementById('cal_new_time');
    const title = titleInput ? titleInput.value.trim() : '';
    const time = timeInput ? timeInput.value : '12:00';

    if (!title) return;

    const colors = ['blue', 'red', 'green', 'purple'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newEvent = {
      id: String(Date.now()),
      date: this.formatDateKey(this.selectedDate),
      title,
      time,
      color: randomColor
    };

    this.events.push(newEvent);
    this.saveEvents();
    this.closeEventModal();
    if (titleInput) titleInput.value = '';

    this.renderMonthView();
    this.renderDayTimeline();
  }

  bindEvents() {
    // Theme toggle
    const themeBtn = document.getElementById('cal_theme_toggle_btn');
    if (themeBtn) themeBtn.addEventListener('click', () => this.toggleTheme());

    // Month Navigation
    const prevBtn = document.getElementById('cal_prev_month_btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.selectedDate = new Date(
          this.selectedDate.getFullYear(),
          this.selectedDate.getMonth() - 1,
          1
        );
        this.renderMonthView();
      });
    }

    // Today button
    const todayBtn = document.getElementById('cal_today_btn');
    if (todayBtn) {
      todayBtn.addEventListener('click', () => {
        this.selectedDate = new Date();
        this.renderMonthView();
        this.renderDayTimeline();
      });
    }

    // Segmented View Switchers
    const segMonth = document.getElementById('cal_seg_month');
    const segDay = document.getElementById('cal_seg_day');
    if (segMonth) segMonth.addEventListener('click', () => this.switchView('month'));
    if (segDay) segDay.addEventListener('click', () => this.switchView('day'));

    // Add Event Modal
    const addBtn = document.getElementById('cal_add_event_btn');
    const cancelBtn = document.getElementById('cal_modal_cancel_btn');
    const saveBtn = document.getElementById('cal_modal_save_btn');

    if (addBtn) addBtn.addEventListener('click', () => this.openEventModal());
    if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeEventModal());
    if (saveBtn) saveBtn.addEventListener('click', () => this.saveNewEvent());
  }
}

export const calendarApp = new CalendarApp();

if (typeof window !== 'undefined') {
  window.OriginCalendar = calendarApp;
}
