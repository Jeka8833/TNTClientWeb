addAuthenticationErrorListener(function () {
    window.location.replace(webPageRootUrl + "/profile/login/fail.html");
})

addServerErrorListener(function () {
    $("#errorBox").removeClass("d-none");
})

const userUUID = getUser();

$(function () {
    uuidToName(userUUID, function (name) {
        $("#avatarUsername").text(name);
    })

    $("#avatarImage").attr("src", "https://crafatar.com/avatars/" + userUUID + "?size=32&overlay");

    $("#logoutBtn").click(function () {
        logout(function (redirect) {
            window.location.replace(webPageRootUrl + "/profile/login/fail.html");
        })
    });
});

function uuidToName(uuid, callback) {
    $.getJSON("https://api.minetools.eu/uuid/" + uuid, function (data) {
        if (data.name === undefined || data.name === null) {
            callback(undefined);
        } else {
            callback(data.name);
        }
    }).fail(function () {
        callback(undefined);
    });
}