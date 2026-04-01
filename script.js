// script.js
// Data Models
let courses = [
    { id: 1, title: "Full Stack Web Development", instructor: "Dr. Yonas A.", level: "Intermediate" },
    { id: 2, title: "Data Science & Machine Learning", instructor: "Prof. Meron T.", level: "Advanced" },
    { id: 3, title: "Mobile App Development", instructor: "Ermias D.", level: "Beginner" },
    { id: 4, title: "Cloud Computing & DevOps", instructor: "Hanna K.", level: "Advanced" }
];

let contactMessages = [];

// Load/Save to localStorage
function saveData() {
    localStorage.setItem("yeronis_courses", JSON.stringify(courses));
    localStorage.setItem("yeronis_messages", JSON.stringify(contactMessages));
}

function loadData() {
    const storedCourses = localStorage.getItem("yeronis_courses");
    if (storedCourses) courses = JSON.parse(storedCourses);
    const storedMessages = localStorage.getItem("yeronis_messages");
    if (storedMessages) contactMessages = JSON.parse(storedMessages);
}

// Helper: Escape HTML
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Render Courses Page
function renderCoursesPage() {
    const container = document.getElementById("coursesContainer");
    if (!container) return;
    
    if (courses.length === 0) {
        container.innerHTML = '<div class="course-card"><div class="course-info"><p>No courses available yet. Admin can add courses.</p></div></div>';
        return;
    }
    
    container.innerHTML = courses.map(course => `
        <div class="course-card">
            <div class="course-icon">
                <i class="fas fa-graduation-cap"></i>
            </div>
            <div class="course-info">
                <h3>${escapeHtml(course.title)}</h3>
                <p><i class="fas fa-chalkboard-user"></i> ${escapeHtml(course.instructor)}</p>
                <span class="course-badge">${escapeHtml(course.level)}</span>
            </div>
        </div>
    `).join('');
}

// Render Admin Courses Table
function renderAdminCoursesTable() {
    const tbody = document.getElementById("adminCoursesList");
    if (!tbody) return;
    
    if (courses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No courses available</td></tr>';
        return;
    }
    
    tbody.innerHTML = courses.map(course => `
        <tr>
            <td>${course.id}</td>
            <td>${escapeHtml(course.title)}</td>
            <td>${escapeHtml(course.instructor)}</td>
            <td>${escapeHtml(course.level)}</td>
            <td><button class="btn btn-danger" onclick="deleteCourse(${course.id})">Delete</button></td>
        </tr>
    `).join('');
}

// Delete Course
window.deleteCourse = function(id) {
    courses = courses.filter(c => c.id !== id);
    saveData();
    renderAdminCoursesTable();
    renderCoursesPage();
};

// Add Course
function addCourse(title, instructor, level) {
    if (!title.trim() || !instructor.trim()) return false;
    const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    courses.push({ id: newId, title: title.trim(), instructor: instructor.trim(), level: level });
    saveData();
    renderAdminCoursesTable();
    renderCoursesPage();
    return true;
}

// Render Messages Table with Country, City, Study Level
function renderMessagesTable() {
    const tbody = document.getElementById("messagesList");
    if (!tbody) return;
    
    if (contactMessages.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No messages received yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = contactMessages.map(msg => `
        <tr>
            <td>${escapeHtml(msg.name)}</td>
            <td>${escapeHtml(msg.email)}</td>
            <td>${escapeHtml(msg.country)}</td>
            <td>${escapeHtml(msg.city)}</td>
            <td>${escapeHtml(msg.studyLevel)}</td>
            <td style="max-width: 200px; word-break: break-word;">${escapeHtml(msg.message)}</td>
        </tr>
    `).join('');
}

// Navigation
function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active-page'));
    const activePage = document.getElementById(`${pageId}-page`);
    if (activePage) activePage.classList.add('active-page');
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) link.classList.add('active');
    });
    
    if (pageId === 'courses') renderCoursesPage();
    if (pageId === 'admin') {
        renderAdminCoursesTable();
        renderMessagesTable();
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Setup Event Listeners
function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            if (page) navigateTo(page);
        });
    });
    
    const exploreBtn = document.getElementById("exploreCoursesBtn");
    if (exploreBtn) {
        exploreBtn.addEventListener("click", () => navigateTo('courses'));
    }
}

function setupContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const country = document.getElementById("contactCountry").value;
        const city = document.getElementById("contactCity").value.trim();
        const studyLevel = document.getElementById("contactStudyLevel").value;
        const message = document.getElementById("contactMsg").value.trim();
        
        if (!name || !email || !country || !city || !studyLevel) {
            document.getElementById("contactFeedback").innerHTML = '<div class="alert" style="background:#fee2e2; color:#991b1b;">Please fill all required fields.</div>';
            return;
        }
        
        contactMessages.unshift({ name, email, country, city, studyLevel, message, date: new Date().toLocaleString() });
        saveData();
        renderMessagesTable();
        
        document.getElementById("contactFeedback").innerHTML = '<div class="alert">✅ Message sent successfully! Admin will review your inquiry.</div>';
        form.reset();
        
        setTimeout(() => {
            const fb = document.getElementById("contactFeedback");
            if (fb) fb.innerHTML = "";
        }, 3000);
    });
}

function setupAdminForm() {
    const addForm = document.getElementById("addCourseForm");
    if (!addForm) return;
    
    addForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("courseTitle").value;
        const instructor = document.getElementById("courseInstructor").value;
        const level = document.getElementById("courseStudyLevel").value;
        
        if (addCourse(title, instructor, level)) {
            document.getElementById("courseTitle").value = "";
            document.getElementById("courseInstructor").value = "";
            alert("✅ Course added successfully!");
        } else {
            alert("⚠️ Please fill all fields");
        }
    });
}

function setupMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            navMenu.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style
