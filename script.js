document.addEventListener('DOMContentLoaded', function() {
    const students = [
        { id: 1, name: 'student1', attendances: [] },
        { id: 2, name: 'student2', attendances: [] },
        { id: 3, name: 'student3', attendances: [] }
        // Add more students as needed
    ];

    const studentsList = document.getElementById('studentsList');
    const addStudentForm = document.getElementById('studentForm');
    const studentNameInput = document.getElementById('studentName');
    const attendanceForm = document.getElementById('attendanceForm');
    const attendanceList = document.getElementById('attendanceList');
    const studentNameHeading = document.getElementById('studentNameAttendance');
    const isPresentCheckbox = document.getElementById('isPresent');
    const submitButton = document.querySelector('#attendanceForm button[type="submit"]');
    const downloadButton = document.getElementById('downloadAttendance');

    // Populate initial student list dynamically
    renderStudents();

    // Function to render students in the list
    function renderStudents() {
        studentsList.innerHTML = ''; // Clear previous list

        students.forEach(student => {
            const listItem = document.createElement('div');
            listItem.classList.add('student-item');
            listItem.innerHTML = `
                <label>
                    <input type="checkbox" data-student-id="${student.id}" class="attendance-checkbox">
                    ${student.name}
                </label>
                <button onclick="showAttendanceForm(${student.id})">Take Attendance</button>
            `;
            studentsList.appendChild(listItem);
        });
    }

    // Function to add a new student
    addStudentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const studentName = studentNameInput.value.trim();
        if (studentName) {
            const newStudent = {
                id: students.length + 1,
                name: studentName,
                attendances: []
            };
            students.push(newStudent);
            renderStudents();
            addStudentForm.reset(); // Clear input field
        }
    });

    // Function to show attendance form for selected student
    window.showAttendanceForm = function(studentId) {
        const selectedStudent = students.find(student => student.id === studentId);
        studentNameHeading.textContent = selectedStudent.name;

        // Reset form and checkboxes
        isPresentCheckbox.checked = false;

        // Show attendance form section
        document.getElementById('attendanceFormContent').classList.remove('hidden');
        document.getElementById('attendanceHistoryContent').classList.add('hidden');
        attendanceList.innerHTML = ''; // Clear previous attendance history

        // Handle form submission
        attendanceForm.onsubmit = function(event) {
            event.preventDefault();
            const isPresent = isPresentCheckbox.checked;
            const date = new Date().toLocaleDateString();
            selectedStudent.attendances.push({ date, isPresent });
            addAttendanceToHistory(selectedStudent);
            resetForm();
        };
    };

    // Function to add attendance to history
    function addAttendanceToHistory(student) {
        attendanceList.innerHTML = ''; // Clear previous list

        student.attendances.forEach(attendance => {
            const listItem = document.createElement('li');
            listItem.textContent = `${attendance.date} - ${attendance.isPresent ? 'Present' : 'Absent'}`;
            attendanceList.appendChild(listItem);
        });
    }

    // Function to reset form after submission
    function resetForm() {
        isPresentCheckbox.checked = false;
    }

    // Event listener for download button
    downloadButton.addEventListener('click', function() {
        const csvContent = generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'attendance.csv';
        link.click();
    });

    // Function to generate CSV content
    function generateCSV() {
        let csv = 'Date,Student Name,Status\n';
        students.forEach(student => {
            const studentName = student.name;
            student.attendances.forEach(attendance => {
                const formattedDate = new Date(attendance.date).toISOString().slice(0, 10);
                csv += `${formattedDate},${studentName},${attendance.isPresent ? 'Present' : 'Absent'}\n`;
            });
        });
        return csv;
    }
});
