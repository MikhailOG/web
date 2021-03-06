import React, { useRef, useEffect, useState } from 'react';

const ZoomedImage = (props) => {
    const [imgState, setImgState] = useState({
        top: '8rem',
    });
    const zoomedImageRef = useRef();

    const rendered = () => {
        //Render complete
        console.log(getComputedStyle(zoomedImageRef.current).height)
        console.log(zoomedImageRef.current.clientHeight)
        if ((props.window.height - zoomedImageRef.current.clientHeight)/2 !== imgState.top)
            setImgState({ top: (props.window.height - zoomedImageRef.current.clientHeight)/2 });
    }
    
    const startRender = () => {
        //Rendering start
        requestAnimationFrame(rendered);
    }

    const loaded = () => {
        requestAnimationFrame(startRender);
    }
    return (
        <div className="image-preview" style={{top: imgState.top}}>
            <img 
                onLoad={loaded}
                style={{maxHeight: props.window.height * 0.8, maxWidth: props.window.width * 8 /12}}
                ref={zoomedImageRef}
                src={props.zoomedImage} 
                alt={'zoomed image'}
            />
        </div>
    ); 
}
export default ZoomedImage;