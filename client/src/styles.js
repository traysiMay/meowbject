import styled from "styled-components";

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

export const Claimtainer = styled.div`
  margin: 0rem 3rem;
  line-height: 1.4rem;
  font-weight: 700;
  border-left: 0.3rem black solid;
  padding-left: 1rem;
`;

export const Owntainer = styled.div`
text-align: center;
    font-size: 1.4rem;
    border: 1px black solid;
    width: 82%;
    padding: 1rem;
    margin: auto;
    box-shadow: 8px 6px black;
    margin-top:1.5rem;`

export const Loadtainer = styled(Owntainer)`
height: 100vh;
line-height: 100vh;
    font-size: 4rem;

`

export const Owner = styled.div`
font-size: 1rem;
    width: 80%;
    overflow-wrap: break-word;
    text-align: center;
    margin: auto;
    padding-top: 0.8rem;
`

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
`;

export const LogtainerTitle = styled.div`
  width: 3rem;
  border-bottom: 1px solid white;
  line-height: 1.6rem;
  margin-bottom: 0.4rem;
`;
export const Logtainer = styled.div`
  margin: 2rem 1rem 1rem 1.1rem;
  font-size: 0.7rem;
  background: black;
    color: #8e8ee3;
    padding: 0.6rem;
    box-shadow: 7px 7px #8e8ee3;
`;
