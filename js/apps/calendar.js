import { eventBus } from '../core/event_bus.js';
import { enableDragScroll } from '../core/drag_scroll.js';

/**
 * iOS Calendar App Logic
 * - Automatic System Theme Detection (removes in-app toggle)
 * - Spring Transitions between Month and Day views
 * - Drag-to-dismiss gesture on New Event sheet (mouse + touch)
 * - Click-outside-to-close on modal backdrop
 */
class CalendarApp {
  constructor() {
    this.currentDate = new Date();
    this.selectedDate = new Date();
    this.currentView = 'month'; // 'month' or 'day'
    this.events = this.loadEvents();

    // Sheet gesture dragging state
    this.isDraggingSheet = false;
    this.dragStartY = 0;
    this.currentDragY = 0;
  }

  loadEvents() {
    try {
      const stored = localStorage.getItem('origin_calendar_events');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not load saved events:', e);
    }

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

    this.setupSystemThemeSync();
    this.bindEvents();
    this.setupSheetGesture();
    this.setupMonthSwipe();
    enableDragScroll(document.getElementById('cal_hours_timeline'));
    this.renderMonthView();
    this.renderDayTimeline();
  }

  setupSystemThemeSync() {
    const updateTheme = () => {
      const appEl = document.getElementById('calendar_app');
      if (!appEl) return;
      const isDark = (typeof window.dark_mode !== 'undefined' && window.dark_mode === 1) ||
        document.body.classList.contains('dark-mode') ||
        document.documentElement.getAttribute('data-theme') === 'dark';

      if (isDark) {
        appEl.classList.add('dark');
        appEl.classList.remove('light');
      } else {
        appEl.classList.remove('dark');
        appEl.classList.add('light');
      }
    };

    updateTheme();

    eventBus.on('state:theme', updateTheme);
    eventBus.on('state:change', updateTheme);
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

    if (monthTitleEl) monthTitleEl.textContent = `${monthNames[month]} ${year}`;
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

      const dayEvents = this.events.filter(e => e.date === dateKey);
      let badgesHtml = '';
      if (dayEvents.length > 0) {
        badgesHtml += '<div class="cal-event-pills">';
        dayEvents.slice(0, 3).forEach(ev => {
          badgesHtml += `<div class="cal-pill ${ev.color || 'blue'}"></div>`;
        });
        badgesHtml += '</div>';
      }

      cell.innerHTML = `
        <div class="cal-day-number">${day}</div>
        ${badgesHtml}
      `;

      cell.addEventListener('click', () => {
        this.selectedDate = thisDate;
        const allCells = gridEl.querySelectorAll('.cal-day-cell');
        allCells.forEach(c => {
          if (c.getAttribute('data-date') === dateKey) {
            c.classList.add('is-selected');
          } else {
            c.classList.remove('is-selected');
          }
        });
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
      const h12 = hour % 12 === 0 ? 12 : hour % 12;
      const suffix = hour < 12 ? 'AM' : 'PM';
      const hourStr = `${h12} ${suffix}`;
      const row = document.createElement('div');
      row.className = 'cal-hour-row';

      const label = document.createElement('div');
      label.className = 'cal-hour-label';
      label.textContent = hourStr;

      const slot = document.createElement('div');
      slot.className = 'cal-hour-slot';

      dayEvents.forEach(ev => {
        const evHour = ev.time ? parseInt(ev.time.split(':')[0], 10) : -1;
        if (evHour === hour) {
          const evEl = document.createElement('div');
          evEl.className = 'cal-schedule-event';
          let chipTime = ev.time || '';
          const m = /^(\d{1,2}):(\d{2})/.exec(chipTime);
          if (m) {
            const h = parseInt(m[1], 10);
            const h12 = h % 12 === 0 ? 12 : h % 12;
            chipTime = `${h12}:${m[2]} ${h < 12 ? 'AM' : 'PM'}`;
          }
          evEl.textContent = `${ev.title} (${chipTime})`;
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
    if (this.currentView === viewName) return;
    this.currentView = viewName;

    const monthGrid = document.getElementById('cal_month_grid');
    const dayView = document.getElementById('cal_day_view');
    const segMonth = document.getElementById('cal_seg_month');
    const segDay = document.getElementById('cal_seg_day');

    if (viewName === 'month') {
      if (segMonth) segMonth.classList.add('active');
      if (segDay) segDay.classList.remove('active');

      if (dayView) {
        dayView.style.opacity = '0';
        dayView.style.transform = 'scale(1.04)';
      }
      setTimeout(() => {
        if (dayView) dayView.style.display = 'none';
        if (monthGrid) {
          monthGrid.classList.remove('view-hidden');
          monthGrid.style.display = 'grid';
          requestAnimationFrame(() => {
            monthGrid.style.opacity = '1';
            monthGrid.style.transform = 'scale(1)';
          });
        }
      }, 150);
    } else {
      if (segDay) segDay.classList.add('active');
      if (segMonth) segMonth.classList.remove('active');

      if (monthGrid) {
        monthGrid.style.opacity = '0';
        monthGrid.style.transform = 'scale(0.94)';
      }
      setTimeout(() => {
        if (monthGrid) monthGrid.style.display = 'none';
        if (dayView) {
          dayView.style.display = 'flex';
          this.renderDayTimeline();
          requestAnimationFrame(() => {
            dayView.style.opacity = '1';
            dayView.style.transform = 'scale(1)';
          });
        }
      }, 150);
    }
  }

  openEventModal() {
    const modal = document.getElementById('cal_event_modal');
    const card = document.getElementById('cal_modal_card');
    const badge = document.getElementById('cal_modal_date_badge');
    if (!modal) return;

    if (badge) {
      badge.textContent = this.formatDateKey(this.selectedDate);
    }
    if (card) {
      card.style.transform = '';
      card.style.transition = 'transform 0.42s cubic-bezier(0.2, 0.9, 0.3, 1.05)';
    }

    modal.style.display = 'flex';
    requestAnimationFrame(() => {
      modal.classList.add('open');
    });
  }

  closeEventModal() {
    const modal = document.getElementById('cal_event_modal');
    const card = document.getElementById('cal_modal_card');
    if (!modal) return;

    if (card) {
      card.style.transform = 'translateY(100%)';
      card.style.transition = 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)';
    }
    modal.classList.remove('open');
    setTimeout(() => {
      modal.style.display = 'none';
      if (card) card.style.transform = '';
    }, 280);
  }

  setupMonthSwipe() {
    const wrapper = document.getElementById('calendar_app')?.querySelector('.cal-views-wrapper');
    const grid = document.getElementById('cal_month_grid');
    const dayView = document.getElementById('cal_day_view');
    if (!wrapper) return;

    let startX = 0, startY = 0, dx = 0, dragging = false, pointerId = null, locked = false, isHorizontal = false, lastSwipe = 0;
    const THRESHOLD = 60;

    const target = () => (this.currentView === 'month' ? grid : dayView);
    const step = (dir) => {
      if (this.currentView === 'month') {
        this.selectedDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + dir, 1);
        this.renderMonthView();
      } else {
        this.selectedDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() + dir);
        this.renderMonthView();
        this.renderDayTimeline();
      }
    };
    const animateIn = (dir, el) => {
      if (!el) return;
      el.style.transition = 'none';
      el.style.transform = `translateX(${dir * 40}px)`;
      el.style.opacity = '0.4';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.transition = 'transform 0.28s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease';
        el.style.transform = 'translateX(0)';
        el.style.opacity = '1';
        setTimeout(() => { el.style.transition = ''; el.style.transform = ''; el.style.opacity = ''; }, 300);
      }));
    };

