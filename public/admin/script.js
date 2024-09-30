$(document).ready(function() {
    function loadMembers() {
        $.get('/members', function(members) {
            $('#members-list').empty();
            members.forEach(member => {
                $('#members-list').append(`
                    <div class="member" data-rollno="${member.rollno}">
                        <h3>${member.displayName} (${member.fullName}) - ${member.rollno}</h3>
                        <p>Section: ${member.section}, Year: ${member.year}, Role: ${member.role}</p>
                        <img src="/data/uploads/${member.portrait1}" alt="${member.displayName}" width="100">
                        ${member.portrait2 ? `<img src="/data/uploads/${member.portrait2}" alt="${member.displayName}" width="100">` : ''}
                        <p>${member.description}</p>
                        <p>${member.linkedin}</p>
                        <p>${member.github}</p>
                        <p>${member.email}</p>
                        <p>${member.instagram}</p>
                        <button class="edit-member">Edit</button>
                        <button class="delete-member">Delete</button>
                    </div>
                `);
            });
        });
    }

    $('#add-member').click(function() {
        const formData = new FormData();
        formData.append('displayName', $('#displayName').val());
        formData.append('fullName', $('#fullName').val());
        formData.append('username', $('#fullName').val().toLowerCase().replace(/\s+/g, '_'));
        formData.append('rollno', $('#rollno').val());
        formData.append('section', $('#section').val());
        formData.append('year', $('#year').val());
        formData.append('role', $('#role').val());
        formData.append('portrait1', $('#portrait1')[0].files[0]);
        if ($('#portrait2')[0].files.length > 0) {
            formData.append('portrait2', $('#portrait2')[0].files[0]);
        }
        formData.append('description', $('#description').val());
        formData.append('linkedin', $('#linkedin').val());
        formData.append('github', $('#github').val());
        formData.append('email', $('#email').val());
        formData.append('instagram', $('#instagram').val());

        $.ajax({
            url: '/members',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(newMember) {
                loadMembers();
                $('#displayName').val('');
                $('#fullName').val('');
                $('#rollno').val('');
                $('#section').val('');
                $('#year').val('');
                $('#role').val('');
                $('#portrait1').val('');
                $('#portrait2').val('');
                $('#description').val('');
            },
            error: function() {
                alert('Error adding member');
            }
        });
    });

    $('#members-list').on('click', '.delete-member', function() {
        const rollno = $(this).parent().data('rollno');
        $.ajax({
            url: `/members/${rollno}`,
            type: 'DELETE',
            success: loadMembers,
            error: function() {
                alert('Error deleting member');
            }
        });
    });

    $('#members-list').on('click', '.edit-member', function() {
        const memberDiv = $(this).parent();
        const rollno = memberDiv.data('rollno');
        const displayName = memberDiv.find('h3').text().split(' (')[0];
        const fullName = memberDiv.find('h3').text().split(' (')[1].split(') - ')[0];
        const section = memberDiv.find('p').text().split('Section: ')[1].split(', Year: ')[0];
        const year = memberDiv.find('p').text().split(', Year: ')[1].split(', Role: ')[0];
        const role = memberDiv.find('p').text().split(', Role: ')[1];

        $('#displayName').val(displayName);
        $('#fullName').val(fullName);
        $('#rollno').val(rollno);
        $('#section').val(section);
        $('#year').val(year);
        $('#role').val(role);
        $('#description').val(memberDiv.find('p').last().text());

        // Optionally hide the add button and show an update button (not shown here)
    });

    loadMembers();
});
