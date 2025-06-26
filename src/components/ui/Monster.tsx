"use client";

export default function Monster() {
  return (
    <div className="monster-container">
      <div className="monster-main">
        <div className="monster">
          <div className="monster__face">
            <div className="monster__eyes">
              <div className="monster__eye"></div>
              <div className="monster__eye"></div>
            </div>
            <div className="monster__mouth">
              <div className="monster__top"></div>
              <div className="monster__bottom"></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .monster-container {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          justify-content: center;
          align-items: flex-end;
          width: auto;
          height: auto;
          z-index: 10;
          pointer-events: none;
        }

        .monster-main {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          position: relative;
          width: 600px;
          height: 500px;
          transform-origin: center bottom;
        }

        .monster {
          display: flex;
          justify-content: center;
          position: relative;
          width: 400px;
          height: 500px;
          border: 1px solid rgba(0, 0, 0, 0.5);
          border-top-left-radius: 200px;
          border-top-right-radius: 200px;
          background: transparent;
          box-shadow: 80px 80px 0 rgba(0, 0, 0, 0.4);
          margin-bottom: 0;
        }

        .monster__face {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          position: absolute;
          top: 19%;
          width: 75%;
          height: 380px;
        }

        .monster__eyes {
          display: flex;
          justify-content: space-between;
          width: 28%;
          height: auto;
          margin-bottom: 20px;
        }

        .monster__eye {
          width: 20px;
          height: 36px;
          border-radius: 40px;
          background: #000000;
        }

        .monster__mouth {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          width: 100%;
          height: 0%;
          overflow: hidden;
          border: 30px solid #ffc107;
          border-radius: 200px;
          background-color: #ff5722;
          animation: monster-mouth 1.75s infinite;
        }

        .monster__mouth::before {
          content: "";
          position: absolute;
          width: 160px;
          height: 80px;
          border-radius: 200px;
          background-color: #d32f2f;
        }

        .monster__mouth::after {
          content: "";
          position: absolute;
          bottom: -80px;
          width: 170px;
          height: 80px;
          border-top-left-radius: 50%;
          border-top-right-radius: 50%;
          background-color: #ff7043;
          animation: monster-tongue 1.75s infinite;
        }

        .monster__top {
          position: absolute;
          top: -30px;
          width: 180px;
          height: 30px;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          background: linear-gradient(
            135deg,
            #ffffff 0%,
            #f8f6f0 50%,
            #f0ebe3 100%
          );
          z-index: 100;
          animation: monster-teeth-top 1.75s infinite;
        }

        .monster__bottom {
          position: absolute;
          bottom: -30px;
          width: 110px;
          height: 30px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          background: linear-gradient(
            135deg,
            #ffffff 0%,
            #f8f6f0 50%,
            #f0ebe3 100%
          );
          z-index: 100;
          animation: monster-teeth-bottom 1.75s infinite;
        }

        @media (max-width: 1024px) {
          .monster-main {
            transform: scale(0.9);
            width: 540px;
            height: 450px;
          }
        }

        @media (max-width: 768px) {
          .monster-main {
            transform: scale(0.75);
            width: 450px;
            height: 375px;
          }
        }

        @media (max-width: 640px) {
          .monster-main {
            transform: scale(0.65);
            width: 390px;
            height: 325px;
          }
        }

        @media (max-width: 480px) {
          .monster-main {
            transform: scale(0.55);
            width: 330px;
            height: 275px;
          }
        }
      `}</style>
    </div>
  );
}
