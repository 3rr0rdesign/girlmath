import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    background: ${(props) => (props.girlMath ? "#ffc0cb" : "#000")};
    color: ${(props) => (props.girlMath ? "#d63384" : "#fff")};
    transition: background 0.3s ease, color 0.3s ease;
    overflow: hidden; /* prevent scroll */
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;      
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 1rem;
  box-sizing: border-box;
  position: relative;
`;

const ModeButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${(props) => (props.girlMath ? "#d63384" : "#222")};
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  &:hover {
    background: ${(props) => (props.girlMath ? "#e64997" : "#333")};
  }
`;

const Block = styled.div`
  text-align: center;
  margin: 1.5rem 0;
`;

const CurrencyRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
`;

const Flag = styled.img`
  width: 48px;
  height: 32px;
  border-radius: 6px;
  object-fit: cover;
`;

const Code = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
`;

const AmountInput = styled.input`
  background: transparent;
  border: none;
  border-bottom: 3px solid #444;
  font-size: 2.5rem;
  color: inherit;
  width: 200px;
  text-align: center;
  outline: none;
  margin-top: 0.5rem;
`;

const AmountDisplay = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-top: 0.5rem;
`;

const RateInfo = styled.div`
  font-size: 1.1rem;
  color: ${(props) => (props.girlMath ? "#d63384" : "#bbb")};
  margin-top: 0.5rem;
  min-height: 1.2rem; /* keeps height stable */
`;

const SwapButton = styled.button`
  background: ${(props) => (props.girlMath ? "#ff69b4" : "#222")};
  border: none;
  border-radius: 50%;
  width: 70px;
  height: 70px;
  margin: 1rem 0;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: ${(props) => (props.girlMath ? "#ff85c1" : "#333")};
  }
`;

function App() {
  const [amount, setAmount] = useState("100");
  const [direction, setDirection] = useState("eur-to-try");
  const [rate, setRate] = useState(48.0); // fallback default
  const [girlMath, setGirlMath] = useState(false);

  // Fetch with caching
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const cached = localStorage.getItem("eurTryRate");
        const cachedTime = localStorage.getItem("eurTryRateTime");

        if (cached && cachedTime) {
          const age = Date.now() - parseInt(cachedTime, 10);
          if (age < 24 * 60 * 60 * 1000) {
            setRate(parseFloat(cached));
            return;
          }
        }

        const res = await fetch(
          "https://api.exchangerate.host/convert?from=EUR&to=TRY"
        );
        const data = await res.json();
        if (data?.info?.rate) {
          setRate(data.info.rate);
          localStorage.setItem("eurTryRate", data.info.rate);
          localStorage.setItem("eurTryRateTime", Date.now().toString());
        }
      } catch (err) {
        console.log("⚠️ Could not fetch live rate, using fallback.");
      }
    };

    fetchRate();
  }, []);

  // Update theme for iOS/Android status bar
  useEffect(() => {
    const themeColor = document.querySelector("meta[name=theme-color]");
    if (themeColor) {
      themeColor.setAttribute("content", girlMath ? "#ffc0cb" : "#000000");
    }

    let iosBar = document.querySelector(
      "meta[name=apple-mobile-web-app-status-bar-style]"
    );
    if (!iosBar) {
      iosBar = document.createElement("meta");
      iosBar.setAttribute("name", "apple-mobile-web-app-status-bar-style");
      document.head.appendChild(iosBar);
    }
    iosBar.setAttribute("content", girlMath ? "pink" : "black-translucent");
  }, [girlMath]);

  const convert = () => {
    if (!amount) return "0.00";
    if (girlMath) return "💅 it’s free ✨💕";
    return direction === "eur-to-try"
      ? (parseFloat(amount) * rate).toFixed(2)
      : (parseFloat(amount) / rate).toFixed(2);
  };

  const toggleDirection = () => {
    setDirection(direction === "eur-to-try" ? "try-to-eur" : "eur-to-try");
    setAmount("100");
  };

  return (
    <>
      <GlobalStyle girlMath={girlMath} />
      <Container>
        <ModeButton girlMath={girlMath} onClick={() => setGirlMath(!girlMath)}>
          {girlMath ? "Reality 🌍" : "Girl Math 💖"}
        </ModeButton>

        {/* Top Currency Block */}
        <Block>
          <CurrencyRow>
            <Flag
              src={
                direction === "eur-to-try"
                  ? "https://flagcdn.com/w80/eu.png"
                  : "https://flagcdn.com/w80/tr.png"
              }
              alt="flag"
            />
            <Code>{direction === "eur-to-try" ? "EUR" : "TRY"}</Code>
          </CurrencyRow>
          <AmountInput
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <RateInfo girlMath={girlMath}>
            {girlMath
              ? "1 = 1"
              : direction === "eur-to-try"
              ? `1 EUR = ${rate.toFixed(2)} TRY`
              : `1 TRY = ${(1 / rate).toFixed(4)} EUR`}
          </RateInfo>
        </Block>

        {/* Swap Button */}
        <SwapButton girlMath={girlMath} onClick={toggleDirection}>
          ⇅
        </SwapButton>

        {/* Bottom Currency Block */}
        <Block>
          <CurrencyRow>
            <Flag
              src={
                direction === "eur-to-try"
                  ? "https://flagcdn.com/w80/tr.png"
                  : "https://flagcdn.com/w80/eu.png"
              }
              alt="flag"
            />
            <Code>{direction === "eur-to-try" ? "TRY" : "EUR"}</Code>
          </CurrencyRow>
          <AmountDisplay>{convert()}</AmountDisplay>
          <RateInfo girlMath={girlMath}>
            {girlMath
              ? "1 = 1"
              : direction === "eur-to-try"
              ? `1 TRY = ${(1 / rate).toFixed(4)} EUR`
              : `1 EUR = ${rate.toFixed(2)} TRY`}
          </RateInfo>
        </Block>
      </Container>
    </>
  );
}

export default App;
