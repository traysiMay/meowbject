import React, { useContext, useEffect, useRef, useState } from "react";
import { AdminTag, FormContainer, InputField, Button, QR } from "./styles";
import { DeviceContext } from "./DeviceContext";
import { Web3Context } from "./Web3Context";
import QRCode from "qrcode";
import felix from "./felix_grey.png";
import loading from "./loading.gif";
const host =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://meowbjects.com";

const Admin = () => {
  const { setAdmin } = useContext(DeviceContext);
  const { addQR, state } = useContext(Web3Context);
  const name = useRef();
  const shape = useRef();
  const color = useRef();

  const [img, setImg] = useState();

  const [qr, setQR] = useState();

  const sendQR = () => {
    const { value: nvalue } = name.current;
    const { value: svalue } = shape.current;
    const { value: cvalue } = color.current;
    addQR(nvalue, svalue, cvalue);
  };
  const makeQR = async text => {
    var opts = {
      errorCorrectionLevel: "H",
      type: "image/jpeg",
      color: { light: "#FFFFFF" },
      width: 400,
      rendererOpts: {
        quality: 1
      }
    };
    const qr = await QRCode.toDataURL(text, opts);
    setQR(qr);
    return qr;
  };

  const drawQR = async () => {
    const qr = await makeQR(`${host}/?${state.qr}`);
    const canvas = document.getElementById("canvas");
    const qrImg = new Image();
    const feliximg = new Image();
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    qrImg.src = qr;
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 0, 0, 500, 500);
      feliximg.src = felix;
      feliximg.onload = function () {
        ctx.drawImage(feliximg, 200, 200, 100, 100);
        setImg(canvas.toDataURL());
      };
    };
  };
  useEffect(() => {
    if (!state.qr) {
      setQR(null);
      return;
    }
    drawQR();
  }, [state.qr]);
  return (
    <div style={{ height: "100%" }}>
      <div style={{ position: "sticky", top: "10rem" }}>
        <AdminTag onClick={() => setAdmin(false)}>no admin?</AdminTag>
      </div>
      <FormContainer style={{ textAlign: "center" }}>
        <h1>add one</h1>
        <InputField ref={name} placeholder="name" />
        <InputField ref={shape} placeholder="shape" />
        <InputField ref={color} placeholder="color" />
        <Button onClick={sendQR} disabled={state.fetcher.status === "FETCHING"}>
          {state.fetcher.status === "FETCHING" ? "ADDING" : "CLICKY"}
        </Button>
      </FormContainer>
      <img
        style={{
          width: "80%",
          display: "block",
          margin: "auto",
          maxWidth: "420px",
          boxShadow: "12px 15px black"
        }}
        src={state.fetcher.status === "FETCHING" ? loading : img}
      ></img>
      {qr && (
        <canvas
          id="canvas"
          width={"500px"}
          height="500px"
          style={{ maxWidth: "21rem", maxHeight: "21rem", display: "none" }}
        ></canvas>
      )}
      {qr && (
        <a
          style={{
            textAlign: "center",
            margin: "auto",
            display: "block",
            fontSize: "30px",
            textDecoration: "none",
            color: "red"
          }}
          href={`${host}/?${state.qr}`}
        >
          {state.fetcher.status === "FETCHING" ? "ADDING..." : "CLICKY"}
        </a>
      )}
      <div
        style={{
          textAlign: "center",
          width: "80%",
          display: "block",
          margin: "auto",
          overflowWrap: "break-word"
        }}
      >
        {state.fetcher.status} - {JSON.stringify(state.fetcher.response)}
      </div>
    </div>
  );
};

export default Admin;
