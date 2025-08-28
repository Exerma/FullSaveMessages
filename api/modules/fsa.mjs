// ID of the proxy fsa add-on.
const FSA_ID = "file-system-access@addons.thunderbird.net";

async function fsaRequest(request) {
    let error = null
    try {
        let rv = await browser.runtime.sendMessage(FSA_ID, request);
        if (rv.error) {
            error = rv.error
        } else {
            return rv;
        }
    } catch {
        error = "Failed to send request."
    }
    throw new Error(`fsa.${request.command}(): ${error}`);
}

export function getVersion() {
    return fsaRequest({ command: "getVersion" });
}

export function readFileWithPicker(
    { read, write },
    { filters, defaultName, defaultFolderId }
) {
    return fsaRequest({
        command: "readFileWithPicker",
        filters,
        defaultName,
        defaultFolderId,
        read,
        write,
    })
};

export function writeFileWithPicker(
    file,
    { read, write },
    { filters, defaultName, defaultFolderId }
) {
    return fsaRequest({
        command: "writeFileWithPicker",
        file,
        filters,
        defaultName,
        defaultFolderId,
        read,
        write,
    });
}

export function getFolderWithPicker(
    { read, write },
    { filters, defaultName, defaultFolderId }
) {
    return fsaRequest({
        command: "getFolderWithPicker",
        filters,
        defaultName,
        defaultFolderId,
        read,
        write,
    })
};

export function getPermissions(folderId, fileName) {
    if (!folderId || !fileName) {
        throw new Error(`fsa.getPermissions(): Missing folderId or fileName parameter`);
    }
    return fsaRequest({
        command: "getPermissions",
        folderId,
        fileName,
    });
}

export function readFile(folderId, fileName) {
    if (!folderId || !fileName) {
        throw new Error(`fsa.readFile(): Missing folderId or fileName parameter`);
    }
    return fsaRequest({
        command: "readFile",
        folderId,
        fileName,
    });
}

export function writeFile(file, folderId, fileName) {
    if (!file || !folderId || !fileName) {
        throw new Error(`fsa.writeFile(): Missing file, folderId or fileName parameter`);
    }
    return fsaRequest({
        command: "writeFile",
        file,
        folderId,
        fileName,
    })
}