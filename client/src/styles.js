import styled from "styled-components";

export const AdminTag = styled.div`
  height: 3rem;
  position: absolute;
  background: red;
  line-height: 3.4rem;
  padding: 0rem 0.5rem 0rem 0.6rem;
  font-size: 0.9rem;
  border-radius: 0rem 1.8rem 0 0;
  font-weight: 800;
  box-shadow: 7px 8px black;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
  width: 5rem;
`;

export const FetchStatus = styled.div`
  color: white;
  font-family: monospace;
  font-weight: bold;
  background: black;
  width: 100%;
  text-align: center;
  height: 2rem;
  font-size: 1.6rem;
  line-height: 2rem;
  margin-bottom: 1rem;
`;

export const Bottom = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const Owntainer = styled.div`
  text-align: center;
  font-size: 1.4rem;
  border: 1px black solid;
  width: 82%;
  padding: 1rem;
  margin: auto;
  box-shadow: 8px 6px black;
  margin-top: 1.5rem;
  max-width: 33rem;
`;

export const Loadtainer = styled(Owntainer)`
  height: 100vh;
  line-height: 100vh;
  font-size: 4rem;
`;

export const Owner = styled.div`
  font-size: 1rem;
  width: 80%;
  overflow-wrap: break-word;
  text-align: center;
  margin: auto;
  padding-top: 0.8rem;
`;

export const Button = styled.button`
  background: white;
  color: black;
  font-family: monospace;
  display: block;
  width: 9rem;
  font-size: 2rem;
  height: 4rem;
  margin-top: 3rem;
  margin: auto;
  margin-top: 1.1rem;
  border: 3px black solid;
  box-shadow: 7px 5px #f41717;
`;

export const LogtainerTitle = styled.div`
  width: 3rem;
  border-bottom: 1px solid white;
  line-height: 1.6rem;
  margin-bottom: 0.4rem;
`;
export const Logtainer = styled.div`
  margin: 2rem 3rem 1rem 1.1rem;
  font-size: 0.7rem;
  background: black;
  color: #8e8ee3;
  padding: 0.6rem;
  box-shadow: 7px 7px #8e8ee3;
  @media (max-width: 500px) {
    width: 85%;
  }
`;

export const FormContainer = styled.div`
  border: 2px black solid;
  text-align: center;
  max-width: 21rem;
  margin: 2rem auto;
  padding: 0px 0rem 2rem;
  box-shadow: 12px 9px black;
`;

export const InputField = styled.input`
  width: 13rem;
  border-color: black;
  height: 2rem;
  font-size: 1rem;
  padding: 0.5rem;
  margin: 1rem 0rem;
`;

export const QR = styled.img`
  margin: auto;
  width: 50%;
  max-width: 21rem;
  display: block;
  box-shadow: 12px 18px black;
`;
