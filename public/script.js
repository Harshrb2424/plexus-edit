let members = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/members')
        .then(response => response.json())
        .then(data => {
            members = data;
            renderMembers();
        });

    document.getElementById('add-member').addEventListener('click', addMember);
    document.getElementById('save-changes').addEventListener('click', saveChanges);
});

function renderMembers() {
    const container = document.getElementById('members-container');
    container.innerHTML = '';  // Clear the container first

    members.forEach((member, index) => {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';
        memberCard.innerHTML = `
        <input type="text" value="${member.displayName}" placeholder="Display Name" class="member-input" data-field="displayName" data-index="${index}">
        <input type="text" value="${member.fullName}" placeholder="Full Name" class="member-input" data-field="fullName" data-index="${index}">
        <input type="text" value="${member.username}" placeholder="Username" class="member-input" data-field="username" data-index="${index}">
        <input type="text" value="${member.rollno}" placeholder="Roll No" class="member-input" data-field="rollno" data-index="${index}">
    
        <!-- Section Dropdown -->
        <select name="section" class="member-input" data-field="section" data-index="${index}">
            <option value="CSM-A" ${member.section === "CSM-A" ? "selected" : ""}>CSM A</option>
            <option value="CSM-B" ${member.section === "CSM-B" ? "selected" : ""}>CSM B</option>
            <option value="CSM-C" ${member.section === "CSM-C" ? "selected" : ""}>CSM C</option>
        </select>
    
        <!-- Year Dropdown -->
        <select name="year" class="member-input" data-field="year" data-index="${index}">
            <option value="2" ${member.year === "2" ? "selected" : ""}>2nd Year</option>
            <option value="3" ${member.year === "3" ? "selected" : ""}>3rd Year</option>
            <option value="4" ${member.year === "4" ? "selected" : ""}>4th Year</option>
        </select>
    
        <!-- Role Dropdown -->
        <select name="role" class="member-input" data-field="role" data-index="${index}" required>
            <option value="" disabled ${!member.role ? "selected" : ""}>Select Role</option>
            <option value="President" ${member.role === "President" ? "selected" : ""}>President</option>
            <option value="Vice-President" ${member.role === "Vice-President" ? "selected" : ""}>Vice-President</option>
            <option value="Secretary" ${member.role === "Secretary" ? "selected" : ""}>Secretary</option>
            <option value="Members of Association" ${member.role === "Members of Association" ? "selected" : ""}>Members of Association</option>
            <option value="Technical Club Head" ${member.role === "Technical Club Head" ? "selected" : ""}>Technical Club Head</option>
            <option value="Technical Club Co-ordinator" ${member.role === "Technical Club Co-ordinator" ? "selected" : ""}>Technical Club Co-ordinator</option>
            <option value="Technical Club Members" ${member.role === "Technical Club Members" ? "selected" : ""}>Technical Club Members</option>
            <option value="Non-Technical Club Head" ${member.role === "Non-Technical Club Head" ? "selected" : ""}>Non-Technical Club Head</option>
            <option value="Non-Technical Club Co-ordinator" ${member.role === "Non-Technical Club Co-ordinator" ? "selected" : ""}>Non-Technical Club Co-ordinator</option>
            <option value="Non-Technical Club Member" ${member.role === "Non-Technical Club Member" ? "selected" : ""}>Non-Technical Club Member</option>
            <option value="Sports Club Head" ${member.role === "Sports Club Head" ? "selected" : ""}>Sports Club Head</option>
            <option value="Sports Club Co-ordinator" ${member.role === "Sports Club Co-ordinator" ? "selected" : ""}>Sports Club Co-ordinator</option>
            <option value="Sports Club Member" ${member.role === "Sports Club Member" ? "selected" : ""}>Sports Club Member</option>
            <option value="E-Sports Club Head" ${member.role === "E-Sports Club Head" ? "selected" : ""}>E-Sports Club Head</option>
            <option value="E-Sports Club Co-ordinator" ${member.role === "E-Sports Club Co-ordinator" ? "selected" : ""}>E-Sports Club Co-ordinator</option>
            <option value="E-Sports Club Member" ${member.role === "E-Sports Club Member" ? "selected" : ""}>E-Sports Club Member</option>
            <option value="Social Media Club Head" ${member.role === "Social Media Club Head" ? "selected" : ""}>Social Media Club Head</option>
            <option value="Social Media Club Co-ordinator" ${member.role === "Social Media Club Co-ordinator" ? "selected" : ""}>Social Media Club Co-ordinator</option>
            <option value="Social Media Club Member" ${member.role === "Social Media Club Member" ? "selected" : ""}>Social Media Club Member</option>
            <option value="Design Club Head" ${member.role === "Design Club Head" ? "selected" : ""}>Design Club Head</option>
            <option value="Design Club Co-ordinator" ${member.role === "Design Club Co-ordinator" ? "selected" : ""}>Design Club Co-ordinator</option>
            <option value="Design Club Member" ${member.role === "Design Club Member" ? "selected" : ""}>Design Club Member</option>
        </select>
    
        <input type="text" value="${member.email}" placeholder="Email" class="member-input" data-field="email" data-index="${index}">
        <input type="text" value="${member.insta}" placeholder="Instagram ID" class="member-input" data-field="insta" data-index="${index}">
        <input type="text" value="${member.github}" placeholder="Github Link" class="member-input" data-field="github" data-index="${index}">
        <input type="text" value="${member.linkedin}" placeholder="LinkedIn Link" class="member-input" data-field="linkedin" data-index="${index}">
        <input type="text" value="${member.youtube}" placeholder="Youtube Link" class="member-input" data-field="youtube" data-index="${index}">
        <input type="text" value="${member.twitter}" placeholder="Twitter Link" class="member-input" data-field="twitter" data-index="${index}">

        <!-- Image Upload -->
        <div class="image-upload">
            <input type="file" data-index="${index}" class="upload-input">
            <img src="${member.portrait1 ? member.portrait1 : 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg'}" alt="Portrait" class="portrait">
        </div>
    
        <button class="delete-member" data-index="${index}">Delete</button>
    `;
    
        container.appendChild(memberCard);
    });

    // Add event listeners to handle input changes, file uploads, and delete buttons
    document.querySelectorAll('.member-input').forEach(input => {
        input.addEventListener('input', handleInputChange);
    });
    document.querySelectorAll('.upload-input').forEach(input => {
        input.addEventListener('change', handleFileUpload);
    });
    document.querySelectorAll('.delete-member').forEach(button => {
        button.addEventListener('click', deleteMember);
    });
}

function handleInputChange(event) {
    const index = event.target.dataset.index;
    const field = event.target.dataset.field;
    members[index][field] = event.target.value;
}

function handleFileUpload(event) {
    const index = event.target.dataset.index;
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('portrait', file);

    // Send file to the server for upload
    fetch('/api/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Update member's portrait1 field with the new file path
        members[index].portrait1 = data.filePath;
        renderMembers();
    })
    .catch(error => {
        console.error('Error uploading file:', error);
    });
}

function deleteMember(event) {
    const index = event.target.dataset.index;
    members.splice(index, 1);  // Remove the member at the given index
    renderMembers();
}

function addMember() {
    members.push({
        displayName: '',
        fullName: '',
        username: '',
        rollno: '',
        section: '',
        year: '',
        role: '',
        email: '',
        insta: '',
        github: '',
        linkedin: '',
        twitter: '',
        youtube: '',
        portrait1: ''
    });
    renderMembers();
}

function saveChanges() {
    fetch('/api/members', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(members)
    })
    .then(response => response.text())
    .then(data => {
        alert('Changes saved successfully!');
    })
    .catch(error => {
        console.error('Error saving members:', error);
    });
}