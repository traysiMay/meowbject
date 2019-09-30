import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import web3 from "web3";
import { Web3Context } from "./Web3Context";
import { isOwned } from "./constants";
import * as THREE from "three";
import {
  AdminTag,
  Button,
  Bottom,
  Owner,
  Owntainer,
  FetchStatus,
  Loadtainer,
  Logtainer,
  LogtainerTitle
} from "./styles";
import { DeviceContext } from "./DeviceContext";

function App() {
  const { checkOwner, claimQR, state } = useContext(Web3Context);
  const { setAdmin } = useContext(DeviceContext);
  const qr = window.location.search
    ? window.location.search.split("?")[1].split("-")
    : [1, "null_object"];
  console.log(qr);
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
    const scene = new THREE.Scene();
    console.log("THREE");
    const halfHeight = window.innerHeight / 2;
    const camera = new THREE.PerspectiveCamera(
      75,
      (window.innerWidth * 0.8) / halfHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth * 0.8, halfHeight);
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
    } else {
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
    let req;
    camera.position.z = 5;
    function animate() {
      req = requestAnimationFrame(animate);
      material.color = new THREE.Color(getColor());
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      document.querySelector("canvas").remove();
      window.cancelAnimationFrame(req);
    };
  }, [state.tributes]);
  const {
    ownership: { owner },
    fetcher: { status, response },
    log,
    tributes
  } = state;
  if (!thereIsQR) return <div>nothing to see here</div>;
  return (
    <div>
      <div style={{ position: "sticky", top: "10rem" }}>
        <AdminTag onClick={() => setAdmin(true)}>admin?</AdminTag>
      </div>
      <FetchStatus>{status}</FetchStatus>
      {!tributes.tributes && <Loadtainer>LOADING</Loadtainer>}
      <div id="three" ref={three}></div>
      <Bottom>
        {isOwned(owner) ? (
          <Owntainer style={{ textAlign: "center", fontSize: "1.4rem" }}>
            <div>claimed by:</div> <Owner>{owner}</Owner>
          </Owntainer>
        ) : (
          <Owntainer>
            <div
              style={{
                textDecoration: "underline",
                lineHeight: "3rem"
              }}
            >
              hello friend!
            </div>
            {status !== "FETCHING" ? (
              <div>
                <div>would you like to claim this meowbject?</div>
                <Button onClick={() => claimQR(qr)}>claim</Button>
              </div>
            ) : (
              <div>CLAIMING...</div>
            )}
            {status === "ERROR" && (
              <div style={{ padding: "2rem", color: "red" }}>{response}</div>
            )}
          </Owntainer>
        )}
        <Logtainer>
          <LogtainerTitle>DEV_LOG</LogtainerTitle>
          {log.map((l, i) => (
            <div
              key={l + i}
              style={{
                borderBottom: "1px white solid",
                padding: "1rem 0rem 1rem 0rem",
                overflowWrap: "break-word"
              }}
            >
              {l}
            </div>
          ))}
        </Logtainer>
      </Bottom>
    </div>
  );
}

export default App;
