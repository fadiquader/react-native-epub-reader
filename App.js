import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Animated,
    Modal,
    StatusBar
} from 'react-native';

import { Epub, Streamer } from "./src/epub";

import TopBar from './src/TopBar'
import BottomBar from './src/BottomBar'
import Nav from './src/Nav'

class EpubReader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flow: "paginated", // paginated || scrolled-continuous
            location: 0,
            // url: "https://www.bookrix.com/Books/Download.html?bookID=blackluna_1271880616.3305869102&format=epub",
            url: "https://s3.amazonaws.com/epubjs/books/moby-dick.epub",
            src: "",
            origin: "",
            title: "",
            toc: [],
            showBars: false,
            showNav: false,
            sliderDisabled: true
        };

        this.streamer = new Streamer();
    }

    componentDidMount() {
        this.streamer.start()
            .then((origin) => {
                this.setState({origin})
                return this.streamer.get(this.state.url);
            })
            .then((src) => {
                return this.setState({src});
            });
    }

    componentWillUnmount() {
        this.streamer.kill();
    }

    toggleBars() {
        this.setState({ showBars: !this.state.showBars });
    }

    onLocationChange = (visibleLocation)=> {
        // console.log("locationChanged", visibleLocation)
        this.setState({visibleLocation});
    };

    onLocationsReady = (locations)=> {
        // console.log("location total", locations.total);
        this.setState({sliderDisabled : false});
    };

    onViewPress = (cfi, rendition)=> {
        this.toggleBars();
        console.log("press", cfi);
    };

    onReady = (book)=> {
        // console.log("Metadata", book.package.metadata)
        // console.log("Table of Contents", book.toc)
        this.setState({
            title : book.package.metadata.title,
            toc: book.navigation.toc
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                <Epub style={styles.reader}
                      ref="epub"
                    //src={"https://s3.amazonaws.com/epubjs/books/moby-dick.epub"}
                      src={this.state.src}
                      flow={this.state.flow}
                      location={this.state.location}
                      onLocationChange={this.onLocationChange}
                      onLocationsReady={this.onLocationsReady}
                      onReady={this.onReady}
                      onPress={this.onViewPress}
                      onLongPress={() => null}
                      onViewAdded={(index) => {
                          console.log("added", index)
                      }}
                      beforeViewRemoved={(index) => {
                          console.log("removed", index)
                      }}
                      onSelected={(cfiRange, rendition) => {
                          console.log("selected", cfiRange)
                          // Add marker
                          rendition.highlight(cfiRange, {});
                      }}
                      onMarkClicked={(cfiRange) => {
                          console.log("mark clicked", cfiRange)
                      }}
                    // themes={themes}
                    // theme="light"
                      origin={this.state.origin}
                      onError={(message) => {
                          console.log("EPUBJS-Webview", message);
                      }}
                />
                <View
                    style={[styles.bar, { top:0 }]}>
                    <TopBar
                        title={this.state.title}
                        shown={this.state.showBars}
                        onLeftButtonPressed={() => this.refs.nav.show()}
                        onRightButtonPressed={
                            (value) => {
                                if (this.state.flow === "paginated") {
                                    this.setState({flow: "scrolled-continuous"});
                                } else {
                                    this.setState({flow: "paginated"});
                                }
                            }
                        }
                    />
                </View>
                <View
                    style={[styles.bar, { bottom:0 }]}>
                    <BottomBar
                        disabled= {this.state.sliderDisabled}
                        value={this.state.visibleLocation ? this.state.visibleLocation.start.percentage : 0}
                        shown={this.state.showBars}
                        onSlidingComplete={
                            (value) => {
                                this.setState({location: value.toFixed(6)})
                            }
                        }/>
                </View>
                <View>
                    <Nav ref="nav"
                         display={(loc) => {
                             this.setState({ location: loc });
                         }}
                         toc={this.state.toc}
                    />

                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    reader: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: '#3F3F3C'
    },
    bar: {
        position:"absolute",
        left:0,
        right:0,
        height:55
    }
});

export default EpubReader;