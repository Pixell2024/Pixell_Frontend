import React from 'react';

const styles = {
  container: {
    height: '100vh',
    margin: 0,
    fontSize: '20px',
    fontWeight:"bold",
    color: 'white',
    backgroundImage: `url('/assests/comingSoon.jpg')`,
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    fontFamily: `Courier New, Courier, monospace`,
    position: 'relative',
  },
  topleft: {
    position: 'absolute',
    top: 9,
    left: '16px',
  },
  bottomleft: {
    position: 'absolute',
    bottom: 0,
    left: '16px',
  },
  middle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
};

const ComingSoon = () => (
  <div style={styles.container}>
    <div style={styles.topleft}>
      <img src='/assests/pixell white logo.png' alt='pixell Logo' width={100} height={100}/>
    </div>
    <div style={styles.middle}>
      <h4>COMING SOON</h4>
      {/* <hr style={styles.hr} /> */}
      <p style={{color:"white",position:"relative",top:"100px",fontSize:"4rem"}}>PIXELL</p>
    </div>
    <div style={styles.bottomleft}>
      <p style={{color:"white",fontSize:"18px"}}>We create signage with exceptional design and quality to make your brand stand out.</p>
    </div>
  </div>
);

export default ComingSoon;
