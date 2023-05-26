const serverHubUrl = "https://api.tntclient.jeka8833.pp.ua/";
const webPageRootUrl = "/TNTClient";

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
            if (priv != null) localStorage.setItem("user", userUUID);
            callback(priv);
        } catch (e) {
            console.error("Fail login", e)
        }
    }, {"Authorization": "Basic " + btoa(userUUID + ":" + userToken)})
}

function logout(callback) {
    localStorage.removeItem("user");
    localStorage.removeItem("config");
    localStorage.removeItem("roles");

    $.ajax({
        type: "POST",
        url: serverHubUrl + "api/logout",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            callback();
        },
        error: function (jqXHR, exception) {
            callServerError();
        }
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

function updateSkin(isTntClient, cape, callback) {
    $.ajax({
        type: "POST",
        url: serverHubUrl + "api/cape",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            useTNTCape: isTntClient,
            cape: cape
        }),
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
            } else {
                callServerError();
            }
            callback(false);
        }
    });
}

// ==== Private Function ====

let privileges = undefined;

function readPrivileges(callback, header) {
    if (privileges === undefined) {
        const roleCache = JSON.parse(localStorage.getItem("roles"));

        if (roleCache != null && roleCache.roles !== undefined && roleCache.timeout !== undefined &&
            Date.now() - roleCache.timeout < 10 * 60 * 1000) {
            privileges = roleCache.roles;
            callback(roleCache.roles);
        } else {
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
                    try {
                        localStorage.setItem("roles", JSON.stringify({"timeout": Date.now(), "roles": data}));
                    } catch (e) {
                        console.error("Fail write localStorage", e)
                    }
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
        }
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