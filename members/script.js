$(document).ready(function() {
    // Function to get query parameter by name
    function getQueryParam(param) {
        let urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Get the username from the URL
    let usernameParam = getQueryParam('username');

    // Fetch the members JSON
    $.getJSON('../data/members.json', function(data) {
        // If a username is provided, filter the data
        if (usernameParam) {
            let member = data.find(m => m.username === usernameParam);
            displayMemberDetails(member);
        } else {
            // If no username is provided, display all members
            displayAllMembers(data);
        }
    });

    function displayMemberDetails(member) {
        if (member) {
            // Check for non-empty social links
            let socialLinks = '';
            if (member.linkedin) {
                socialLinks += `<a href="${member.linkedin}" target="_blank">LinkedIn</a>`;
            }
            if (member.github) {
                socialLinks += (socialLinks ? ' | ' : '') + `<a href="${member.github}" target="_blank">GitHub</a>`;
            }
            if (member.instagram) {
                socialLinks += (socialLinks ? ' | ' : '') + `<a href="${member.instagram}" target="_blank">Instagram</a>`;
            }

            // Only display social links section if there's at least one valid link
            let socialLinksSection = socialLinks ? `<p>${socialLinks}</p>` : '';

            // Create the full-screen card for the selected member
            let memberCard = `
                <div class="member">
                    <img src="../data/uploads/${member.portrait1}" alt="${member.displayName}">
                    <h2>${member.displayName}</h2>
                    <p>${member.role}</p>
                    <p>${member.section}, Year ${member.year}</p>
                    <p>${member.description}</p>
                    <p>Email: <a href="mailto:${member.email}">${member.email}</a></p>
                    ${socialLinksSection}
                </div>
            `;

            // Insert the card into the container
            $('#member-detail').html(memberCard);
        } else {
            // If no member is found, show a message
            $('#member-detail').html('<p>Member not found.</p>');
        }
    }

    function displayAllMembers(data) {
        let membersContainer = $('#member-detail');
        membersContainer.empty(); // Clear any existing content
        $.each(data, function(index, member) {
            // Check for non-empty social links
            let socialLinks = '';
            if (member.linkedin) {
                socialLinks += `<a href="${member.linkedin}" target="_blank">LinkedIn</a>`;
            }
            if (member.github) {
                socialLinks += (socialLinks ? ' | ' : '') + `<a href="${member.github}" target="_blank">GitHub</a>`;
            }
            if (member.instagram) {
                socialLinks += (socialLinks ? ' | ' : '') + `<a href="${member.instagram}" target="_blank">Instagram</a>`;
            }

            // Only display social links section if there's at least one valid link
            let socialLinksSection = socialLinks ? `<p>${socialLinks}</p>` : '';

            // Create a card for each member
            let card = `
                <div class="card">
                    <img src="../data/uploads/${member.portrait1}" alt="${member.displayName}">
                    <h2>${member.displayName}</h2>
                    <p>${member.role}</p>
                    <p>${member.section}, Year ${member.year}</p>
                    <p>${member.description}</p>
                    <p>Email: <a href="mailto:${member.email}">${member.email}</a></p>
                    ${socialLinksSection}
                </div>
            `;
            membersContainer.append(card);
        });
    }
});