    wrapper.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      if (document.getElementById('cal_event_modal')?.classList.contains('open')) return;
      dragging = true; locked = false; isHorizontal = false;
      pointerId = e.pointerId; startX = e.clientX; startY = e.clientY; dx = 0;
      try { wrapper.setPointerCapture(e.pointerId); } catch (_) {}
    });

    wrapper.addEventListener('pointermove', (e) => {
      if (!dragging || e.pointerId !== pointerId) return;
      const ddx = e.clientX - startX;
      const ddy = e.clientY - startY;
      if (!locked && Math.abs(ddx) + Math.abs(ddy) > 10) {
        locked = true;
        isHorizontal = Math.abs(ddx) > Math.abs(ddy) * 1.2;
      }
      if (!locked || !isHorizontal) return;
      dx = ddx;
      const el = target();
      if (el) { el.style.transition = 'none'; el.style.transform = `translateX(${dx}px)`; }
    });

    const end = (e) => {
      if (!dragging || (e.pointerId !== undefined && e.pointerId !== pointerId)) return;
      dragging = false;
      const el = target();
      if (el) { el.style.transition = ''; el.style.transform = ''; }
      if (locked && isHorizontal && Math.abs(dx) > THRESHOLD) {
        lastSwipe = Date.now();
        step(dx < 0 ? 1 : -1);
        animateIn(dx < 0 ? 1 : -1, target());
      }
      dx = 0;
    };
    wrapper.addEventListener('pointerup', end);
    wrapper.addEventListener('pointercancel', end);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);

    // Suppress click after a real swipe so day cells don't select
    wrapper.addEventListener('click', (e) => {
      if (Date.now() - lastSwipe < 300) { e.stopPropagation(); e.preventDefault(); }
    }, true);
  }

  setupSheetGesture() {
    const modal = document.getElementById('cal_event_modal');
    const card = document.getElementById('cal_modal_card');
    const handle = document.getElementById('cal_sheet_drag_handle');
    if (!modal || !card) return;

    // Click outside to close (backdrop tap)
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeEventModal();
      }
    });

    // Drag to close gesture (both mouse and touch)
    const onDragStart = (clientY) => {
      this.isDraggingSheet = true;
      this.dragStartY = clientY;
      this.currentDragY = 0;
      card.style.transition = 'none';
    };

    const onDragMove = (clientY) => {
      if (!this.isDraggingSheet) return;
      const deltaY = clientY - this.dragStartY;
      if (deltaY > 0) {
        // Dragging downwards
        this.currentDragY = deltaY;
        card.style.transform = `translateY(${deltaY}px)`;
      } else {
        // Rubber band resistance upwards, capped
        const resistance = Math.min(12, Math.sqrt(Math.abs(deltaY)) * 2);
        card.style.transform = `translateY(${-resistance}px)`;
      }
    };

    const onDragEnd = () => {
      if (!this.isDraggingSheet) return;
      this.isDraggingSheet = false;

      // If dragged down past 120px threshold, dismiss
      if (this.currentDragY > 120) {
        this.closeEventModal();
      } else {
        // Spring snap back to origin
        card.style.transition = 'transform 0.38s cubic-bezier(0.175, 0.885, 0.32, 1.15)';
        card.style.transform = 'translateY(0)';
      }
    };

    // Handle bar & card top drag listeners
    const targetEl = handle || card;
    targetEl.addEventListener('mousedown', (e) => onDragStart(e.clientY));
    window.addEventListener('mousemove', (e) => onDragMove(e.clientY));
    window.addEventListener('mouseup', onDragEnd);

    targetEl.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) onDragStart(e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) onDragMove(e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('touchend', onDragEnd);
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

    // Add Event Modal buttons
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
