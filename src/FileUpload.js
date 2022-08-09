import React from "react";
import {Alert, Box, Grid, Typography} from "@mui/material";
import {CircularProgressWithLabel} from "./lib/CircularProgressWithLabel"

class FormFile {
    constructor(name, content, progress:Number = 0) {
        this.name = name;
        this.content = content;
        this.progress = progress;
    }
}

class FileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            secret: props.secret,
            uploadedFilesReadyForSubmit: new Map(),
            isFilesReady: false,
            popupMessage: null,
            receivedFiles: new Map()
        };
        console.debug('Secret:', props.secret, 'Client:', props.client);
        this.apiClient = props.client;
        this.fileInputRef = React.createRef();
        this.fileUploadFormRef = React.createRef();
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.receivedFilePart = this.receivedFilePart.bind(this);
        this.reSubscribeToFile = this.reSubscribeToFile.bind(this);
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if (this.props.secret !== prevProps.secret) {
            this.reSubscribeToFile();
        }
    }

    reSubscribeToFile() {
        this.state.fileSubscription?.unsubscribe();
        let fileSubscription = this.apiClient.awaitFileContent(this.props.secret,
            this.receivedFilePart,
            (error)=>{
                this.setState({
                    popupMessage: {
                        severity: "error",
                        message: error
                    }
                })
            });

        this.setState({secret: this.props.secret, fileSubscription});
    }

    componentWillUnmount() {
        console.debug('File upload unmounted');
    }

    componentDidMount() {
        console.debug('File upload mounted')
        this.fileInputRef.current.addEventListener('change', async (event) => {
            console.debug('File(s) chosen for upload', JSON.stringify(event.target.files));
            const files = event.target.files;
            const filePromises = Object.entries(files).map(item => {
                return new Promise((resolve, reject) => {
                    const [index, file] = item;
                    console.debug('')
                    if (file.size > process.env.REACT_APP_MAX_FILE_SIZE_IN_BYTES) {
                        this.setState({popupMessage: {severity: 'error', message: 'File is too large'}})
                        return reject('File is too large!');
                    }
                    const reader = new FileReader();
                    reader.readAsBinaryString(file);

                    reader.onload = async (event) => {
                        this.setState((prevState) => {
                            const nextState = {
                                ...prevState,
                                uploadedFilesReadyForSubmit:new Map(prevState.uploadedFilesReadyForSubmit.entries())
                            }
                            nextState.uploadedFilesReadyForSubmit.set(file.name, new FormFile(file.name,
                                `data:${file.type};base64,${btoa(event.target.result)}`, 100))

                            return nextState;
                        });
                        this.setState({popupMessage: null})
                        resolve()
                    };

                    reader.onerror = function() {
                        console.log("couldn't read the file");
                        reject()
                    };
                })
            });

            Promise.all(filePromises)
                .then(() => {
                    // if each file processed successfully then set our state to true
                    this.setState({isFilesReady: true})
                })
                .catch((error) => {
                    console.log(error)
                    console.log('something wrong happened')
                })
        })

        let resetForm = () => {
            this.setState({
                uploadedFilesReadyForSubmit: new Map(),
                receivedFiles: new Map,
                popupMessage: null});
            this.fileInputRef.current.value = null;
        };

        let handleForm = async (event) => {
            event.preventDefault();
            if (!this.state.isFilesReady) {
                alert('files still getting processed')
            } else {
                this.state.uploadedFilesReadyForSubmit.forEach((file, fileName) => {
                    this.apiClient.saveFileContent(file.content, fileName, this.state.secret);
                });
                resetForm();
            }
        }

        this.fileUploadFormRef.current.addEventListener('submit', handleForm);
        this.fileUploadFormRef.current.addEventListener('reset', resetForm);
        this.reSubscribeToFile();
    }

    receivedFilePart(event) {
        console.debug('FileUpload', 'Received file part', event);
        const {fileName, fileContent, totalParts, partNo} = event.value.data.subscribeToCopyFileContent;

        this.setState((prevState) => {
            const newState = Object.assign({}, prevState);
            newState.receivedFiles = new Map(prevState.receivedFiles.entries());
            let fileParts:Array<String>;
            if (newState.receivedFiles.has(fileName)) {
                fileParts = newState.receivedFiles.get(fileName).fileParts;
            } else {
                fileParts = new Array(totalParts);
                const file = new FormFile(fileName, null);
                file.fileParts = fileParts;
                newState.receivedFiles.set(fileName, file);
            }
            fileParts[partNo] = fileContent;
            let numOfReceivedFileParts = fileParts.reduce(
                (prevVal, curVal, curIndex, array) => {
                    return prevVal + (curVal !== undefined ? 1 : 0);
                }, 0);

            const progress = Math.round(numOfReceivedFileParts * 100 / totalParts);
            newState.receivedFiles.get(fileName).progress = progress;
            if (progress === 100) {
                const wholeFileContent = fileParts.join('');
                let fileLink = "<iframe src='" + wholeFileContent  + "' frameborder=\"0\" style=\"border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;\" allowfullscreen>" + "Try another browser" + "</iframe>";
                setTimeout(() => {
                    let popup = window.open();
                    if (!popup) {
                        newState.popupMessage = {
                            severity: 'error',
                            message: 'Allow pop-ups in your browser'
                        }
                    } else {
                        popup.document.title = fileName;
                        popup.document.write(`<title>${fileName}</title>`);
                        popup.document.write(fileLink);

                    }
                }, 1000);
            }

            return newState;
        });
    }

    render() {

        // const files = Object.entries(this.state.uploadedFilesReadyForSubmit).map(
        //     (file, index) => {return <li key={index}>{file[0]}</li>});

        const files = new Array();
        let fileIndex = 0;
        for (let uploadedFile of this.state.uploadedFilesReadyForSubmit) {
            files.push(
                <li key={fileIndex++}>
                    {uploadedFile[0]} <CircularProgressWithLabel value = {uploadedFile[1].progress} color="success" />
                </li>);
        }
        for (let receivedFile of this.state.receivedFiles) {
            files.push(
                <li key={fileIndex++}>
                    {receivedFile[0]} <CircularProgressWithLabel value = {receivedFile[1].progress}/>
                </li>);
        }
        return (
            <Grid container direction="column" padding={2} spacing={2}>
                <Alert variant="outlined" severity={this.state.popupMessage?.severity}>
                    {this.state.popupMessage?.message ||
                        `Max. file size: ${Number.parseInt(process.env.REACT_APP_MAX_FILE_SIZE_IN_BYTES) / 1000} kB`}
                </Alert>
                <Grid item>
                    <form id="fileUploadForm" ref={this.fileUploadFormRef}>
                        <ol>
                            {files}
                        </ol>
                        <input type="file" id="fileInput" name="file" ref={this.fileInputRef} multiple />
                        <button type="submit">Submit</button>
                        <button type="reset">Reset</button>
                    </form>
                </Grid>
                <Grid item>

                </Grid>
            </Grid>
        );
    }
}

export default FileUpload;