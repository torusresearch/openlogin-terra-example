import React, { useEffect, useState } from "react";
import OpenLogin from "openlogin";
import AccountInfo  from "../../components/AccountInfo";
import { MnemonicKey } from "@terra-money/terra.js"
import { entropyToMnemonic } from 'bip39';
import "./style.scss";


function Login() {

  const [loading, setLoading] = useState(false);
  const [openlogin, setSdk] = useState(undefined);
  const [accountInfo, setUserAccount] = useState(null);
  const [terraKey, setPrivateKey] = useState(null)
  const [torusNetwork, setTorusNetwork] = useState(null)

  useEffect(() => {
    const defaultNetwork = localStorage.getItem('network') || 'testnet'
    setTorusNetwork(defaultNetwork)
  },[])
  useEffect(() => {
    setLoading(true);
    async function initializeOpenlogin() {
      const sdkInstance = new OpenLogin({
        clientId: "ADD_YOUR_CLIENT_ID", // your project id
        network: localStorage.getItem('network') || 'testnet',
      });
      await sdkInstance.init();
      if (sdkInstance.privKey) {
        const userInfo = await sdkInstance.getUserInfo()
        console.log('user info', userInfo)

        const privateKey = sdkInstance.privKey;
        const terraKey = getTerraPrivateKey(privateKey);
        setPrivateKey(terraKey);
        setUserAccount(userInfo)
      }
      setSdk(sdkInstance);
      setLoading(false);
    }
    initializeOpenlogin();
  }, [torusNetwork]);


  const getTerraPrivateKey = (openloginKey)=>{
    const mnemonic_phrase = entropyToMnemonic(openloginKey);
    const mk = new MnemonicKey({
        mnemonic: mnemonic_phrase, // optional, will be random if not provided
        coinType: 330, // optional, default
        account: 0, // optional, default
        index: 0, // optional, default
    });
    
    console.log("account 0, index 0 key", mk.privateKey.toString('hex'))
    return  mk.privateKey.toString('hex')
  }

  async function handleLogin() {
    setLoading(true)
    try {
      const privKey = await openlogin.login({
        redirectUrl: `${window.origin}`,
        relogin: true
      });
      if(privKey && typeof privKey === "string") {
        const userInfo = await openlogin.getUserInfo()
        console.log('user info', userInfo)
        const terraKey = getTerraPrivateKey(privKey);
        setPrivateKey(terraKey);
        setUserAccount(userInfo)
      } 
    
      setLoading(false)
    } catch (error) {
      console.log("error", error);
      setLoading(false)
    }
  }

  const handleLogout = async (fastLogin=false) => {
    setLoading(true)
    await openlogin.logout({
       fastLogin
    });
    setLoading(false)
  };

  const onChangeTorusNetwork = async (e)=>{
    console.log("vla", e.target.value)
    localStorage.setItem('network',e.target.value)
    setTorusNetwork(e.target.value)
    await openlogin._cleanup()

  }
  return (
    <>
    {
    loading ?
      <div>
          <div style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center", margin: 20 }}>
              <h1>....loading</h1>
          </div>
      </div> :
      <div>
        {
          (openlogin && openlogin.privKey) ?
            <AccountInfo
              handleLogout={handleLogout}
              loading={loading}
              privKey={terraKey}
              account={accountInfo}
            /> :
            <div className="loginContainer">
                <h1 style={{ textAlign: "center" }}>Openlogin x Terra</h1>
                <div onClick={handleLogin} className="btn">
                  Login
                </div>
                <select value={torusNetwork} onChange={onChangeTorusNetwork} style={{ margin: 20 }}>
                  <option id="mainnet">mainnet</option>
                  <option id="testnet">testnet</option>
                </select>
            </div>
        }

      </div>
    }
    </>
  );
}

export default Login;
