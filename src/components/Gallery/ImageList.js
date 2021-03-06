import React, { Component } from 'react'
import ImageCard from './ImageCard';
import ZoomedImage from './ZoomedImage';
import LayoutContext from '../../context/layout-context';
import Grip from './Grip';
import Escape from './Escape';
import { convertRemToPixels } from '../../Scripts/convertRemToPixels';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import gear from "../../images/gear.svg";

class ImagesList extends Component {
    constructor(props) {
        super(props);
        this.imagesList = React.createRef();
        this.imagesQty = 56;
    }
    state = {
        images: {},
        sortedImages: [],
        zoomedImage: null,
        loading: true,
        loadedImagesQty: 0
    }
    static contextType = LayoutContext;
    componentDidMount() {
        const images = this.importAll(require.context('../../images/gallery', false, /\.(png|jpe?g|svg)$/));
        let sortedKeys = Object.keys(images).sort((a,b) => Number(a.substring(0, a.indexOf('.'))) - Number(b.substring(0, b.indexOf('.'))));
        this.setState({ images: images, sortedImages: sortedKeys });
    }
    // componentDidUpdate() {
    //     console.log(this.props.showBackdrop)
    //     if (this.state.zoomedImage && !this.props.showBackdrop) {
    //         this.setState({ zoomedImage: null});
    //     }
    // }
    importAll(r) {
        let images = {};
        r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
        return images;
    }
    imageClickedHandler = (image, imgKey) => {
        this.context.toggleBackdrop();
        this.setState({ zoomedImage: {image: image, imgKey: imgKey}});
    }
    imageLoadedHandler = () => {
        this.setState({loadedImagesQty: this.state.loadedImagesQty + 1}, () => {
            if (this.state.loadedImagesQty === this.imagesQty) {
                this.setState({loading: false, loadedImagesQty: 0})
                console.log("ALL IMAGES LOADED")
            }
        })
    }
    prewImage = () => {
        let dotIndex = this.state.zoomedImage.imgKey.indexOf('.');
        let index = Number(this.state.zoomedImage.imgKey.slice(0, dotIndex));
        if (index>1) index--;
        else index = this.imagesQty;
        index = String(index);
        let newImgKey = index.concat('', this.state.zoomedImage.imgKey.substr(dotIndex));
        this.setState({ zoomedImage: {image:this.state.images[newImgKey].default , imgKey: newImgKey}});
    }
    nextImage = () => {
        let dotIndex = this.state.zoomedImage.imgKey.indexOf('.');
        let index = Number(this.state.zoomedImage.imgKey.slice(0, dotIndex));
        if (index < this.imagesQty) index++;
        else index = 1;
        index = String(index);
        let newImgKey = index.concat('', this.state.zoomedImage.imgKey.substr(dotIndex));
        this.setState({ zoomedImage: {image:this.state.images[newImgKey].default , imgKey: newImgKey}});
    }
    render() {
        let gripStyle = {
            top: this.context.windowHeight/2 - convertRemToPixels(3) + 'px'
        }
        setTimeout(() => {
            if (this.state.zoomedImage && !this.props.showBackdrop) {
                this.setState({ zoomedImage: null});
            }
        }, 10)

        return (
            <React.Fragment>
                {this.state.zoomedImage?<React.Fragment>
                    <ZoomedImage
                    window={{height: this.context.windowHeight, width: this.context.windowWidth}}
                    getZoomedImageHeight={this.getZoomedImageHeight}
                    zoomedImage={this.state.zoomedImage.image}
                    />
                    <Grip clicked={this.prewImage} style={gripStyle} direction={'left'}/>
                    <Grip clicked={this.nextImage} style={gripStyle} direction={'right'}/>
                    <Escape clicked={this.props.onToggleBackdrop}/>
                </React.Fragment>:null}
                <div className="images-list" style={this.state.loading?{opacity:'0'}:null} ref={this.imagesList}>
                    {this.state.sortedImages.map((imgKey, index) => <ImageCard 
                        key={index} 
                        imgIndex={index}
                        imgKey={imgKey}
                        img={this.state.images[imgKey].default}
                        imageClickedHandler={this.imageClickedHandler}
                        imageLoadedHandler={this.imageLoadedHandler}
                        />)}
                </div>
                {this.state.loading?
                <div className="gear-spinner">
                <img className="spinner" src={gear} alt="logo"/>
                <h2>Загрузка {Math.round(100*this.state.loadedImagesQty/this.imagesQty)}%...</h2>
                </div>:null}
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        showBackdrop: state.layout.showBackdrop
    };
};
const mapDispatchToProps = dispatch => {
    return {
        onToggleBackdrop: () => dispatch(actionCreators.toggleBackdrop())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImagesList)