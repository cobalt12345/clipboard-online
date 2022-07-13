import React from "react";
import {Alert, AppBar, Grid, Paper, TextField, Toolbar, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import ApiClient from "./lib/ApiClient";
import {CopyPasteTextContent} from "./models";
import subscribe from "./lib/subscribe-to-webpush";
import ProTip from "./ProTip";
import FileUpload from "./FileUpload";

class ClipBoard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            input: '',
            output: '',
            secret: '',
            subscribedObPush: false,
            popupMessage: null,
            receivedFiles: []
        }
        this.apiClient = new ApiClient();
        this.handleTextTypeIn = this.handleTextTypeIn.bind(this)
        this.handleSecretTypeIn = this.handleSecretTypeIn.bind(this)
        this.subscribeOnPush = this.subscribeOnPush.bind(this)
        this.sendTextContent = this.sendTextContent.bind(this)
        this.receivedTextContent = this.receivedTextContent.bind(this)
        this.receivedFile = this.receivedFile.bind(this)
    }

    handleTextTypeIn(event) {
        this.setState({input: event.target.value});
    }

    handleSecretTypeIn(event) {
        this.setState({secret: event.target.value});
    }

    subscribeOnPush() {
        if (this.state.secret) {
            console.debug('Subscribe on push notifications');
            this.textContentSubscription?.unsubscribe();
            this.fileSubcription?.unsubscribe();
            this.textContentSubscription = this.apiClient.awaitTextContent(this.state.secret, this.receivedTextContent);
            this.fileSubcription = this.apiClient.awaitFileContent(this.state.secret, this.receivedFile)
            subscribe(this.state.secret, this.apiClient)
                .then((value) => {
                    console.debug('Subscribed to web push notifications', value);
                    this.setState({subscribedOnPush: true})
                })
                .catch((reason) => {
                    console.error('Subscription to web push notifications failed', reason)
                    this.setState({subscribedOnPush: false})
                });
        }
    }

    sendTextContent() {
        const savedTextContent : CopyPasteTextContent = this.apiClient.saveTextContent(this.state.secret,
            this.state.input);

        console.debug('Text content saved:', JSON.stringify(savedTextContent));
    }

    receivedTextContent(event) {
        console.debug('Received text content', event);
        const textContent = event.value.data.subscribeToCopyPasteTextContent.body;
        this.setState({output: textContent});
        this.copyToClipboard(textContent);
    }

    receivedFile(event) {
        console.debug('Received file', event)
        const {fileName, fileContent} = event.value.data.subscribeToCopyFileContent;
        this.setState((prev) => {
            let fileLink = "<iframe src='" + fileContent + "' frameborder=\"0\" style=\"border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;\" allowfullscreen>" + "" + "</iframe>";
            let newState = {'receivedFiles' : prev.receivedFiles.concat([fileLink])};
            setTimeout(() => {
                let popup = window.open();
                popup.document.write(fileLink);
            });

            return newState;
        })
    }

    render() {
        return (
            <Paper elevation={10} style={{width: '100%', height: '100%'}}>
                <AppBar position="sticky">
                    <Toolbar variant="regular">
                        <Typography variant="h6" color="inherit" component="div">
                        </Typography>
                        <ProTip />
                    </Toolbar>
                </AppBar>
                { this.state.popupMessage ? (
                    <Alert variant="outlined" severity={this.state.popupMessage.severity}>
                        {this.state.popupMessage.message}
                    </Alert>) : null
                }
                <Grid container spacing={2} columns={10}  paddingTop={2} direction="column"
                      justifyContent="center"
                      alignItems="center">
                    <Grid item xs={8}>
                        <TextField
                            id="input"
                            label="Secret phrase"
                            sx={{
                                minWidth: 500
                            }}
                            value={this.state.secret}
                            onChange={this.handleSecretTypeIn}
                            variant="filled"
                        />
                    </Grid>

                    <Grid item xs={8}>
                        <TextField
                            id="input"
                            label="Paste content here"
                            multiline
                            sx={{
                                minWidth: 500,
                                width: 1000
                            }}
                            fullWidth
                            rows={10}

                            value={this.state.input}
                            onChange={this.handleTextTypeIn}
                            variant="filled"
                            focused
                            // autoFocus
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            id="output"
                            label="Copy content"
                            multiline
                            sx={{
                                minWidth: 500,
                                width: 1000
                            }}
                            rows={10}
                            fullWidth
                            disabled
                            value={this.state.output}
                            variant="filled"
                        />
                    </Grid>
                    <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2} padding={2}>
                            <Grid item>
                                <Button onClick={this.subscribeOnPush} variant="contained">Subscribe</Button>
                            </Grid>
                            <Grid item>
                                <Button onClick={this.sendTextContent} variant="contained">Add</Button>
                            </Grid>
                    </Grid>
                    <Grid item xs={8}>
                        <FileUpload secret={() => this.state.secret} client={this.apiClient} />
                    </Grid>
                </Grid>
            </Paper>
        );
    }

    copyToClipboard(value) {
        console.debug('Copy data to clipboard:', value);
        navigator.clipboard.writeText(value).then((value) => {
            console.debug('Copied to clipboard');
            this.setState({popupMessage: {
                    severity: 'success',
                    message: 'Copied to clipboard'
                }})
        }, (reason) => {
            console.error(reason);
            this.setState({popupMessage: {
                    severity: 'warning',
                    message: 'Couldn\'t copy to clipboard'
                }})
        });
    }
}

export default ClipBoard;