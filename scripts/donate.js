window.onload = function () {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const discordInput = document.getElementById('discord');
    const customField = document.getElementById('custom_field');
    const nameCrash = document.getElementById('name_crash');
    const nameCrashHeader = document.getElementById('name_crash_header');
    const nameCrashBody = document.getElementById('name_crash_body');
    const tooltipHelpElement = document.getElementById('tooltip_help');

    const tooltipHelp = new bootstrap.Tooltip(tooltipHelpElement);

    let playerCash = {};

    nameInput.addEventListener('change', () => {
        getMinecraftName(nameInput.value, function (data) {
            if (data['name'] === nameInput.value) {
                playerCash = data;
                if (data['uuid'] === null) {
                    nameInput.classList.add("is-invalid");
                } else {
                    nameInput.classList.remove("is-invalid");
                }
                updateErrorStateIfEmpty();
            }
        });
    });

    emailInput.addEventListener('change', () => {
        if (getEmail() === null) {
            emailInput.classList.add("is-invalid");
        } else {
            emailInput.classList.remove("is-invalid");
        }
        updateErrorStateIfEmpty();
    });

    discordInput.addEventListener('change', () => {
        if (getDiscord() === null) {
            discordInput.classList.add("is-invalid");
        } else {
            discordInput.classList.remove("is-invalid");
        }
        updateErrorStateIfEmpty();
    });

    addEventListener('submit', (event) => {
        if (isAllEmpty()) {
            customField.value = "";
            return;
        }

        const email = getEmail();
        const discord = getDiscord();
        if (!email || discord === null) return event.preventDefault();

        let uuid = playerCash['uuid'];
        if (uuid === null) return event.preventDefault();

        if (uuid === undefined) {
            $.ajaxSetup({async: false});
            getMinecraftName(nameInput.value, function (data) {
                uuid = data['uuid'];
            });
            $.ajaxSetup({async: true});
        }
        if (!uuid) return event.preventDefault();

        const encodedJson = JSON.stringify([uuid.replaceAll('-', '').toLowerCase(), discord, email])
            .slice(2, -2);

        if (encodedJson.length > 254) {
            showError(1);
            emailInput.classList.add("is-invalid");

            return event.preventDefault();
        }

        customField.value = encodedJson;
    });

    function getMinecraftName(playerName, callback) {
        if (!/^[a-zA-Z0-9_]{3,16}$/.test(playerName)) {
            callback({"name": playerName, "uuid": null});
            return;
        }
        $.getJSON("https://api.ashcon.app/mojang/v2/user/" + playerName)
            .done(function (json) {
                if (json['uuid'] === undefined) {
                    showError(0);
                    console.log("Response" + JSON.stringify(json));
                }
                callback({"name": playerName, "uuid": json['uuid']});
            })
            .fail(function (jqxhr, textStatus, error) {
                if (jqxhr.status === 404) {
                    callback({"name": playerName, "uuid": null});
                } else {
                    callback({"name": playerName, "uuid": undefined});
                    showError(0);
                    console.log("Request Failed: " + textStatus + ", " + error + ", " + jqxhr.status);
                }
            });
    }

    function getEmail() {
        if (!/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/
            .test(emailInput.value)) return null;

        return emailInput.value;
    }

    function getDiscord() {
        if (!discordInput.value) return "";
        if (!/^.{2,32}#\d{4}$/.test(discordInput.value)) return null;

        return discordInput.value;
    }

    function isAllEmpty() {
        return !nameInput.value && !emailInput.value && !discordInput.value;
    }

    function updateErrorStateIfEmpty() {
        if (isAllEmpty()) {
            nameInput.classList.remove("is-invalid");
            emailInput.classList.remove("is-invalid");
            discordInput.classList.remove("is-invalid");
            tooltipHelp.enable();
        } else {
            tooltipHelp.disable();
        }
    }

    function showError(type) {
        switch (type) {
            case 0: // Minecraft name server has error
                nameCrashHeader.textContent = 'Error in getting the player\'s name.';
                nameCrashBody.textContent = 'The server is currently unavailable. You can donate without filling in ' +
                    'the Minecraft name form.';
                break;
            case 1: // Email is too large
                nameCrashHeader.textContent = 'Sending error';
                nameCrashBody.textContent = 'Your Email is too large, please use another one.';
                break;
            default:
                return;
        }
        nameCrash.classList.add("show");
    }
}