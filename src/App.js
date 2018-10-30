import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Toolbar, AppBar, Typography, CssBaseline, withStyles, Drawer, Button, MuiThemeProvider } from '@material-ui/core';
import Track from './classes/Track.js';
import theme from './ui/theme/index.js';
import TrackViewer from './components/TrackViewer.js';
import MainTrackEditor from './components/MainTrackEditor.js';
//import './stylesheets/style.css';

const drawerWidth = 300;

const styles = theme => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    paddingTop: 72,
    maxHeight: '100vh'
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    //padding: theme.spacing.unit * 3,
    height: 'calc(100vh - 72px)',
    overflow: 'hidden',
    marginTop: 72
  },
  h5: {
    marginBottom: theme.spacing.unit * 2,
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTrack: new Track(),
      selectedSegment: undefined
    };
  }

  openTrackFile = (i_filePath) => {
    if (i_filePath === undefined){
      return;
    }
    let fileReader = new FileReader();
    var self = this;
    fileReader.onload = (e) => {
      let content = fileReader.result;
      let trackDocument = new DOMParser().parseFromString(content, 'text/xml');
      self.loadDocument(trackDocument);
    };
    fileReader.readAsText(i_filePath);
  }

  loadDocument = (i_xmlDocument) => {
    let track = new Track();
    track.loadTORCSXml(i_xmlDocument);
    this.setState({ currentTrack: track });
  };

  selectSegment = (segment) => {
    this.setState({ selectedSegment: segment });
  };

  render() {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <main className={classes.root}>
          <AppBar color="primary" position="absolute" className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
              <Typography component="h1" variant="h5" color="inherit" noWrap className={classes.title}>
                Track Editor - {this.state.currentTrack.header.name}
              </Typography>
              <input id="fileLoadFile" type="file" ref={(ref) => this.upload = ref} style={{ display: 'none' }} 
                onChange={e => this.openTrackFile(e.target.files[0])} />
              <Button color="inherit" onClick={(e) => this.upload.click() }>Open file</Button>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" classes={{ paper: classes.drawerPaper }}>
            <MainTrackEditor mainTrack={this.state.currentTrack.mainTrack} selectedSegment={this.state.selectedSegment}
              onSegmentSelected={segment => this.selectSegment(segment)}
            />
          </Drawer>
          <TrackViewer classes={classes} track={this.state.currentTrack} selectedSegment={this.state.selectedSegment}
            onSegmentSelected={segment => this.selectSegment(segment)}
          />
        </main>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
