import {Alert, TextField} from "@mui/material";
import Button from '@mui/material/Button';
import {AppBar, Box, Container, Grid, Paper, Toolbar, Typography} from "@mui/material";
import ApiClient from "./lib/ApiClient";
import React from 'react';
import {CopyPasteTextContent} from "./models";
import subscribe from "./lib/subscribe-to-webpush";
import ProTip from "./ProTip";
import FileUpload from "./FileUpload";

class ClipBoard extends React.Component {

    outputTextAreaRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            input: '',
            output: '',
            secret: '',
            popupMessage: null,
            subscribedObPush: false
        }

        this.handleTextTypeIn = this.handleTextTypeIn.bind(this);
        this.handleSecretTypeIn = this.handleSecretTypeIn.bind(this);
        this.saveTextContent = this.saveTextContent.bind(this);
        this.getTextContent = this.getTextContent.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.subscribeOnPush = this.subscribeOnPush.bind(this);
        this.copyToClipboard = this.copyToClipboard.bind(this);
    }

    handleTextTypeIn(event) {
        this.setState({input: event.target.value});
    }

    handleSecretTypeIn(event) {
        let newState = {
            secret: event.target.value,
        }
        if (!event.target.value) {
            newState['subscribedOnPush'] = false
        }
        console.debug('New state for secret:', Object.entries(newState));
        this.setState(newState);
    }

    saveTextContent() {
        if (this.state.secret && this.state.input) {

            const savedCopyPasteTextContent: CopyPasteTextContent = this.apiClient.saveTextContent(this.state.secret,
                this.state.input);

            this.setState({input: '', contentId: savedCopyPasteTextContent.id});
        }
    }

    componentDidMount() {
        this.apiClient = new ApiClient(this.getTextContent);
    }

    componentWillUnmount() {
        this.subscriptionOnTextContent?.unsubscribe();
        this.subscriptionOnFileContent?.unsubscribe();
    }

    getTextContent(event) {
        console.debug("Received text content: ", JSON.stringify(event));
        this.setState({output: event.value.data.subscribeToCopyPasteTextContent.body});
        this.copyToClipboard(event.value.data.subscribeToCopyPasteTextContent.body);
    }

    subscribeOnPush() {
        if (this.state.secret) {
            this.componentWillUnmount();
            this.subscriptionOnTextContent = this.apiClient.getTextContent(this.state.secret);
            this.subscriptionOnFileContent = this.apiClient.getFileContent(this.state.secret);
            console.debug('Subscribe with secret', this.state.secret);
            subscribe(this.state.secret, this.apiClient)
                .then((value) => {
                    console.debug('Subscribed to webpush', value);
                    this.setState({subscribedOnPush: true})
                })
                .catch((reason) => {
                    console.error('Subscription to webpush failed', reason)
                    this.setState({subscribedOnPush: false})
                });
        }

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

    render() {

        let alert = this.state.popupMessage ? (<Alert variant="outlined" severity={this.state.popupMessage.severity}>
            {this.state.popupMessage.message}
        </Alert>) : null;

        let fileUpload = this.state.secret && this.apiClient && this.state.subscribedOnPush ?
            <FileUpload secret={this.state.secret} client={this.apiClient} /> : null;
        return (

                <Paper elevation={10} style={{width: '100%', height: '100%'}}>
                    <AppBar position="sticky">
                        <Toolbar variant="regular">
                            <Typography variant="h6" color="inherit" component="div">
                            </Typography>
                            <ProTip />
                        </Toolbar>
                    </AppBar>
                    {alert}
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
                            {this.state.secret && this.state.subscribedOnPush ? <TextField
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
                            /> : null}
                        </Grid>
                        <Grid item xs={8}>
                            {this.state.secret && this.state.subscribedOnPush ? <TextField
                                ref={this.outputTextAreaRef}
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
                            /> : null}
                        </Grid>
                        <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2} padding={2}>
                            {
                                this.state.secret ? (
                                <Grid item>
                                    <Button onClick={this.subscribeOnPush} variant="contained">Subscribe</Button>
                                </Grid>
                                    ) : null
                            }
                            {this.state.subscribedOnPush ? (
                                <Grid item>
                                    <Button onClick={this.saveTextContent} variant="contained">Add</Button>
                                </Grid>
                            ) : null
                            }
                        </Grid>
                        <Grid item xs={8}>
                            {fileUpload}
                        </Grid>
                    </Grid>
                </Paper>
        );
    }
}

export default ClipBoard;