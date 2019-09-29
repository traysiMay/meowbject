import React, { useContext, useEffect, useRef, useState } from "react";
import web3 from "web3";
import { Web3Context } from "./Web3Context";
import { isOwned } from "./constants";
import * as THREE from "three";
import {
  Button,
  Claimtainer,
  FetchStatus,
  Logtainer,
  LogtainerTitle
} from "./styles";
function App() {
  const { checkOwner, checkQR, claimQR, state } = useContext(Web3Context);
  // IF PROD 2 IF DEV 1
  const qr = window.location.search.split("=")[1].split("-");
  const qrIndex = process.env.NODE_ENV === "development" ? 1 : 2;
  // const qr = window.location.pathname.split("/")[qrIndex].split("-");
  // console.log(qr);
  const thereIsQR = qr[0] !== "" ? true : false;
  const color = useRef();
  const three = useRef();
  useEffect(() => {
    if (!state.tributes.tributes) return;
    color.current = state.tributes.tributes.color;
  }, [state.tributes]);
  const getColor = () => color.current;
  useEffect(() => {
    console.log(thereIsQR);
    if (thereIsQR) checkOwner(web3.utils.keccak256(qr[1]));
    return () => {};
  }, []);
  useEffect(() => {
    if (!thereIsQR) return;
    if (!state.tributes.tributes) return;
    console.log(state.tributes.tributes);
    const scene = new THREE.Scene();
    const halfHeight = window.innerHeight / 1.5;
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / halfHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, halfHeight);
    renderer.setClearColor(0xffffff, 0);
    console.log(three.current);
    three.current.appendChild(renderer.domElement);

    const { shape } = state.tributes.tributes;
    let geometry;
    if (shape === "sphere") {
      geometry = new THREE.SphereGeometry(1, 32, 32);
    } else if (shape === "cube") {
      geometry = new THREE.BoxGeometry(1, 1, 1);
    } else if (shape === "torus") {
      geometry = new THREE.TorusGeometry(1, 0.1, 16, 100);
    } else if (shape === "torusknot") {
      geometry = new THREE.TorusKnotGeometry(1, 0.3, 20, 16);
    }
    const material = new THREE.MeshPhongMaterial({
      color: "red",
      emissive: 0x2a0000,

      shininess: 10,
      specular: 0xffffff
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(1.25, 1.25, 1.25);
    scene.add(spotLight);

    var light = new THREE.AmbientLight(0x404040, 4); // soft white light
    scene.add(light);

    camera.position.z = 5;
    function animate() {
      requestAnimationFrame(animate);
      material.color = new THREE.Color(getColor());
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    }
    animate();
  }, [state.tributes]);
  const {
    ownership: { owner },
    fetcher: { status, response },
    log
  } = state;
  if (!thereIsQR) return <div>nothing to see here</div>;
  return (
    <div>
      <FetchStatus>{status}</FetchStatus>

      <div id="three" ref={three}></div>
      {isOwned(owner) ? (
        <div style={{ textAlign: "center", fontSize: "1.4rem" }}>
          <div>claimed by:</div> <div style={{ fontSize: "1rem" }}>{owner}</div>
        </div>
      ) : (
        <Claimtainer>
          <div>hello friend!</div>
          <div>would you like to claim this meowbject?</div>
          <Button onClick={() => claimQR(qr)}>claim</Button>
        </Claimtainer>
      )}
      <Logtainer>
        <LogtainerTitle style={{ borderBottom: "1px black solid" }}>
          DEV_LOG
        </LogtainerTitle>
        {log.map((l, i) => (
          <div
            key={l + i}
            style={{
              borderBottom: "1px black solid",
              padding: "1rem 0rem 1rem 0rem"
            }}
          >
            {l}
          </div>
        ))}
      </Logtainer>
    </div>
  );
}

export default App;
