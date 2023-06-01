let playerSettingsOld = {useTntCape: false, cape: ""};
let playerSettingsNew = {useTntCape: false, cape: ""};
let uploadedCape = undefined;
readSettings();

function updateSettings(callback) {
    updateSkin(playerSettingsNew["useTntCape"], playerSettingsNew["cape"], function (isOk) {
        if (isOk) {
            resizeCape(playerSettingsNew["cape"], function (image) {
                playerSettingsNew["cape"] = image;
                playerSettingsNew["timeout"] = Date.now();

                playerSettingsOld = Object.assign({}, playerSettingsNew);
                try {
                    localStorage.setItem("config", JSON.stringify(playerSettingsNew));
                } catch (e) {
                    console.error(e);
                }
                callback(isOk)
            });
        } else {
            localStorage.removeItem("config")
            callback(isOk)
        }
    });
}

function readSettings() {
    playerSettingsOld = {useTntCape: false};
    playerSettingsNew = {useTntCape: false};

    const configParsed = JSON.parse(localStorage.getItem("config"));
    if (configParsed != null && configParsed.timeout !== undefined &&
        Date.now() - configParsed.timeout < 30 * 60 * 1000) {
        delete configParsed.timeout;

        playerSettingsOld = Object.assign({}, configParsed);
        playerSettingsNew = Object.assign({}, configParsed);

        changeSelectedTypeOfCape(playerSettingsOld["useTntCape"]);
    } else {
        localStorage.removeItem("config");

        readUserData(function (data) {
            if (data !== undefined && data["capePriority"] === 2) {
                playerSettingsOld["useTntCape"] = true;
                playerSettingsNew["useTntCape"] = true;
                changeSelectedTypeOfCape(true);
            }
        });
    }
}

function changeSelectedTypeOfCape(isTntClient) {
    $(function () {
        const vanillaSelectBtn = $("#vanillaSelectBtn");
        const tntClientSelectBtn = $("#tntClientSelectBtn");
        if (isTntClient) {
            tntClientSelectBtn.addClass("btn-success");
            tntClientSelectBtn.removeClass("btn-primary");
            vanillaSelectBtn.removeClass("btn-success");
            vanillaSelectBtn.addClass("btn-primary");
        } else {
            tntClientSelectBtn.removeClass("btn-success");
            tntClientSelectBtn.addClass("btn-primary");
            vanillaSelectBtn.addClass("btn-success");
            vanillaSelectBtn.addClass("btn-primary");
        }
    });
}

const startAnimationTime = Date.now();

function getElementAndRegisterListener(componentID) {
    const component = document.getElementById(componentID)

    component.addEventListener("skinRender", function (e) {
        const time = Date.now() - startAnimationTime;
        const movePos = Math.sin(time / 200) / 2

        e.detail.playerModel.children[2].rotation.x = movePos;
        e.detail.playerModel.children[3].rotation.x = -movePos;
        e.detail.playerModel.children[4].rotation.x = movePos;
        e.detail.playerModel.children[5].rotation.x = -movePos;

        if (e.detail.playerModel.children[6] !== undefined) {
            e.detail.playerModel.children[6].rotation.x = (1 + Math.sin(time / 1000)) / 5;
        }
    });
    return component;
}

function createSkin(component, cape, isOptifine) {
    if (isOptifine === undefined) isOptifine = false;

    const skin = new SkinRender({
        autoResize: true, canvas: {
            width: component.offsetWidth, height: component.offsetHeight
        }, controls: {
            pan: false
        }, camera: {
            x: 0, y: 16, z: -27, target: [0, 16, 0]
        },
    }, component);

    if (cape === undefined) {
        skin.render({uuid: userUUID});
    } else if (cape.startsWith("data:")) {
        skin.render({
            uuid: userUUID, capeData: cape, optifine: isOptifine
        });
    } else {
        skin.render({
            uuid: userUUID, capeUrl: cape, optifine: isOptifine
        });
    }
    return skin;
}

function uuidReadCapes(uuid, callback) {
    uuidToName(uuid, function (name) {
        if (name === undefined) {
            callback(undefined);
        } else {
            nameReadCapes(name, callback);
        }
    })
}

