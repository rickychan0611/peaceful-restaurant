import styled from 'styled-components';

const Dimmer = ({ state, close }) => {
  return (
    <Container
      state={state}
      onClick={() => {
        close(null);
        console.log("click");
        console.log(state);
      }}
    />
  );
};

const Container = styled.div`
  position: fixed;
  top: 82px;
  width: 100vw;
  height: 100vh;
  background-color: ${(p) => (p.state ? 'rgba(0,0,0,0.1)' : 'none')}; 
  backdrop-filter: ${(p) => (p.state ? 'blur(5px)' : 'none')};
`;

export default Dimmer;
