const DOWNLOAD_LIST = [
    {id: "#OfflineInstaller", launcher: [1]},
    {id: "#OnlineInstaller", launcher: [1]},
    {id: "#InstallerJava", launcher: [1], os: [1]},
    {id: "#MultiMCUniversal", launcher: [2]}
]

function showDownload() {
    const launcher = Number($("#type").val());
    const os = Number($("#system").val());
    const architecture = Number($("#architecture").val());


    for (let download of DOWNLOAD_LIST) {
        if ((launcher === 0 || download.launcher === undefined || download.launcher.includes(launcher)) &&
            (os === 0 || download.os === undefined || download.os.includes(os)) &&
            (architecture === 0 || download.architecture === undefined || download.architecture.includes(architecture))
        ) {
            $(download.id).show();
        } else {
            $(download.id).hide();
        }
    }
}

$(document).ready(function() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    new ClipboardJS('.copy');


    showDownload();
})