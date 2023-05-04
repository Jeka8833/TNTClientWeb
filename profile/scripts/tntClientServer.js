//const serverHubUrl = "https://jeka8833.pp.ua/";
const serverHubUrl = "http://localhost:8080/";

const authenticationError = [];
const serverError = [];

function isTntCape(callback) {
    readPrivileges(function (priv) {
        if (priv == null) {
            callback(false);
        } else {
            callback(priv.includes('CAPE'));
        }
    });
}

function login(userUUID, userToken, callback) {
    readPrivileges(function (priv) {
        try {
            localStorage.setItem("user", userUUID);
            callback(priv);
        } catch (e) {
            console.error("Fail login", e)
        }
    }, {"Authorization": "Basic " + btoa(userUUID + ":" + userToken)})
}

function logout(callback) {
    $.get(serverHubUrl + "api/logout", function () {
        callback();
    }).fail(function () {
        callServerError();
    });
}

function getUser() {
    const user = localStorage.getItem("user");
    if (user == null) callLoginError();

    return user;
}

function addAuthenticationErrorListener(callback) {
    authenticationError.push(callback);
}

function addServerErrorListener(callback) {
    serverError.push(callback);
}

function updateSkin(isTntClient, skin, callback) {
    $.ajax({
        type: "POST",
        url: serverHubUrl + "api/skin/update",
        data: {
            remember: true,
            isTntClient: isTntClient,
            skin: skin
        },
        dataType: "json",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            callback(true);
        },
        error: function (jqXHR, exception) {
            if (jqXHR.status === 401) {
                callLoginError();
            }
            callback(false);
        }
    });
}

// ==== Private Function ====

let privileges = undefined;

function readPrivileges(callback, header) {
    if (privileges === undefined) {
        $.ajax({
            type: "GET",
            url: serverHubUrl + "api/roles",
            data: {remember: true},
            dataType: "json",
            headers: header,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                privileges = data;
                callback(data);
            },
            error: function (jqXHR, exception) {
                if (jqXHR.status === 401) {
                    callLoginError();
                } else {
                    callServerError();
                }
                callback(null);
            }
        });
    } else {
        callback(privileges);
    }
}

function callServerError() {
    for (const listener of serverError) {
        listener();
    }
}

function callLoginError() {
    for (const listener of authenticationError) {
        listener();
    }
}