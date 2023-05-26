const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const user = urlParams.get("user")
const token = urlParams.get("token")

addAuthenticationErrorListener(function () {
    window.location.replace(webPageRootUrl + "/profile/login/fail.html");
})

addServerErrorListener(function () {
    $("#errorBox").removeClass("d-none");
})

if (user == null || token == null) {
    readPrivileges(function (data) {
        if (data != null) window.location.replace(webPageRootUrl + "/profile/");
    });
} else {
    login(user, token, function (data) {
        if (data != null) window.location.replace(webPageRootUrl + "/profile/");
    });
}
