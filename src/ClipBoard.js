import React from "react";
import {Alert, AppBar, Box, Container, Grid, Paper, TextField, Toolbar, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import ApiClient from "./lib/ApiClient";
import {CopyPasteTextContent} from "./models";
import subscribe from "./lib/subscribe-to-webpush";
import ProTip from "./ProTip";
import FileUpload from "./FileUpload";
import isAppleDevice from "./lib/utils";
import {QRCodeSVG} from 'qrcode.react';
import HelpDialog from "./HelpDialog";
import CircularProgress, {
    CircularProgressProps,
} from '@mui/material/CircularProgress';

class ClipBoard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            input: '',
            output: '',
            secret: '',
            subscribedOnPush: false,
            popupMessage: null,
            receivedFiles: new Map(),
            roomLink: window.location.href
        }
        this.apiClient = new ApiClient();
        this.handleTextTypeIn = this.handleTextTypeIn.bind(this)
        this.handleSecretTypeIn = this.handleSecretTypeIn.bind(this)
        this.subscribeOnPush = this.subscribeOnPush.bind(this)
        this.sendTextContent = this.sendTextContent.bind(this)
        this.receivedTextContent = this.receivedTextContent.bind(this)
        this.copyToClipboard = this.copyToClipboard.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
        this.componentWillUnmount = this.componentWillUnmount.bind(this)
    }

    componentWillUnmount() {

    }

    componentDidMount() {
        const params = new URLSearchParams(window.location.search);
        let roomId = params.get('room')
        if (roomId) {
            this.setState({secret: roomId, roomLink: `${window.location.href}`})
        }
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
        this.setState(newState);
    }

    subscribeOnPush() {
        if (this.state.secret) {
            console.debug('Subscribe on push notifications');

            let textContentSubscription = this.apiClient.awaitTextContent(this.state.secret, this.receivedTextContent,
                (error)=>{
                    this.setState({
                        popupMessage: {
                            severity: "error",
                            message: error
                        }
                    })
                });

            subscribe(this.state.secret, this.apiClient, isAppleDevice())
                .then((value) => {
                        console.debug('Subscribed to web push notifications', value);
                        this.setState((prevState, prevProps) => {
                            prevState.textContentSubscription?.unsubscribe();

                                return {
                                    ...prevState,
                                    textContentSubscription,
                                    receivedFiles: new Map(),
                                    subscribedOnPush: true,
                                    popupMessage: {
                                        severity: "info",
                                        message: `Subscribed to ${this.state.secret}`
                                    },
                                    roomLink: (!window.location.search) ?
                                        `${window.location.href}?room=${this.state.secret}` :
                                            `${window.location.origin}?room=${this.state.secret}`
                                }
                            }
                        )
                    }).catch((reason) => {
                        console.error('Subscription to web push notifications failed', reason)
                        this.setState({subscribedOnPush: false})
                    });
        }
    }

    sendTextContent() {
        const savedTextContent : CopyPasteTextContent = this.apiClient.saveTextContent(this.state.secret,
            this.state.input);

        this.setState({input: '', contentId: savedTextContent.id});
        console.debug('Text content saved:', JSON.stringify(savedTextContent));
    }

    receivedTextContent(event) {
        console.debug('Received text content', event);
        const textContent = event.value.data.subscribeToCopyPasteTextContent.body;
        this.setState({output: textContent});
    }

    render() {
        return (
            <Paper elevation={10} style={{width: '100%', height: '100%'}}>
                <AppBar position="sticky">
                    <Toolbar variant="regular">
                        <Typography variant="h6" color="inherit" component="div">

                        </Typography>
                        <HelpDialog />
                        <ProTip />

                    </Toolbar>
                    { this.state.popupMessage ? (
                        <Alert variant="standard" severity={this.state.popupMessage.severity}>
                            {this.state.popupMessage.message}
                        </Alert>) : null
                    }
                </AppBar>

                    <Grid container direction="row"
                          justifyContent="center"
                          alignItems="center"
                          spacing={2}
                          columns={{xs: 4, sm: 8, md: 12}}
                          marginTop={0}>
                        <Grid item xs={2} sm={4} md={6} textAlign="end">
                            <TextField
                                id="secret"
                                label="Secret phrase"
                                value={this.state.secret}
                                onChange={this.handleSecretTypeIn}
                                variant="filled"
                            />
                        </Grid>
                        <Grid item xs={2} sm={4} md={6}>
                            {this.state.secret ?
                                <Button onClick={this.subscribeOnPush} variant="contained">Subscribe
                                    <QRCodeSVG value={this.state.roomLink} style={{marginLeft: 10, width: 50, height: 50}}
                                               renderAs='svg' level='L'
                                               bgColor='#165FC7' fgColor='#FFFFFF' imageSettings={{height: 50, width: 70, excavate: false}}/>
                                </Button> : null
                            }
                        </Grid>
                    </Grid>

                <Grid container direction="row"
                      justifyContent="center"
                      alignItems="center"
                      spacing={1}
                      columns={{xs: 4, sm: 8, md: 12}}
                      margin={0}
                      padding={1}>

                    <Grid item xs={4} sm={8} md={12}>
                        {this.state.subscribedOnPush ?
                            <TextField
                                id="input"
                                label="Paste content here"
                                multiline
                                rows={5}
                                value={this.state.input}
                                onChange={this.handleTextTypeIn}
                                variant="filled"
                                focused
                                sx={{width: '95%'}}
                            /> : null}
                    </Grid>
                    <Grid item xs={4} sm={8} md={12}>
                        {this.state.subscribedOnPush ?
                            <TextField
                                unselectable="off"
                                id="output"
                                label="Click here to copy content to the clipboard"
                                multiline
                                sx={{
                                    width: "95%"
                                }}
                                rows={5}
                                fullWidth
                                disabled
                                onClick={(event) => {this.copyToClipboard(
                                    event.target.value || event.target.textContent)}}
                                value={this.state.output}
                                variant="filled"
                            /> : null}
                    </Grid>
                    <Grid item xs={4} sm={8} md={12} alignItems="center" textAlign="center">
                        {this.state.subscribedOnPush ?
                            <Button onClick={this.sendTextContent} variant="contained" disabled={!this.state.input}>Add</Button> : null
                        }
                    </Grid>
                    <Grid item xs={4} sm={8} md={12} alignItems="center" textAlign="center">
                        {this.state.subscribedOnPush ?
                            <FileUpload secret={this.state.secret}
                                        client={this.apiClient}/> : null}
                    </Grid>
                </Grid>
            </Paper>

        );
    }

    copyToClipboard(value) {
        console.debug('Copy data to clipboard:', value);
        if (!navigator.clipboard) {
            this.setState({
                popupMessage: {
                    severity: 'error',
                    message: 'Clipboard is available only for https'
                }
            })
        } else {
            navigator.clipboard.writeText(value).then((value) => {
                console.debug('Copied to clipboard');
                this.setState({
                    popupMessage: {
                        severity: 'success',
                        message: 'Copied to clipboard'
                    }
                })
            }, (reason) => {
                console.error(reason);
                this.setState({
                    popupMessage: {
                        severity: 'warning',
                        message: 'Couldn\'t copy to clipboard. Reason: '.concat(reason.toString())
                    }
                })
            });
        }
    }

}

export default ClipBoard;