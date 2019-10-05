import React, { useContext, useEffect, useState } from 'react'
import jsQR from "jsqr";
import QR from './2.png'
import { Web3Context } from './Web3Context';
const THREE = window.THREE
const THREEx = window.THREEx

const AR = () => {
    const [qr, setQR] = useState()
    const [shape, setShape] = useState()
    const { getTributes } = useContext(Web3Context)

    useEffect(() => {
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        var img = new Image()
        img.src = QR
        canvas.width = 512;
        canvas.height = 512;
        img.onload = () => {
            context.drawImage(img, 0, 0);
            var myData = context.getImageData(0, 0, img.width, img.height);
            console.log(myData)
            const code = jsQR(myData.data, img.width, img.height);
            setQR(code.data)
        }
    }, [])


    useEffect(() => {
        if (!qr) return
        const getT = async () => { const t = await getTributes(); setShape(t) }
        getT()
    }, [qr])

    useEffect(() => {
        if (!shape) return
        console.log(shape)
        // return
        ////////////////////////////////////////////////////////////////////////////////
        // Init
        ////////////////////////////////////////////////////////////////////////////////

        // init renderer
        var renderer = new THREE.WebGLRenderer({
            // antialias	: true,
            alpha: true
        });
        renderer.setClearColor(new THREE.Color('lightgrey'), 0)
        // renderer.setPixelRatio( 2 );
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'absolute'
        renderer.domElement.style.top = '0px'
        renderer.domElement.style.left = '0px'
        document.body.appendChild(renderer.domElement);

        // array of functions for the rendering loop
        var onRenderFcts = [];

        // init scene and camera
        var scene = new THREE.Scene();

        //////////////////////////////////////////////////////////////////////////////////
        //		Initialize a basic camera
        //////////////////////////////////////////////////////////////////////////////////

        // Create a camera
        var camera = new THREE.Camera();
        scene.add(camera);

        ////////////////////////////////////////////////////////////////////////////////
        //          handle arToolkitSource
        ////////////////////////////////////////////////////////////////////////////////

        var artoolkitProfile = new THREEx.ArToolkitProfile()
        // artoolkitProfile.sourceWebcam()
        // artoolkitProfile.sourceVideo(THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4').kanjiMarker();
        artoolkitProfile.sourceImage('./2.png')
        artoolkitProfile.contextParameters.patternRatio = .77
        artoolkitProfile.contextParameters.cameraParametersUrl = "./camera_para.dat"
        var arToolkitSource = new THREEx.ArToolkitSource(artoolkitProfile.sourceParameters)

        arToolkitSource.init(function onReady() {
            onResize()
        })

        // handle resize
        window.addEventListener('resize', function () {
            onResize()
        })
        function onResize() {
            arToolkitSource.onResizeElement()
            arToolkitSource.copyElementSizeTo(renderer.domElement)
            if (arToolkitContext.arController !== null) {
                arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        //          initialize arToolkitContext
        ////////////////////////////////////////////////////////////////////////////////

        // create atToolkitContext
        var arToolkitContext = new THREEx.ArToolkitContext(artoolkitProfile.contextParameters)
        // initialize it
        arToolkitContext.init(function onCompleted() {
            // copy projection matrix to camera
            camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
        })

        // update artoolkit on every frame
        onRenderFcts.push(function () {
            if (arToolkitSource.ready === false) return

            arToolkitContext.update(arToolkitSource.domElement)
        })


        ////////////////////////////////////////////////////////////////////////////////
        //          Create a ArMarkerControls
        ////////////////////////////////////////////////////////////////////////////////

        var markerGroup = new THREE.Group
        scene.add(markerGroup)
        var markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerGroup, {
            type: 'pattern',
            patternUrl: '2.patt',
        })


        // // build a smoothedControls
        // var smoothedGroup = new THREE.Group()
        // scene.add(smoothedGroup)
        // var smoothedControls = new THREEx.ArSmoothedControls(smoothedGroup)
        // onRenderFcts.push(function(delta){
        // 	smoothedControls.update(markerGroup)
        // })

        //////////////////////////////////////////////////////////////////////////////////
        //		add an object in the scene
        //////////////////////////////////////////////////////////////////////////////////


        var markerScene = new THREE.Scene()
        markerGroup.add(markerScene)

        var mesh = new THREE.AxesHelper()
        markerScene.add(mesh)

        // add a torus knot
        // var geometry = new THREE.CubeGeometry(1, 1, 1);
        // var material = new THREE.MeshNormalMaterial({
        //     transparent: true,
        //     opacity: 0.5,
        //     side: THREE.DoubleSide
        // });
        // var mesh = new THREE.Mesh(geometry, material);
        // mesh.position.y = geometry.parameters.height / 2
        // markerScene.add(mesh)

        let geometry;
        if (shape.shape === "sphere") {
            geometry = new THREE.SphereGeometry(1, 32, 32);
        } else if (shape.shape === "cube") {
            geometry = new THREE.BoxGeometry(1, 1, 1);
        } else if (shape.shape === "torus") {
            geometry = new THREE.TorusGeometry(1, 0.1, 16, 100);
        } else {
            geometry = new THREE.TorusKnotGeometry(1, 0.3, 20, 16);
        }

        var material = new THREE.MeshBasicMaterial({ color: shape.color });

        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 0.5
        markerScene.add(mesh);

        onRenderFcts.push(function (delta) {
            mesh.rotation.x += delta * Math.PI
        })

        //////////////////////////////////////////////////////////////////////////////////
        //		render the whole thing on the page
        //////////////////////////////////////////////////////////////////////////////////
        // render the scene
        onRenderFcts.push(function () {
            renderer.render(scene, camera);
        })

        // run the rendering loop
        var lastTimeMsec = null
        requestAnimationFrame(function animate(nowMsec) {
            // keep looping
            requestAnimationFrame(animate);
            // measure time
            lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
            var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
            lastTimeMsec = nowMsec
            // call each update function
            onRenderFcts.forEach(function (onRenderFct) {
                onRenderFct(deltaMsec / 1000, nowMsec / 1000)
            })
        })
    }, [shape])
    return (
        <canvas style={{ display: 'none' }} id="canvas" />
    )
}

export default AR