function nameReadCapes(name, callback) {
    $.getJSON("https://api.capes.dev/load/" + name, function (data) {
        let outList = {};

        jQuery.each(data, function (key, val) {
            const imageURL = val["imageUrl"];
            if (imageURL === undefined || imageURL === null) return;

            outList[key] = imageURL;
        });
        callback(outList);
    }).fail(function () {
        callback(undefined);
    });
}

function readUserData(callback) {
    $.getJSON("https://raw.githubusercontent.com/Jeka8833/TntClientFileServer/main/capeData/" + userUUID + ".json",
        function (data) {
            callback(data);
        }).fail(function () {
        callback(undefined);
    });
}

function resizeCape(imageBase64, callback) {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = function () {
        let newWidth = 64;
        let newHeight = 32;
        while ((newWidth < image.width || newHeight < image.height) && newWidth < 1024) {
            newWidth *= 2;
            newHeight *= 2;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = newWidth;
        canvas.height = newHeight;

        ctx.drawImage(image, 0, 0, image.width, image.height);
        callback(canvas.toDataURL());
    };
    image.src = imageBase64;
}

$(function () {
    const vanillaSelectBtn = $("#vanillaSelectBtn");
    const tntClientSelectBtn = $("#tntClientSelectBtn");
    const saveToast = $("#saveToast");
    const editSaveBtn = $("#editSave");

    let allowEdit = false;
    isTntCape(function (state) {
        if (state) {
            allowEdit = true;
            tntClientSelectBtn.removeClass("disabled");
        }
        changeEditCape();
    });


    function checkChanges() {
        const hasChanges = !(playerSettingsNew["useTntCape"] === playerSettingsOld["useTntCape"] &&
            playerSettingsNew["cape"] === playerSettingsOld["cape"]);
        if (hasChanges) {
            saveToast.addClass("show");
        } else {
            saveToast.removeClass("show");
        }

        changeEditCape(uploadedCape);
    }

    const myCollapse = document.getElementById("capeSettings");
    const myCollapseSetup = new bootstrap.Collapse(myCollapse, {toggle: false});
    const capeSettingsBtn = $("#capeSettingsBtn");
    myCollapse.addEventListener("hide.bs.collapse", function () {
        capeSettingsBtn.removeClass("btn-success");
        capeSettingsBtn.addClass("btn-primary");
    });
    myCollapse.addEventListener("show.bs.collapse", function () {
        capeSettingsBtn.addClass("btn-success");
        capeSettingsBtn.removeClass("btn-primary");
    });
    myCollapse.addEventListener("shown.bs.collapse", function () {
        window.dispatchEvent(new Event('resize'));
    });

    function changeEditCape(cape) {
        uploadedCape = cape;

        if (!allowEdit || cape === playerSettingsNew["cape"]) {
            editSaveBtn.addClass("disabled");
        } else {
            editSaveBtn.removeClass("disabled");
        }
    }

    editSaveBtn.click(function () {
        playerSettingsNew["cape"] = uploadedCape;
        changeEditCape(uploadedCape);

        myCollapseSetup.hide();

        tntClientSkin.reset();
        tntClientSkin = createSkin(tntClientSkinElement, uploadedCape, false);

        checkChanges();
    });

    $("#saveChanges").click(function () {
        updateSettings(function (isOk) {
            updateDefaultUserSkin();
            checkChanges();
        });
    });
    $("#discardChanges").click(function () {
        readSettings();
        updateDefaultUserSkin();
        checkChanges();
    });

    vanillaSelectBtn.click(function () {
        updateSelectedTypeOfCape(false);
    });
    tntClientSelectBtn.click(function () {
        updateSelectedTypeOfCape(true);
    });

    function updateSelectedTypeOfCape(isTntClient) {
        changeSelectedTypeOfCape(isTntClient);

        playerSettingsNew["useTntCape"] = isTntClient;
        checkChanges();
    }

    const capeFileElement = document.getElementById("capeFile");
    capeFileElement.addEventListener("change", function () {
        const reader = new FileReader();
        reader.readAsDataURL(capeFileElement.files[0]);
        reader.onload = function (e) {
            resizeCape(e.target.result, function (image) {
                changeEditCape(image);
                tntClientSkinEdit.reset();
                tntClientSkinEdit = createSkin(tntClientSkinEditElement, image, false);
            });
        };
    });

    const defaultSkinElement = getElementAndRegisterListener("skin_default");
    const tntClientSkinElement = getElementAndRegisterListener("skin_tntclient");
    const tntClientSkinEditElement = getElementAndRegisterListener("skin_tntclient_edit");

    let defaultSkin = createSkin(defaultSkinElement);
    let tntClientSkin = createSkin(tntClientSkinElement);
    let tntClientSkinEdit = createSkin(tntClientSkinEditElement);
    updateDefaultUserSkin();


    function updateDefaultUserSkin() {
        uuidReadCapes(userUUID, function (cape) {
            if (cape === undefined) return;

            if (cape["optifine"] !== undefined) {
                defaultSkin.reset();
                defaultSkin = createSkin(defaultSkinElement, cape["optifine"], true);
            } else if (cape["minecraft"] !== undefined) {
                defaultSkin.reset();
                defaultSkin = createSkin(defaultSkinElement, cape["minecraft"], false);
            }
        });

        if (playerSettingsOld["cape"] !== undefined) {
            const capeData = playerSettingsOld["cape"];

            tntClientSkin.reset();
            tntClientSkin = createSkin(tntClientSkinElement, capeData, false);

            tntClientSkinEdit.reset();
            tntClientSkinEdit = createSkin(tntClientSkinEditElement, capeData, false);
        } else {
            readUserData(function (data) {
                if (data === undefined) {
                    tntClientSkin.reset();
                    tntClientSkin = createSkin(tntClientSkinElement);

                    tntClientSkinEdit.reset();
                    tntClientSkinEdit = createSkin(tntClientSkinEditElement);
                } else {
                    const capeUrl = "https://raw.githubusercontent.com/Jeka8833/TntClientFileServer/main/capes/" +
                        userUUID + ".png";

                    resizeCape(capeUrl, function (image) {
                        tntClientSkin.reset();
                        tntClientSkin = createSkin(tntClientSkinElement, image, false);

                        tntClientSkinEdit.reset();
                        tntClientSkinEdit = createSkin(tntClientSkinEditElement, image, false);
                    });
                }
            });
        }
    }

    const capeType = document.getElementById("capeType");
    const capeTypeDownloadBtn = $("#capeTypeDownload");
    capeType.setAttribute("disabled", "");
    capeTypeDownloadBtn.addClass("disabled");

    capeType.addEventListener("change", (event) => {
        if (event.target.value === "none") {
            changeEditCape(undefined);

            readUserData(function (data) {
                if (data === undefined) {
                    tntClientSkinEdit.reset();
                    tntClientSkinEdit = createSkin(tntClientSkinEditElement);
                } else {
                    const capeUrl = "https://raw.githubusercontent.com/Jeka8833/TntClientFileServer/main/capes/" +
                        userUUID + ".png";

                    resizeCape(capeUrl, function (image) {
                        tntClientSkinEdit.reset();
                        tntClientSkinEdit = createSkin(tntClientSkinEditElement, image, false);
                    });
                }
            });

            capeTypeDownloadBtn.removeAttr("href");
        } else {
            resizeCape(event.target.value, function (image) {
                changeEditCape(image);
                tntClientSkinEdit.reset();
                tntClientSkinEdit = createSkin(tntClientSkinEditElement, image, false);
            });
            capeTypeDownloadBtn.attr("href", event.target.value);
        }
    });

    $("#requestPlayerInfo").click(function () {
        const name = $("#playerNameField").val();
        nameReadCapes(name, function (capes) {
            if (capes === undefined || capes.length <= 0) {
                capeType.setAttribute("disabled", "");
                capeTypeDownloadBtn.addClass("disabled");
            } else {
                capeTypeDownloadBtn.removeClass("disabled");
                capeTypeDownloadBtn.removeAttr("href");

                capeType.removeAttribute("disabled");
                capeType.innerHTML = "";

                const optionNone = document.createElement("option");
                optionNone.value = "none"
                optionNone.innerHTML = "None";
                capeType.add(optionNone);

                for (const k in capes) {
                    const option = document.createElement("option");
                    option.value = capes[k];
                    option.innerHTML = k;
                    capeType.add(option);
                }
            }
        })
    });
});