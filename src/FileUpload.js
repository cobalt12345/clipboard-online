import React from "react";
import {Grid} from "@mui/material";

class FileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            secret: props.secret,
            uploadedFilesReadyForSubmit: {},
            isFilesReady: false
        };
        console.debug('Secret:', props.secret(), 'Client:', props.client);
        this.apiClient = props.client;
        this.fileInputRef = React.createRef();
        this.fileUploadFormRef = React.createRef();
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentWillUnmount() {
        console.debug('File upload unmounted')
    }

    componentDidMount() {
        console.debug('File upload mounted')
        this.fileInputRef.current.addEventListener('change', async (event) => {
            console.debug('File(s) chosen for upload', JSON.stringify(event.target.files));
            const files = event.target.files;
            const filePromises = Object.entries(files).map(item => {
                return new Promise((resolve, reject) => {
                    const [index, file] = item;
                    const reader = new FileReader();
                    reader.readAsBinaryString(file);

                    reader.onload = async (event) => {
                        this.setState((prevState) => {
                            let prevUploadedFilesReadyForSubmit =
                                Object.assign({}, prevState.uploadedFilesReadyForSubmit);

                            let nextState = {
                                uploadedFilesReadyForSubmit: {
                                    ...prevUploadedFilesReadyForSubmit
                                }
                            };
                            // const inputKey = this.fileInputRef.current.getAttribute('name');
                            // const fileKey = `${inputKey}${files.length > 1 ? `[${index}]` : ''}`

                            nextState['uploadedFilesReadyForSubmit'][file.name]
                                = `data:${file.type};base64,${btoa(event.target.result)}`;

                            console.debug('File(s) uploaded', JSON.stringify(nextState).substring(0, 100));

                            return nextState;
                        });

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
                    // if each file processed successfuly then set our state to true
                    this.setState({isFilesReady: true})
                })
                .catch((error) => {
                    console.log(error)
                    console.log('something wrong happened')
                })
        })

        let handleForm = async (event) => {
            event.preventDefault();
            if (!this.state.isFilesReady) {
                alert('files still getting processed')
            } else {
                console.debug(JSON.stringify(this.state.uploadedFilesReadyForSubmit).substring(0, 100));
                Object.entries(this.state.uploadedFilesReadyForSubmit).forEach((file) => {
                    this.apiClient.saveFileContent(file[1], file[0], this.state.secret());
                });
            }
        }

        this.fileUploadFormRef.current.addEventListener('submit', handleForm);
    }

    render() {
        return (
            <Grid container direction="column" padding={2} spacing={2}>
                <Grid item>
                    <form id="fileUploadForm" ref={this.fileUploadFormRef}>
                        <input type="file" id="fileInput" name="file" ref={this.fileInputRef} multiple />
                        <button type="submit">Submit</button>
                    </form>
                </Grid>
                <Grid item>

                </Grid>
            </Grid>
        );
    }
}

export default FileUpload;