class FormFile {
    constructor(name, content) {
        this.name = name;
        this.content = content;
        this.progress = 0;
    }
}

class FileUpload {
    constructor(props = new Object()) {
        this.state = {
            secret: props.secret,
            uploadedFilesReadyForSubmit: new Map(),
            isFilesReady: false,
            popupMessage: null
        };
    }
}

const fileUpload = new FileUpload();
fileUpload.state.uploadedFilesReadyForSubmit.set('test.txt', new FormFile('test.txt', 'text content'));

const prevState = fileUpload.state;
console.debug('Prev state', prevState)

const nextState = {
    ...prevState,
    uploadedFilesReadyForSubmit: new Map(prevState.uploadedFilesReadyForSubmit.entries())
}
console.log('Next state', nextState)
console.log(prevState.uploadedFilesReadyForSubmit === nextState.uploadedFilesReadyForSubmit)

let files = new Array();
let index = 0;
for (let file of nextState.uploadedFilesReadyForSubmit) {
    console.debug(file)
    files.push(`<li key=${index++}>${file[0]} - ${file[1].progress} % </li>`)
}
console.debug(files)

nextState.uploadedFilesReadyForSubmit.forEach()