import React from "react";
import {Component} from "react";
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default class HelpDialog extends Component {
    state = {
        opened: true
    }

    constructor(props) {
        super(props);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    open() {
        this.setState({opened: true})
    }

    close() {
        this.setState({opened: false})
    }

    render() {

        return (
            <div>
                <BootstrapDialog
                    onClose={this.close}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.opened}
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                            How to use
                            <IconButton
                                aria-label="close"
                                onClick={this.close}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Typography gutterBottom>
                            Online clipboard is intended to copy either text data or files between clients (browsers).
                        </Typography>
                        <Typography gutterBottom>
                            Clients share the same 'room' which is defined by the specified secret phrase.
                        </Typography>
                        <Typography gutterBottom>
                            The longer the secret phrase, the higher data privacy.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={this.close}>
                            OK
                        </Button>
                    </DialogActions>
                </BootstrapDialog>
            </div>
        );
    }
}